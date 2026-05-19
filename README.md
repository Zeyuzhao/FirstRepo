# FirstRepo

A small Flask starter project with an app factory, templates, static assets, and tests.

## Requirements

- Python 3.10+

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

## Run

```bash
python -m flask --app app run --host 0.0.0.0 --port 3000 --debug
```

Open `http://127.0.0.1:3000` in this sandbox, or use the Jiro preview for port 3000.

## Test

```bash
pytest
```
