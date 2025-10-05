const express = require('express');
const app = express();
const readOnly = require('./config/readPublic');
const webRoutes = require('./routes/web');

readOnly(app);
app.use('/', webRoutes);

require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'local'}`
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});