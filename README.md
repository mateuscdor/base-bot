# Multi-Bot
Um chatbot multi-plataforma em TypeScript.

## 🛠 Recursos
* Multi plataformas
* * WhatsApp
* * Telegram (Em breve)
* * Discord (Em breve)
* Automatização de mensagem
* Criação de comandos
* Tratamento de erros

### 🔧 Instalação
Clonando repositório:
``` sh
git clone https://github.com/laxeder/multi-bot.git
```
Instalando dependencias:
``` sh
npm run build
```

## ⚙️ Iniciando
Para desenvolvimento:
``` sh
npm run dev:linux
# Para Windows:
npm run dev
```
Para Produção:
``` sh
npm run prod:linux
# Para Windows:
npm run prod
```

## WhatsApp
Após iniciar o bot um QR Code será emprimido no terminal, escane-o com seu WhatsApp para gerar uma nova conexão entre seu número e o Bot. Essa conexão será guardada em ```./auth_info_baileys```, para gerar uma nova delete-o ou se conecte com um novo caminho de sessão.
``` ts
// src/application/v1/routes/build.ts

await bot.build("./path-to-session");
```

## 🛠️ Construído com
Esse Software foi construído com:

* [Express](https://github.com/expressjs/express) - Servidor
* [Baileys](https://github.com/adiwajshing/Baileys) - API para se conectar ao WhatsApp

## 📄 Licença
Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](https://github.com/laxeder/multi-bot/LICENSE) para detalhes.