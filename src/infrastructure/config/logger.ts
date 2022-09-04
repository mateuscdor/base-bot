import pino, { LoggerOptions } from "pino";
import pretty from "pino-pretty";

export function loggerConfig(options: LoggerOptions) {
  return pino(options);
}

export default pino(
  pretty({
    colorize: true,
    levelFirst: true,
    translateTime: true,
    ignore: "pid,hostname",
  })
);
