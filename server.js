//server.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./Database/MongodbConfiguration');
const routes = require('./Routes/Routes');
const cors = require('cors'); 
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

connectDB();
const PORT = process.env.PORT || 4000;

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}/`);
});