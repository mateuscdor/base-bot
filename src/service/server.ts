// Importando dependencias
import * as bodyParser from "body-parser";
import express from 'express'
import cors from "cors";

// iImportando rotas
import routes from "../application/v1/routes/routes";
import routines from "../infrastructure/routines/routines";
import notFound from "../application/v1/routes/not-found";

// Iniciando aplicação
const app = express();

// Configurando aplicação
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.raw());
app.use(routines());

app.use("/api/v1", routes);
app.use(notFound);

export default app;
