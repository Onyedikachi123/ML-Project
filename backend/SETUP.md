# Backend Setup Guide

## 1. Prerequisites

### Python 3.11 (Required)

This project **strictly requires Python 3.11**. Python 3.12+ and 3.13 are NOT
supported due to compatibility issues with `lightgbm` and `pydantic-core`.

**Install via Homebrew:**

```bash
brew install python@3.11
```

### OpenMP (Required for LightGBM on macOS)

LightGBM requires OpenMP to be installed and linked on macOS (Apple Silicon).

**Install via Homebrew:**

```bash
brew install libomp
brew link --force libomp
```

## 2. Environment Setup

### Create Virtual Environment

Ensure you are using Python 3.11:

```bash
/opt/homebrew/bin/python3.11 -m venv venv
source venv/bin/activate
```

### Install Dependencies

You **MUST** export the following flags before installing requirements to ensure
LightGBM builds correctly against OpenMP.

```bash
export CFLAGS="-Xpreprocessor -fopenmp -I/opt/homebrew/opt/libomp/include"
export LDFLAGS="-L/opt/homebrew/opt/libomp/lib -lomp"
pip install -r requirements.txt
```

## 3. Running the Server

```bash
uvicorn app.main:app --reload
```
