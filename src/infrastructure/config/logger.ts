import pino, { LoggerOptions } from "pino";

export function loggerConfig(options: LoggerOptions) {
  return pino(options);
}

export default pino({
  level: "debug",
  colorize: true,
  levelFirst: true,
  translateTime: true,
  ignore: "pid,hostname",
});
