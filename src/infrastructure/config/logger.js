const pino = require("pino");
const pretty = require("pino-pretty");

const stream = pretty({
  colorize: true,
  level: "debug",
  levelFirst: true,
  translateTime: true,
  ignore: "pid,hostname",
});

const logger = pino(stream);

module.exports = logger;
