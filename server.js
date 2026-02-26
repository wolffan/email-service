const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'vtl_service',
  host: 'localhost',
  database: 'email_service',
  password: 'vtl_password',
  port: 5432,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL');
    release();
  }
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      db_time: result.rows[0].now
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Add email to waitlist
app.post('/api/waitlist', async (req, res) => {
  const { email, site } = req.body;

  console.log(`POST /api/waitlist - email: ${email}, site: ${site}`);

  // Validation
  if (!email || !site) {
    return res.status(400).json({ message: 'Email and site are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO waitlist (email, site) VALUES ($1, $2) ON CONFLICT (email, site) DO NOTHING RETURNING id',
      [email, site]
    );

    if (result.rows.length > 0) {
      res.status(201).json({
        message: 'Email added successfully',
        id: result.rows[0].id
      });
    } else {
      res.status(409).json({
        message: 'Email already exists for this site'
      });
    }
  } catch (error) {
    console.error('Error adding email:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get waitlist entries (optionally filtered by site)
app.get('/api/waitlist', async (req, res) => {
  const { site, export: isExport } = req.query;

  try {
    let query = 'SELECT id, email, site, created_at FROM waitlist';
    const params = [];

    if (site) {
      query += ' WHERE site = $1 ORDER BY created_at DESC';
      params.push(site);
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const result = await pool.query(query, params);

    if (isExport === 'true') {
      // Export as CSV
      const headers = 'id,email,site,created_at\n';
      const rows = result.rows
        .map(row => `${row.id},${row.email},${row.site},${row.created_at}`)
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=waitlist.csv');
      res.send(headers + rows);
    } else {
      res.json({
        site: site || 'all',
        count: result.rowCount,
        emails: result.rows
      });
    }
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Email service listening on port ${PORT}`);
    console.log("Connected to PostgreSQL database");
});
