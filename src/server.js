const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const routes = require("./application/v1/routes/routes");
const routines = require("./infrastructure/routines/routines");
const notFound = require("./application/v1/routes/not-found");

app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(bodyParser.raw());
app.use(routines());
app.use("/api/v1", routes);
app.use(notFound);

module.exports = app;
