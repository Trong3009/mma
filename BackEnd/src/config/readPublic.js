const path = require('path');
const express = require('express');

const readOnly = (app) => {
    app.use('/public', express.static(path.join(__dirname, '../public')));
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
}

module.exports = readOnly;