# Patient Register

A small clinic pharmacy ledger for one chemist and one doctor. The chemist records each patient (name, address, medicines given, amount). Both can see today's list and rupee total, or open a past day.

There is no real account system, stock, GST, appointments, or payments. The first screen is a simple clinic gate: pick a static mobile number and PIN `0000`.

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

On Vercel, set `VITE_API_URL` to the Render API origin (no trailing slash), e.g. `https://patient-register-xxxx.onrender.com`, then redeploy. On Render, set `FRONTEND_ORIGIN` to `https://patient-register-chi.vercel.app`.

`npm run seed` clears `users` and `entries`, then inserts 2 clinic users and 12 sample slips (today and yesterday, Asia/Kolkata). Running it again replaces the same set.

### Environment (`server/.env`)

```
PORT=4747
MONGODB_URI=mongodb://127.0.0.1:27017/patient_register
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your.gmail@gmail.com
SMTP_PASS=your-16-char-gmail-app-password
CHEMIST_EMAIL=chemist@gmail.com
DOCTOR_EMAIL=doctor@gmail.com
```

Gmail: 2-Step Verification on karke [App Password](https://myaccount.google.com/apppasswords) banao. Password chat ya git mein mat daalo. Render pe bhi yahi SMTP keys add karo, phir `npm run seed`.

## Pages

| Path | Who uses it | What it shows |
|------|-------------|----------------|
| `/login` | Both | Email OTP. Users come from MongoDB `users` (`CHEMIST_EMAIL`, `DOCTOR_EMAIL`) |
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
| GET | `/api/entries/:id` | One slip |
| PUT | `/api/entries/:id` | Update name, address, medicines, amount |
| DELETE | `/api/entries/:id` | Remove a slip |

## Backend checks

From PowerShell, with the API running:

```powershell
curl.exe http://localhost:4747/api/health
curl.exe "http://localhost:4747/api/entries?date=1999-01-01"
```

Unknown dates return `patientCount` 0, `totalAmount` 0, `lastEntry` null, `entries` []. Missing name or amount 0 / negative returns `400` with `{ "errors": { field: message } }`. A POST for today does not change yesterday's total.
