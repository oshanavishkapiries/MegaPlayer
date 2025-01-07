const express = require('express');
const cors = require('cors');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');
const { Storage } = require('megajs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Mega authentication setup
const { MEGA_EMAIL, MEGA_PASSWORD } = require('./config/config.js');
const storage = new Storage({
  email: MEGA_EMAIL,
  password: MEGA_PASSWORD
});

storage.ready.then(() => {
  console.log('Authenticated with Mega account successfully');
}).catch(err => {
  console.error('Failed to authenticate:', err);
});

// Routes
app.use('/', videoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
