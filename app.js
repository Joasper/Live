require("dotenv").config();

const { init } = require("bot-ws-plugin-openai");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const inscriptionflow = require("./src/flows/inscription.flow");
const agents = require("./utils/agents");
const storeflow = require("./src/flows/store.flow");
const projectflow = require("./src/flows/project.flow");
const giveVoicenoteflow = require("./src/flows/giveVoiceNote.flow");
const answerIAflow = require("./src/flows/answerIAflow");
const inscriptionAudio = require("./src/flows/inscriptionAudio.flow");
const welcomeIAflow = require("./src/flows/welcomeIA.flow");
const { dbConecction } = require("./Api/Config");
const TraerDatos = require("./src/flows/TraerDatos");

const employeesAddonConfig = {
  model: "gpt-3.5-turbo-16k",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
};

const employeesAddon = init(employeesAddonConfig);

employeesAddon.employees(agents);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterProvider = createProvider(BaileysProvider);
  dbConecction();
  const adapterFlow = createFlow([
    welcomeIAflow,
    inscriptionflow,
    storeflow,
    projectflow,
    answerIAflow,
    inscriptionAudio,
    giveVoicenoteflow,
    TraerDatos,
  ]);

  const configBot = {
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  };

  const configExtra = {
    extensions: {
      employeesAddon,
    },
  };
  createBot(configBot, configExtra);

  QRPortalWeb();
};

main();
