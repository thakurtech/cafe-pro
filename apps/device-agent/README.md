# Device Agent

Local Node.js service that bridges the browser/POS web app to cafe hardware.

Initial responsibilities:

- thermal receipt printers
- kitchen printers
- cash drawer trigger
- optional barcode scanner bridge

The agent must never receive or persist Supabase service-role credentials.

Production design must include:

- device pairing
- local authentication
- signed requests from merchant web
- audit logging
- printer health/status
- retry handling
- OS-specific installers or managed deployment
