// Importando dependencias
import axios from "axios";

// Importando servidor e logger
import server from "./src/service/server";
import logger from "./src/infrastructure/config/logger";

// Variaveis de ambiente
const NODE_ENV = process.env.NODE_ENV?.trim();
const PORT = NODE_ENV == "production" ? process.env.PORT : process.env.DEV_PORT;
const HOST = NODE_ENV == "production" ? process.env.HOST : process.env.DEV_HOST;

// Inicializando servidor
server.listen(PORT, async () => {
  try {
    logger.info(`Servidor subido na porta: ${PORT}`);

    // construindo bot para WhatsApp
    const connect = await axios.post(`${HOST}/build`, {
      plataform: "whatsapp",
    });

    if (connect.status !== 200) {
      return logger.error(`Erro ao construir bot. ${JSON.stringify(connect, ["\n"], 2)}`);
    }
  } catch (err: any) {
    logger.error(`Erro ao iniciar servidor. ${err?.response?.data?.message || err?.stack}`);
  }
});
