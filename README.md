# Patient Register

Simple clinic pharmacy ledger for one chemist and one doctor. The chemist logs each patient (name, medicines, address, amount). Both can see today’s list and ₹ total, or open a past day.

Frontend (React) is added after the API checks below pass.

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

If MongoDB is not local, set `MONGODB_URI` in `server/.env`. Atlas is not required.

## Run the API

```powershell
cd server
npm install
npm run seed
npm run dev
```

- API: [http://localhost:4747](http://localhost:4747)
- Health: [http://localhost:4747/api/health](http://localhost:4747/api/health)

`npm run seed` clears the `entries` collection and inserts 12 sample rows (today and yesterday, Asia/Kolkata). Running it again replaces the same set; it does not stack duplicates.

### Environment (`server/.env`)

```
PORT=4747
MONGODB_URI=mongodb://127.0.0.1:27017/patient_register
```

If MongoDB is down, the server logs a clear error and exits.

## API

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/health` | `{ ok: true }` |
| GET | `/api/entries?date=YYYY-MM-DD` | Missing `date` → today IST. Newest first. |
| POST | `/api/entries` | Body: `{ patientName, address, medicines, amount }` |

All day totals use **Asia/Kolkata**. There is no PUT or DELETE in v1.

## Backend checks

From PowerShell (server already running on port 4747):

### Health

```powershell
curl.exe http://localhost:4747/api/health
```

### 1. Empty / unknown date → zeros and `[]`

```powershell
curl.exe "http://localhost:4747/api/entries?date=1999-01-01"
```

Expect `"patientCount":0`, `"totalAmount":0`, `"lastEntry":null`, `"entries":[]`.

Invalid date → 400:

```powershell
curl.exe "http://localhost:4747/api/entries?date=2026-02-31"
```

### 2. POST valid entry → 201, then GET today includes it and total increased

```powershell
curl.exe "http://localhost:4747/api/entries"

curl.exe -X POST http://localhost:4747/api/entries `
  -H "Content-Type: application/json" `
  -d "{\"patientName\":\"Kiran Joshi\",\"address\":\"Lake view colony\",\"medicines\":\"Crocin 500 (10 tab)\",\"amount\":75}"

curl.exe "http://localhost:4747/api/entries"
```

Expect 201 with `entry` and `today`. Second GET: `patientCount` +1, `totalAmount` +75, Kiran in `entries`.

### 3. POST missing name → 400 field error

```powershell
curl.exe -X POST http://localhost:4747/api/entries `
  -H "Content-Type: application/json" `
  -d "{\"address\":\"Ward 1 lane\",\"medicines\":\"ORS pkt\",\"amount\":50}"
```

Expect `{ "errors": { "patientName": "..." } }`.

### 4. POST amount 0 or negative → 400

```powershell
curl.exe -X POST http://localhost:4747/api/entries `
  -H "Content-Type: application/json" `
  -d "{\"patientName\":\"Test Patient\",\"address\":\"Ward 1 lane\",\"medicines\":\"ORS pkt\",\"amount\":0}"

curl.exe -X POST http://localhost:4747/api/entries `
  -H "Content-Type: application/json" `
  -d "{\"patientName\":\"Test Patient\",\"address\":\"Ward 1 lane\",\"medicines\":\"ORS pkt\",\"amount\":-10}"
```

### 5. Yesterday total does not change after today’s POST

Replace `YYYY-MM-DD` with yesterday in Asia/Kolkata (today minus one calendar day).

```powershell
curl.exe "http://localhost:4747/api/entries?date=YYYY-MM-DD"
# POST a today entry (check 2)
curl.exe "http://localhost:4747/api/entries?date=YYYY-MM-DD"
```

`patientCount` and `totalAmount` for yesterday stay the same.
