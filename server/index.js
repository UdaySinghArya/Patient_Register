import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDb } from './db.js';
import healthRouter from './routes/health.js';
import entriesRouter from './routes/entries.js';

const app = express();
const PORT = Number(process.env.PORT) || 4747;

app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
  })
);
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api', entriesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ errors: { server: 'Unexpected server error' } });
});

await connectDb();

app.listen(5000, () => {
  console.log(`Patient Register API listening on http://localhost:${5000}`);
});
