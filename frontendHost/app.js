const express = require('express');
const path = require('path');

const app = express();
const port = 60728;

// ✅ Serve static files from 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
