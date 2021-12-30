const express = require("express");

const app = express();

require("dotenv").config();
const sql = require("mssql");
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost",
  options: {
    trustServerCertificate: true,
  },
};

app.get("/", async (req, res) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    const donhang = await sql.query`select * from TRIANKHACHHANG`;
    res.json(donhang["recordset"][0]);
  } catch (err) {
    res.send("error");
  }
});

app.listen(3000, () => {
  console.log("listen at port 3000");
});
