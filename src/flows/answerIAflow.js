const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const typing = require("../../utils/texting");

const { isVoiceNote } = require("../../utils/voicenoteValidator");
const inscriptionflow = require("./inscription.flow");
const projectflow = require("./project.flow");
const storeflow = require("./store.flow");

const answerIAflow = addKeyword(EVENTS.ACTION).addAction(
  {
    capture: true,
    regex: true,
  },
  async (ctx, ctxFn) => {
    console.log("[ANSWERIAFLOW]");
    const currentState = ctxFn.state.getMyState();
    const body = `Lo que {usuario} te dice ahora: '${ctx.body}', lo que anteriormente te respondio el {usuario}: '${currentState.pastbody}', lo que anteriormente tu respondiste '${currentState.idealEmployee.answer}'`;
    if (ctx.body === "1") {
      await ctxFn.gotoFlow(require("./project.flow"));
      await typing(ctx, ctxFn.provider);
      return;
    }
    if (ctx.body === "83DJ-3829-3JD9-39CM") {
      await ctxFn.gotoFlow(require("./TraerDatos"));
      await typing(ctx, ctxFn.provider);
      return;
    }
    if (ctx.body === "2") {
      await ctxFn.gotoFlow(require("./inscription.flow"));
      await typing(ctx, ctxFn.provider);
      return;
    }
    if (ctx.body === "3") {
      await ctxFn.gotoFlow(require("./store.flow"));
      await typing(ctx, ctxFn.provider);
      return;
    }
    if (isVoiceNote(ctx.body)) {
      await ctxFn.state.update({ answer: ctx });
      return ctxFn.gotoFlow(require("./giveVoiceNote.flow"));
    }
    console.log(body);
    await typing(ctx, ctxFn.provider);
    const plugin = ctxFn.extensions.employeesAddon;
    await typing(ctx, ctxFn.provider);
    const idealEmployee = await plugin.determine(body);
    await typing(ctx, ctxFn.provider);

    if (
      !idealEmployee?.employee ||
      idealEmployee.employee.name === "NOT_EMPLOYEE"
    ) {
      const MESSAGE = `Lo siento, no he podido entenderte.
        \n Podemos hablar de:
        \n-Información sobre proyecto LiveGood,
        \n-Formar parte del equipo LiveGood, 
        \n-Para vender o comprar los productos LiveGood `;
      return ctxFn.fallBack(MESSAGE);
    }
    await typing(ctx, ctxFn.provider);

    const attentionClientOptions = `📲 Quiero Conocer el Proyecto: Escribe ➡️ 1,\n👊 Quiero Hacer Equipo: Escribe ➡️ 2,\n📦 Quiero vender: Escribe ➡️ 3.`;

    await typing(ctx, ctxFn.provider);

    if (idealEmployee.employee.name === "BOT_PARA_ATENCION") {
      await typing(ctx, ctxFn.provider);
      ctxFn.flowDynamic([{ body: `${idealEmployee.answer}`, delay: 1000 }]);
      await typing(ctx, ctxFn.provider);
      ctxFn.flowDynamic([{ body: attentionClientOptions, delay: 2000 }]);
      await typing(ctx, ctxFn.provider);
      await typing(ctx, ctxFn.provider);
    }

    await typing(ctx, ctxFn.provider);
    ctxFn.state.update({ idealEmployee: idealEmployee });
    await ctxFn.state.update({ pastbody: ctx.body });
    await typing(ctx, ctxFn.provider);

    plugin.gotoFlow(idealEmployee.employee, ctxFn);
    await typing(ctx, ctxFn.provider);
  },

  [inscriptionflow, projectflow, storeflow]
);

module.exports = answerIAflow;
