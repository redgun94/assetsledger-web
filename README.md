# AssetsLedger Web

Angular client for **AssetsLedger**, a proof-of-funds platform for mortgage loan officers. Loan officers sign up, complete their professional profile, manage their borrowers and, in a later phase, verify borrowers' assets through Plaid.

This repository is the front end. It consumes the AssetsLedger REST API, built with Spring Boot 4, Spring Security (JWT) and PostgreSQL, which lives in its own repository.

> **Status:** early development. The project is scaffolded; the features below are being built one by one.

## Tech stack

- Angular 19 (standalone components)
- TypeScript 5.7
- RxJS 7
- Karma + Jasmine for unit tests

## Features

| Feature | Route | Backend endpoints | Status |
| --- | --- | --- | --- |
| Sign up and log in | `/register`, `/login` | `POST /api/v1/auth/register`, `POST /api/v1/auth/login` | Planned |
| Onboarding: professional profile and company search | `/onboarding` | `GET /api/v1/me`, `GET`/`POST /api/v1/companies`, `POST /api/v1/me/loan-officer` | Planned |
| Borrower dashboard | `/clients` | `GET`/`POST /api/v1/me/clients` | Planned |
| Borrower detail | `/clients/:id` | `GET`/`PUT`/`DELETE /api/v1/me/clients/{clientId}` | Planned |
| Asset verification (Plaid) | — | Not built yet in the API | Later phase |

## Project structure

The code is organized by feature, mirroring the package-by-feature layout of the backend:

```
src/app/
├── core/                 # Loaded once for the whole app
│   ├── auth.service.ts       # Logs in and stores the token
│   ├── auth.interceptor.ts   # Adds the Authorization header to every API call
│   ├── auth.guard.ts         # Protects routes that require a session
│   └── app.routes.ts         # Lazy-loads each feature by URL
├── features/
│   ├── auth/             # Login and registration
│   ├── onboarding/       # Professional profile and company search
│   └── clients/          # Borrower list, detail, form and service
└── shared/               # Reusable UI pieces (status badge, layout, buttons, form errors)
```

## User flow

1. `/register` creates the account (status `PENDING_PROFILE`).
2. `/login` returns a JWT access token.
3. The auth guard lets the user into protected routes.
4. `GET /api/v1/me` reports the account status.
5. `/onboarding`: the loan officer completes the profile and selects or registers their company; the account becomes `ACTIVE`.
6. `/clients`: the borrower dashboard.

## Getting started

### Prerequisites

- Node.js 18.19+, 20.11+ or 22 (supported by Angular 19)
- Angular CLI 19: `npm install -g @angular/cli`
- The AssetsLedger API running locally on `http://localhost:9000`, with `app.cors.allowed-origins` set to `http://localhost:4200`

### Install and run

```bash
npm install
ng serve
```

Open `http://localhost:4200`. The app reloads automatically when source files change.

### Other commands

| Command | What it does |
| --- | --- |
| `ng build` | Production build into `dist/` |
| `ng test` | Unit tests with Karma and Jasmine |
| `ng generate component features/<feature>/<name>` | Creates a component inside a feature folder |

## Security notes

- Authentication is handled by the API with stateless JWT access tokens. The front end sends the token in the `Authorization: Bearer` header through an HTTP interceptor.
- Every borrower query is scoped on the server to the profile in the token, so the front end never sends an owner id.
- Server-side validation errors arrive as RFC 9457 `ProblemDetail` responses with a field-level `errors` map, which forms display under each field.

## License

© 2026 Leandro Boucourt. All rights reserved.
