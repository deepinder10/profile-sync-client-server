const express = require('express');
const cors = require('cors');
const logger = require('pino-http');
const userRoutes = require('./routes/user.routes');
const app = express();

app.use(logger())
app.use(express.json());
app.use(cors());
app.use('/api/user', userRoutes);

module.exports = app;
