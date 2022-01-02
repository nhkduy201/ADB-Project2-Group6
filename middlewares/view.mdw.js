import { engine } from "express-handlebars";
import hbs_sections from "express-handlebars-sections";
import numeral from "numeral";
import moment from "moment";

export default function (app) {
  app.engine(
    "hbs",
    engine({
      defaultLayout: false,
      helpers: {
        format_price(val) {
          return numeral(val).format("0,0");
        },

        format_percent(val) {
          return numeral(val).format("0.0%");
        },
        format_date(date){
            var d = new Date(date);
            return moment(d).subtract(7, 'h').format("DD/MM/YYYY HH:mm:ss");
        },
        section: hbs_sections(),
      },
    })
  );
  app.set("view engine", "hbs");
  app.set("views", "./views");
}
