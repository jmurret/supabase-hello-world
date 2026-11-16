const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: (process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL) + '/' + process.env.POSTGRES_DATABASE + '?sslmode=require',
});

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/countries' && req.method === 'GET') {
    try {
      const result = await pool.query('SELECT name FROM public.countries ORDER BY name');
      const countries = result.rows.map(row => row.name).join('</li><li>');
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Countries</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; max-width: 600px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Countries</h1>
            <table>
              <thead>
                <tr><th>Name</th></tr>
              </thead>
              <tbody>
                ${result.rows.map(row => `<tr><td>${row.name}</td></tr>`).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      console.error('Database query error:', error);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>Error</h1><p>${error.message}</p>`);
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>hhello    world!!!!1 wooo!!1!!</h1>');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});