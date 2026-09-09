# Patient Register

A small clinic pharmacy ledger for one chemist and one doctor. The chemist records each patient (name, address, medicines given, amount). Both can see today's list and rupee total, or open a past day.

There is no login, stock, GST, appointments, or payments.

## Prerequisites

- Node.js 18+
- [MongoDB Community](https://www.mongodb.com/try/download/community) running locally on `mongodb://127.0.0.1:27017`

If MongoDB is not local, set `MONGODB_URI` in `server/.env`. Atlas is not required. If MongoDB is down, the API prints a clear error and exits.

## Run

Terminal 1 — API:

```powershell
cd server
npm install
npm run seed
npm run dev
```

Terminal 2 — web app:

```powershell
cd client
npm install
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:4747](http://localhost:4747)
- Vite proxies `/api` to `http://127.0.0.1:4747`

`npm run seed` clears the register and inserts 12 sample slips (today and yesterday, Asia/Kolkata). Running it again replaces the same set.

### Environment (`server/.env`)

```
PORT=4747
MONGODB_URI=mongodb://127.0.0.1:27017/patient_register
```

## Pages

| Path | Who uses it | What it shows |
|------|-------------|----------------|
| `/` | Doctor and chemist | Today's patients, collection, last entry, Add patient |
| `/entries/new` | Chemist | Dispensing slip — name, address, medicines, amount |
| `/report` | Doctor and chemist | Pick a date; that day's list and total |

Daily totals use the calendar day in **Asia/Kolkata**.

## Example POST

```powershell
curl.exe -X POST http://localhost:4747/api/entries `
  -H "Content-Type: application/json" `
  -d "{\"patientName\":\"Kiran Joshi\",\"address\":\"Lake view colony\",\"medicines\":\"Crocin 500 (10 tab)\",\"amount\":75}"
```

Then open `/` — the new patient should appear and today's total should increase.

## API

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/health` | `{ ok: true }` |
| GET | `/api/entries?date=YYYY-MM-DD` | Missing `date` → today IST. Newest first. |
| POST | `/api/entries` | Body: `{ patientName, address, medicines, amount }` |

## Backend checks

From PowerShell, with the API running:

```powershell
curl.exe http://localhost:4747/api/health
curl.exe "http://localhost:4747/api/entries?date=1999-01-01"
```

Unknown dates return `patientCount` 0, `totalAmount` 0, `lastEntry` null, `entries` []. Missing name or amount 0 / negative returns `400` with `{ "errors": { field: message } }`. A POST for today does not change yesterday's total.
