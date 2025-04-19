const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const axios = require('axios');
//const cors = require('cors');
const path = require('path');
const auth_routes = require('./auth_routes');
const artist_routes = require('./artist_routes');

const app = express();
//app.use(cors({origin: ['http://localhost:4200'],credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/api/test', (req, res) => res.send(`testing, All good!`));
app.get('/api/ip', async (req, res) => {
  const response = await axios.get('https://api.ipify.org?format=json');
  res.send(response.data);
})
app.use('/api/auth', auth_routes);
app.use('/api', artist_routes);
app.use(express.static(path.join(__dirname, '../frontend/dist/artsy-app/browser')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/artsy-app/browser/index.html'));
});

const PORT = 8080;
const MONGO_URI = "[+]MONGO_URI"; // paste Mongo database access url here
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));
  }
  );
