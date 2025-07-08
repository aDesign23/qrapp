const express = require('express');
const path = require('path');
const contentRoute = require('./routes/contentRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Mount the content route
app.use('/api', contentRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 