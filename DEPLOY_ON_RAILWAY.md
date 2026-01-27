# Deploying FastAPI + XGBoost on Railway with Docker

This guide explains how to deploy the updated backend on
[Railway](https://railway.app/) using Docker.

## Prerequisites

- A GitHub repository with this project pushed.
- A Railway account.

## Project Structure Changes

We have updated the project to be Docker-native for Railway:

- **Dockerfile**: Updated to use `python:3.11-slim` and install necessary system
  dependencies (`libgomp1` for XGBoost).
- **requirements.txt**: Updated with `uvicorn[standard]`, `xgboost`, and pinned
  versions.
- **main.py**: Added XGBoost verification and demo endpoints.
- **Removed**: `railway.json` (to ensure Railway uses the Dockerfile instead of
  Nixpacks).

## Deployment Steps

### 1. Push Changes to GitHub

Commit and push your changes (including the new Dockerfile and
`requirements.txt`) to your repository.

```bash
git add .
git commit -m "Update backend for Docker deployment with XGBoost support"
git push origin main
```

### 2. Create a New Project on Railway

1. Log in to your Railway dashboard.
2. Click **+ New Project**.
3. Select **Deploy from GitHub repo**.
4. Choose your repository from the list.

### 3. Configure the Service

Once the service is created, you need to configure the **Root Directory** so
Railway knows where to find the Dockerfile.

1. Click on the new Service card in your Railway project.
2. Go to the **Settings** tab.
3. Scroll down to the **General** section.
4. Locate **Root Directory** and set it to:
   ```
   backend
   ```
   _(This is critical because the Dockerfile lives inside the `backend/`
   folder)_.

### 4. Verify Deploy Mode (Automatic)

Railway should automatically detect the `Dockerfile` inside `backend/` and
switch the configured builder to **Docker**.

- You can verify this in **Settings** > **Build** > **Builder**. It should
  verify as "Docker File".

### 5. Deployment

Changes to the settings usually trigger a redeploy. If not, click **Deploy**
manually at the top right (or in the Deployments tab).

Monitor the **Build Logs**. You should see steps like:

- `FROM python:3.11-slim`
- `apt-get install -y ... libgomp1`
- `Pip installing dependencies...`

### 6. Verify the Application

Once the status is **Active** (green), click on the generated URL (e.g.,
`https://web-production-xxxx.up.railway.app`).

**Test Endpoints:**

1. **Health Check**:
   - `GET /` -> `{"status": "healthy", ...}`

2. **XGBoost Info**:
   - `GET /api/xgboost-info` -> Returns versions of XGBoost, Pandas, Numpy.

3. **Predict Demo**:
   - Send a POST request to `/api/predict-demo`
   - **Body (JSON)**: `{"features": [0.5, 0.5]}`
   - **Response**: `{"prediction": 0.xxxx}`

   _Note: Using curl:_
   ```bash
   curl -X POST https://your-app-url.up.railway.app/api/predict-demo \
     -H "Content-Type: application/json" \
     -d '{"features": [2.0, 3.0]}'
   ```

## Troubleshooting

- **Build Error: "xgboost not found"**: Ensure `requirements.txt` is in the
  `COPY` command range (handled by `COPY requirements.txt .`).
- **Runtime Error: "libgomp.so.1: cannot open shared object file"**: This means
  `libgomp1` wasn't installed. The new Dockerfile includes this fix.
- **Port Error**: The Dockerfile exposes port 8000. Railway automatically maps
  this to `$PORT` internally or detects the exposed port.

You are now production-ready!
