// CREATE TABLE [dbo].[sessions](
//   [sid] [nvarchar](255) NOT NULL PRIMARY KEY,
//   [session] [nvarchar](max) NOT NULL,
//   [expires] [datetime] NOT NULL
// )

import session from "express-session";
import MSSQLStore from "connect-mssql-v2";
import dotenv from "dotenv";
dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost",
  options: {
    trustServerCertificate: true,
  },
};

export default function (app) {
  app.use(
    session({
      store: new MSSQLStore(sqlConfig),
      secret: "supersecret",
      resave: false,
      saveUninitialized: true,
    })
  );
}
