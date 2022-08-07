// Importando dependencias
const axios = require("axios").default;
const graceful = require("graceful");

// Importando arquivos
const server = require("./src/server");
const logger = require("./src/infrastructure/config/logger");

// Variaveis de ambiente
const NODE_ENV = process.env.NODE_ENV?.trim();
const PORT = NODE_ENV == "production" ? process.env.PORT : process.env.DEV_PORT;
const SHUTDOWN = NODE_ENV == "production" ? process.env.SHUTDOWN : process.env.DEV_SHUTDOWN;
const HOST = NODE_ENV == "production" ? process.env.HOST : process.env.DEV_HOST;

// Inicializando servidor
const srv = server.listen(PORT, async () => {
  try {
    logger.info(`servidor subido na porta: ${PORT}`);
    
    // construindo bot para WhatsApp
    const connect = await axios.post(`${HOST}/build`, {
      plataform: "whatsapp",
    });

    if (connect.status !== 200) {
      return logger.error(`erro ao construir bot. ${JSON.stringify(connect, "\n", 2)}`);
    }
  } catch (e) {
    logger.error(`erro ao construir bot. ${e.response?.data?.message || e.stack}`);
  }
});

// Desligar software com elegancia
graceful({
  servers: [srv],
  killTimeout: SHUTDOWN,
});
