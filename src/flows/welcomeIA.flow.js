const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const typing = require("../../utils/texting");
const { handlerAI } = require("../../utils/voicenoteHandler");
const { isVoiceNote } = require("../../utils/voicenoteValidator");

const welcomeIAflow = addKeyword([EVENTS.WELCOME, EVENTS.VOICE_NOTE])
.addAction(async(ctx, ctxFn) => {
  console.log("[WELCOMEIAFLOW]")
  let body = ctx.body
  if (isVoiceNote(ctx.body)){
    const textVoiceNote = await handlerAI(ctx);
    const currentState = ctxFn.state.getMyState();
    const fullSentence = `${currentState?.answer ?? ""}. ${textVoiceNote}`;
    console.log("Esto dijo el mensaje de voz", fullSentence);
    body = fullSentence
  }
  await ctxFn.state.update({ answer: body });
  await typing(ctx, ctxFn.provider)
}
)
.addAction(async(ctx, ctxFn) => {
  const currentState = ctxFn.state.getMyState();
  const BOT_STATIC_MESSAGE = "Me presento soy un BOT de Interactive Latin System de LIVEGOOD 🤖 Funcionó con Inteligencia Artificial, preguntame lo que quieras y te ayudaré a ganar con Livegood ¿En qué puedo ayudarte hoy?"
  await typing(ctx, ctxFn.provider)
  const plugin = ctxFn.extensions.employeesAddon
  await typing(ctx, ctxFn.provider)
  const idealEmployee = await plugin.determine(currentState.answer)
  ctxFn.flowDynamic([{ body: BOT_STATIC_MESSAGE, delay: 900}]);

  await ctxFn.state.update({ idealEmployee: idealEmployee });
  await ctxFn.gotoFlow(require('./answerIAflow'));
}
);




module.exports = welcomeIAflow 
