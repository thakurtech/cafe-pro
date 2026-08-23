import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();
app.listen(env.API_PORT, () => {
  console.log(`Restaurant OS API listening on ${env.API_PORT}`);
});
