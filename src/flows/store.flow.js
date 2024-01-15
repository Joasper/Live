const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const fs = require("fs");
const path = require("path");

const vidPath = path.resolve(__dirname, "../../assets/QUIER_VENDER.mp4");

const { isVoiceNote } = require("../../utils/voicenoteValidator");
const GoogleSheetService = require("../../services/gcpSheets");
const inscriptionflow = require("./inscription.flow");
const typing = require("../../utils/texting");

const Cliente = require("../../Models/ClientModel");

const googleSheet = new GoogleSheetService(process.env.PRIVATE_KEY_ID);

const storeflow = addKeyword(EVENTS.ACTION)
  .addAnswer("😎😎", { media: vidPath, delay: 2000 }, null)
  .addAction(async (ctx, ctxFn) => {
    HOW_TO_SELLS_MESSAGE = `Explora nuestra tienda virtual para comprar productos que cambiarán tu vida en https://livegood-pay.network/ 🙌🏻. Para traducir la página al español, usa el selector de idioma en la esquina superior derecha. Si estás interesado en obtener precios de mayorista como miembro, haz clic en 'Conviértete en miembro' en el menú, elige la membresía mensual de $9.95 o la anual de $99.95, añádela al carrito y sigue el proceso de compra.`;
    STORE_MESSAGE = "Visita nuestra pagina web, en nuestra tienda virtual! 👇🏻";
    STORE_URL = "https://livegood-pay.network/ 🙌🏻";
    MESSAGE =
      "Te recuerdo que tenemos promociones para todos aquellos que son parte del equipo LiveGood,\n¿Quieres inscribirte?\n•SI\n•NO\nPuedes escribir *CANCELAR* para regresar al menu principal 😎";
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: HOW_TO_SELLS_MESSAGE, delay: 3000 }]);
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: STORE_MESSAGE, delay: 4000 }]);
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: STORE_URL, delay: 5000 }]);
    await typing(ctx, ctxFn.provider);
    await ctxFn.flowDynamic([{ body: MESSAGE, delay: 6000 }]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const answer = ctx.body;
    if (
      /\bcancelar\b/.test(answer.toLowerCase()) ||
      /\bno\b/.test(answer.toLowerCase())
    ) {
      const CANCELLATION_MESSAGE =
        "Comencemos de nuevo, recuerda que estamos aquí para darte información, te envio al menu principal me reactivas con un saludo 🤗";
      await typing(ctx, ctxFn.provider);
      ctxFn.flowDynamic(CANCELLATION_MESSAGE);
      const request = {
        clientName: ctx.pushName,
        information: "Solicito la tienda virtual",
        email: "NO_EMAIL",
        number: ctx.from,
      };

      return ctxFn.endFlow();
    }

    if (/\bs[ií]\b/.test(answer.toLowerCase())) {
      const request = {
        clientName: ctx.pushName,
        information: "Solicito la tienda virtual",
        email: "NO_EMAIL",
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

      await ctxFn.gotoFlow(inscriptionflow);
    } else if (isVoiceNote(answer)) {
      await typing(ctx, ctxFn.provider);
      await ctxFn.fallBack([
        {
          body: "Ay! No me envies mensaje de voz, mejor escribeme, por favor 😵",
          delay: 0,
        },
      ]);
    } else {
      await typing(ctx, ctxFn.provider);
      await ctxFn.fallBack(
        "Por favor solo dime que: *Si*, *No* o *Cancelar* 😅"
      );
    }
  });

module.exports = storeflow;
