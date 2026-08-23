import express from 'express';

const app = express();
app.use(express.json({ limit: '256kb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'device-agent' }));

app.post('/print', async (_req, res) => {
  // TODO: implement printer adapter selected by configured device profile.
  return res.status(501).json({ error: 'PRINTER_NOT_IMPLEMENTED' });
});

app.listen(47821, () => console.log('Restaurant OS device agent listening on 47821'));
