const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const fs = require("fs");
const path = require("path");
const typing = require("../../utils/texting");

const vidPath = path.resolve(__dirname, "../../assets/PROYECTO.mp4");

const { isVoiceNote } = require("../../utils/voicenoteValidator");
const GoogleSheetService = require("../../services/gcpSheets");
const inscriptionAudio = require("./inscriptionAudio.flow");
const { isEmail } = require("../../utils/emailValidator");

const Cliente = require("../../Models/ClientModel");

const googleSheet = new GoogleSheetService(process.env.PRIVATE_KEY_ID);

const projectflow = addKeyword(EVENTS.ACTION)
  .addAnswer("🤯🤯", { media: vidPath, delay: 0 }, async (ctx, ctxFn) => {
    await typing(ctx, ctxFn.provider);
  })
  .addAction(async (ctx, ctxFn) => {
    STORE_MESSAGE = "Visita nuestra pagina web! 👇🏻";
    STORE_URL = "https://livegood-project.network/ 👁‍🗨";
    ASK_EMAIL =
      "Una vez te hayas inscrito, escribeme el correo con el que te inscribiste por aqui por favor, si deseas salir, escribe *CANCELAR* 🤗";
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: STORE_MESSAGE, delay: 3000 }]);
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: STORE_URL, delay: 4000 }]);
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: ASK_EMAIL, delay: 5000 }]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const answer = ctx.body;
    if (
      /\bcancelar\b/.test(answer.toLowerCase()) ||
      /\bno\b/.test(answer.toLowerCase())
    ) {
      const CANCELLATION_MESSAGE =
        "Comencemos de nuevo, recuerda que estamos aquí para darte información, te envio al menu principal con un saludo me reactivas 🤗";
      await typing(ctx, ctxFn.provider);
      ctxFn.flowDynamic(CANCELLATION_MESSAGE);
      const request = {
        clientName: ctx.pushName,
        information: "Solicito conocer el proyecto",
        email: "NO_EMAIL",
        number: ctx.from,
      };
      console.log({ request, ctx, ctxFn });
      return ctxFn.endFlow();
    } else if (isVoiceNote(answer)) {
      await typing(ctx, ctxFn.provider);
      await ctxFn.fallBack([
        {
          body: "Ay! No me envies mensaje de voz, mejor escribeme, por favor 😵",
          delay: 0,
        },
      ]);
    }
    if (!isEmail(answer)) {
      return ctxFn.fallBack(
        "Esto no parece un correo electronico 😥, por favor escribeme el correo electronico con el que te inscribiste"
      );
    }
    await ctxFn.state.update({ email: answer });
    const currentState = ctxFn.state.getMyState();
    const request = {
      clientName: ctx.pushName,
      information: "Inscripción",
      email: currentState.email,
      number: ctx.from,
    };

    try {
      const client = new Cliente({
        clientName: request.clientName,
        information: request.information,
        email: request.email,
        number: request.number,
      });
      console.log(client);
      await client.save();
      console.log("Se guardo correctamente");
    } catch (error) {
      console.log(error);
    }

    console.log({ request });
    const LAST_MESSAGE =
      "```¡Añadi tu información con éxito! Nosotros nos pondremos en contacto contigo a la brevedad posible a través de tu teléfono.  🙋🏻‍♀️```";
    const BYE_MESSAGE =
      "Fue un gusto atenderte 🤗, te regreso al menu principal, me activas con un saludo! 🤓";
    await typing(ctx, ctxFn.provider);
    ctxFn.flowDynamic([{ body: LAST_MESSAGE, delay: 1500 }]);
    await typing(ctx, ctxFn.provider);
    ctxFn.flowDynamic([{ body: BYE_MESSAGE, delay: 2000 }]);
    return ctxFn.gotoFlow(inscriptionAudio);
  });

module.exports = projectflow;
