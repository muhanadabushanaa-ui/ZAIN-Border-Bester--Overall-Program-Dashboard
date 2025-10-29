# ZOI KPI Viewer (Static, No-Login)

A lightweight dashboard viewer that fetches KPI trends and recent PDF reports from your n8n Webhook APIs.
Ideal for managers to view progress without logging into admin apps.

## How it works
- Static files (HTML/JS/CSS). Host anywhere (Netlify, GitHub Pages, S3, Nginx).
- Reads JSON from:
  - `${BASE_URL}/webhook/kpi/summary` (KPI data)
  - `${BASE_URL}/webhook/reports/list` (recent PDFs)

## Setup
1) Edit `config.js` and set `BASE_URL` to your n8n host (e.g., `https://zoidashboard.app.n8n.cloud`).
2) Ensure you imported the n8n flows in `n8n/` to expose those endpoints.
3) Deploy the `zoi-kpi-viewer/` folder to any static hosting.

## Notes
- If your n8n APIs require auth, you can add a simple token in `config.js` and in your Workflows (check headers).
