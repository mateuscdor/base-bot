const pino = require("pino");

//? Cria um logger que não registra nada
const logger = pino({ level: "silent" });

module.exports = logger;
