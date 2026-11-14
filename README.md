# Cable-Stayed Bridge | Structural Health & Fatigue Digital Twin

A research-oriented full-stack workbench for a **cable-stayed highway bridge**.
This is a distinctly structured bridge-deck operational interface with deck elevation,
cable-force diagnostics, modal spectrum, strain rosettes, axle-loading timeline, fatigue
ledger, and alert triage. Data are simulated unless externally provided through the API.

## Intended use and boundaries

This is **not** a structural inspection certification, safety-of-life warning system,
or a replacement for a licensed structural engineer. Modal, sag, and fatigue equations
are simplified research proxies. Calibration factors and generated policy functions are
synthetic. Do not use results to authorize traffic, close lanes, or make emergency calls.

## Stack and architecture

- Backend: Python 3.12, FastAPI, Pydantic v2, async streaming, bounded event ring.
- Frontend: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 3.
- Infrastructure: PostgreSQL 16 schema in four SQL migrations, Redis in Docker Compose.
- Deployment examples: Docker Compose, Kubernetes manifest, GitHub Actions YAML.
- Six category-specific rule catalogues: modal, strain, cables, wind, thermal, fatigue.
- All 6,000 generated rule functions are computationally executable and deterministic.
  Their coefficients are illustrative and **not** experimentally validated.

## Domain equations and data conventions

1. Axial stress `sigma = E * epsilon`, with engineering strain dimensionless.
2. Cable force proxy `T = 4 * mu * L^2 * f^2`, for ideal uniform vibrating cable.
3. Damage fraction `D = sum(n_i/N_i)` from a simplified S-N exposure assumption.
4. Frequency deviation `% = 100 * abs(f_measured - f_baseline) / f_baseline`.
5. Longitudinal thermal movement `delta_L = alpha * L * delta_temperature`.
6. Damped mode decay proxy `A(t) = A0 * exp(-zeta*omega*t)`.

The baseline bridge has 15 individual cable pairs, 8 deck sensing stations,
6 modal frequencies and multiple inspection records. All UI numbers carry units.

## REST and streaming endpoints

- `GET /health` health and runtime mode.
- `GET /api/v1/overview` immutable engineering dashboard snapshot.
- `GET /api/v1/sensors` list configured sensing channels.
- `GET /api/v1/inspections` inspection ledger.
- `POST /api/v1/analyze` evaluate a validated bridge observation.
- `POST /api/v1/scenarios` compare a constrained user-specified scenario.
- `POST /api/v1/ingest` push observations, requires `X-Operator-Key`.
- `GET /api/v1/policies/{category}/{number}` evaluate a synthetic policy case.
- `GET /api/v1/events` return bounded log of recently ingested observations.
- `GET /api/v1/stream` text/event-stream live **synthetic** telemetry.

## Local development

```sh
cd backend
python -m pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8000
```

Then separately:

```sh
cd frontend
npm install
npm run dev
```

Access `http://localhost:3000`. Configure `NEXT_PUBLIC_API_BASE_URL` for the API.
No live operator key is stored. For sensor ingestion, set `OPERATOR_API_KEY`
server-side and supply it via `X-Operator-Key` from a trusted ingestion client.

## Validation and limitations

Archive tests measure file count, lines, formatting, secrets and syntax.
Python unit tests check calibrated equations only as **mathematical implementations**.
Production deployment requires real device integrations, durable database persistence,
end-to-end authorization, operational change management, load testing, observability,
and independent professional engineering review.
