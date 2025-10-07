import path from 'path';
import express from 'express';
export const readOnly = (app) => {
    app.use('/public', express.static(path.join(__dirname, '../public')));
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
};
//# sourceMappingURL=readPublic.js.map