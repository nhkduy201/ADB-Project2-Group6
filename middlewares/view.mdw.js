import { engine } from 'express-handlebars';

export default function (app) {
    app.engine('hbs', engine({
        defaultLayout: false,
    }));
    app.set('view engine', 'hbs');
    app.set('views', './views');
}