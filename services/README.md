# Railway Services

This directory contains the Railway-side operational backend for Oasis Token Arcade.

Recommended Railway services:

- `ops-api`: authenticated internal API for enqueueing jobs, receiving webhooks, and sponsorship verification
- `worker`: BullMQ consumer that prepares manual distribution queues, updates job status, and writes operational records back to MongoDB Atlas
- `cron`: scheduled runner for attendance rewards, campaign cleanup, analytics sync, and gas reporting

Recommended managed services:

- `redis`: BullMQ backing store

Each service is intentionally independent so Railway can deploy it with the service root set to the relevant folder.

Common environment variables:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `REDIS_URL`

`ops-api` also expects:

- `OPS_API_TOKEN`
- `APP_BASE_URL`
- `SPONSORSHIP_SHARED_SECRET`

Optional later, if you decide to automate onchain distribution with thirdweb Engine:

- `THIRDWEB_ENGINE_URL`
- `THIRDWEB_ENGINE_ACCESS_TOKEN`

Suggested Railway layout:

1. Create `redis`
2. Create `ops-api` from `services/ops-api`
3. Create `worker` from `services/worker`
4. Create `cron` from `services/cron`
5. Wire shared variables using Railway references where possible
