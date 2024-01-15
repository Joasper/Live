const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const fs = require("fs");
const path = require("path");
const typing = require("../../utils/texting");
const GoogleSheetService = require("../../services/gcpSheets");

const { isVoiceNote } = require("../../utils/voicenoteValidator");
const vidPath = path.resolve(__dirname, "../../assets/QUIERO_EQUIPO.mp4");
const { isEmail } = require("../../utils/emailValidator");
const inscriptionAudio = require("./inscriptionAudio.flow");
const Cliente = require("../../Models/ClientModel");

const googleSheet = new GoogleSheetService(process.env.PRIVATE_KEY_ID);

const inscriptionflow = addKeyword(EVENTS.ACTION)
  .addAnswer("Empecemos tu registro! 🙌🏻", { media: vidPath, delay: 2000 }, null)
  .addAction(async (ctx, ctxFn) => {
    HOW_TO_INSCRIPTION = `Para registrarte en LiveGood y reservar tu puesto sin costo, visita https://livegood-team.network/  📝. Rellena el formulario azul a la izquierda con tu nombre, apellido y correo electrónico y haz clic en 'Reservar mi puesto ahora'.`;
    INSCRIPTION_MESSAGE =
      "Visita nuestra pagina web, dale click al link para comenzar con tu inscripción 👇🏻";
    INSCRIPTION_URL = "https://livegood-team.network/ 📝";
    ASK_EMAIL =
      "Una vez te hayas inscrito, escribeme el correo con el que te inscribiste por aqui por favor, si deseas salir, escribe *CANCELAR* 🤗";
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: HOW_TO_INSCRIPTION, delay: 3000 }]);
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: INSCRIPTION_MESSAGE, delay: 4000 }]);
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: INSCRIPTION_URL, delay: 5000 }]);
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: ASK_EMAIL, delay: 6000 }]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const email = ctx.body;
    if (/\bcancelar\b/.test(email.toLowerCase())) {
      const CANCELLATION_MESSAGE =
        "Comencemos de nuevo, recuerda que estamos aquí para darte información, me reactivas con un saludo 🤗";
      await typing(ctx, ctxFn.provider);
      ctxFn.flowDynamic(CANCELLATION_MESSAGE);
      const request = {
        clientName: ctx.pushName,
        information:
          'Posible cliente, cancelo en "inscripciones" y no compartio el correo',
        email: "NO_EMAIL",
        number: ctx.from,
      };

      return ctxFn.endFlow();
    }
    if (isVoiceNote(email)) {
      await typing(ctx, ctxFn.provider);
      await ctxFn.fallBack([
        {
          body: "Ay! No me envies mensaje de voz, mejor escribeme, por favor 😵",
          delay: 0,
        },
      ]);
    }
    if (!isEmail(email)) {
      return ctxFn.fallBack(
        "Esto no parece un correo electronico 😥, por favor escribeme el correo electronico con el que te inscribiste"
      );
    }
    await ctxFn.state.update({ email: email });
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

    const LAST_MESSAGE =
      "```¡Añadi tu información con éxito! Nosotros nos pondremos en contacto contigo a la brevedad posible a través de tu teléfono. 🤖 ```";
    const BYE_MESSAGE =
      "Fue un gusto atenderte 🤗, te regreso al menu principal, me activas con un saludo! 🤓";
    await typing(ctx, ctxFn.provider);
    ctxFn.flowDynamic([{ body: LAST_MESSAGE, delay: 1500 }]);
    await typing(ctx, ctxFn.provider);
    ctxFn.flowDynamic([{ body: BYE_MESSAGE, delay: 2000 }]);
    return ctxFn.gotoFlow(inscriptionAudio);
  });

module.exports = inscriptionflow;
