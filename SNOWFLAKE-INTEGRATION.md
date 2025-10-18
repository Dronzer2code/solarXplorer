# Snowflake Integration Guide

This guide walks you through connecting the Astral 3D project to Snowflake using a secure server-side integration. The flow below keeps credentials off the client, surfaces only the data you need, and works both locally and on Vercel.

---

## 1. Prerequisites
- Snowflake account with permission to create users, roles, and warehouses
- Local Node.js 20.x environment (already in `package.json`)
- Vercel project (for production deployment)

---

## 2. Snowflake Setup
1. **Create or choose a warehouse** sized for the query volume (e.g., `XSMALL`).
2. **Create a dedicated role** for the web app:
   ```sql
   CREATE ROLE ASTRAL_APP_ROLE;
   GRANT USAGE ON WAREHOUSE YOUR_WAREHOUSE TO ROLE ASTRAL_APP_ROLE;
   GRANT USAGE ON DATABASE YOUR_DATABASE TO ROLE ASTRAL_APP_ROLE;
   GRANT USAGE ON SCHEMA YOUR_DATABASE.PUBLIC TO ROLE ASTRAL_APP_ROLE;
   GRANT SELECT ON ALL TABLES IN SCHEMA YOUR_DATABASE.PUBLIC TO ROLE ASTRAL_APP_ROLE;
   GRANT SELECT ON FUTURE TABLES IN SCHEMA YOUR_DATABASE.PUBLIC TO ROLE ASTRAL_APP_ROLE;
   ```
3. **Create a user for the project**, assign the role, and set a strong password:
   ```sql
   CREATE USER ASTRAL_APP_USER
     PASSWORD = 'UseAStrongPassword!'
     DEFAULT_ROLE = ASTRAL_APP_ROLE
     DEFAULT_WAREHOUSE = YOUR_WAREHOUSE
     DEFAULT_NAMESPACE = YOUR_DATABASE.PUBLIC
     MUST_CHANGE_PASSWORD = FALSE;
   GRANT ROLE ASTRAL_APP_ROLE TO USER ASTRAL_APP_USER;
   ```
4. **Note the account identifier** from Snowflake (`<account>.<region>` format) and keep the user credentials handy for env variables.

---

## 3. Install Snowflake SDK
Add the official Snowflake client library to the project:
```bash
npm install snowflake-sdk
```

> Keep server-side dependencies only; the SDK must never run in the browser. The build script already ignores server code.

---

## 4. Create a Serverless Function for Snowflake Queries
Use the Vercel `api/` directory (already present). Example: `api/snowflake-query.js`.

```javascript
// api/snowflake-query.js
const snowflake = require('snowflake-sdk');

let cachedPool = null;

function getConnection() {
  if (cachedPool) return cachedPool;

  const connection = snowflake.createPool(
    {
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USER,
      password: process.env.SNOWFLAKE_PASSWORD,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
      database: process.env.SNOWFLAKE_DATABASE,
      schema: process.env.SNOWFLAKE_SCHEMA,
      role: process.env.SNOWFLAKE_ROLE,
    },
    {
      max: 5, // adjust for workload
      min: 1,
      retryLimit: 3,
    }
  );

  cachedPool = connection;
  return connection;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { metric = 'PLANET_STATS' } = req.query;

  const pool = getConnection();

  try {
    const result = await new Promise((resolve, reject) => {
      pool.use((clientConnection, done) => {
        clientConnection.execute({
          sqlText: `SELECT * FROM YOUR_DATABASE.PUBLIC.${metric} LIMIT 100`,
          complete: (err, stmt, rows) => {
            done();
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          },
        });
      });
    });

    res.status(200).json({ metric, rows: result });
  } catch (error) {
    console.error('Snowflake query error:', error);
    res.status(500).json({ error: 'Failed to query Snowflake' });
  }
};
```

### Notes
- The pool keeps connections warm in serverless environments.
- Adjust the SQL (`metric` default) to match your schema or expose multiple endpoints for different datasets.
- Add validation/whitelisting for query parameters to avoid SQL injection.

---

## 5. Environment Variables
Create/update `.env.local` (for local dev) and set these in Vercel project settings:

```
SNOWFLAKE_ACCOUNT=<account.region>
SNOWFLAKE_USER=ASTRAL_APP_USER
SNOWFLAKE_PASSWORD=<strong-password>
SNOWFLAKE_WAREHOUSE=YOUR_WAREHOUSE
SNOWFLAKE_DATABASE=YOUR_DATABASE
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_ROLE=ASTRAL_APP_ROLE
```

> Never commit `.env.local`. Use Vercel’s Environment Variables UI for production/separate preview deployments.

---

## 6. Local Testing
1. Ensure `.env.local` contains the variables.
2. Launch the local server:
   ```bash
   npm run dev
   ```
3. Test the API endpoint:
   ```bash
   curl http://localhost:3000/api/snowflake-query
   ```
   or visit the URL in the browser. You should see JSON data (or a helpful error).

---

## 7. Front-End Consumption
In your front-end scripts (e.g., `script.js`), fetch the new endpoint:

```javascript
async function loadSnowflakeData(metric = 'PLANET_STATS') {
  try {
    const response = await fetch(`/api/snowflake-query?metric=${encodeURIComponent(metric)}`);
    if (!response.ok) throw new Error('Snowflake API error');
    const data = await response.json();
    console.log('Snowflake data', data);
    // TODO: Render this data into the UI (cards, charts, etc.)
  } catch (error) {
    console.error('Failed to load Snowflake data:', error);
  }
}

// Example usage on page load
loadSnowflakeData();
```

Call `loadSnowflakeData()` from the sections where you want to display metrics, or attach it to user interactions.

---

## 8. Deployment on Vercel
1. Commit the new `api/snowflake-query.js` and any front-end changes.
2. Set the Snowflake environment variables in Vercel (Production + Preview if needed).
3. Deploy as usual (`git push` or `vercel --prod`).
4. Verify the API route returns data in production.

---

## 9. Security & Optimization Tips
- Restrict the Snowflake role to **read-only** access for only the required tables.
- Rotate the Snowflake user password periodically or use key-pair authentication if desired.
- Implement caching (e.g., Vercel Edge Config or in-memory) for expensive queries.
- Add rate limiting or authentication to the API route if exposing sensitive data.
- Monitor Snowflake credits usage; consider `warehouse` auto-suspend for cost control.

---

## 10. Next Steps
- Build UI components to visualize data retrieved from Snowflake.
- Add POST endpoints for mutations if your use-case requires writes (be sure to harden authentication).
- Integrate analytics by logging Snowflake queries for auditing or performance tracking.

With these steps, your Astral 3D project can securely pull live data from Snowflake, enabling rich, data-driven experiences in the solar system explorer.
