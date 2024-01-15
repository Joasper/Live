const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { handlerAI } = require("../../utils/voicenoteHandler");
const typing = require("../../utils/texting");

const storeflow = require("./store.flow");
const projectflow = require("./project.flow");
const answerIAflow = require("./answerIAflow");
const inscriptionflow = require("./inscription.flow");

const giveVoicenoteflow = addKeyword(EVENTS.ACTION)
  .addAction(
    async(ctx, ctxFn)=>{
      console.log(`[FLOW VOICENOTE]`)
      const plugin = ctxFn.extensions.employeesAddon
      await typing(ctx, ctxFn.provider)
      await ctxFn.flowDynamic([
        { body: "Dejame escucharte... 🤗",
          delay: 1000
        }])
      const textVoiceNote = await handlerAI(ctx);
      const currentState = ctxFn.state.getMyState();
      const fullSentence = `${currentState?.answer ?? ""}. ${textVoiceNote}`;
      console.log("Esto dijo el mensaje de voz", fullSentence)
      
      const idealEmployee = await plugin.determine(fullSentence);
      let body = `Lo que {usuario} te dice ahora: '${fullSentence}', lo que anteriormente te respondio el {usuario}: '${currentState.pastbody}', lo que anteriormente tu respondiste '${currentState.idealEmployee.answer}'` 
      

      if(!idealEmployee?.employee || idealEmployee.employee.name === 'NOT_EMPLOYEE' || idealEmployee.employee === undefined ){
        const MESSAGE = `Lo siento, no he podido entenderte.
        \nPodemos hablar de:
        \n-Información sobre proyecto LiveGood,
        \n-Formar parte del equipo LiveGood, 
        \n-Para vender o comprar los productos LiveGood `
        return ctxFn.fallBack(MESSAGE);
      }

      const attentionClientOptions =`📲 Quiero Conocer el Proyecto: Escribe ➡️ 1,\n👊 Quiero Hacer Equipo: Escribe ➡️ 2,\n📦 Quiero vender: Escribe ➡️ 3.`;

      await typing(ctx, ctxFn.provider)

      if (idealEmployee.employee.name === 'BOT_PARA_ATENCION') {
        await typing(ctx, ctxFn.provider)
        ctxFn.flowDynamic([{ body: `${idealEmployee.answer}`, delay: 1000}]);
        await typing(ctx, ctxFn.provider)
        ctxFn.flowDynamic([{ body: attentionClientOptions, delay: 2000}]);
        await typing(ctx, ctxFn.provider)
        await typing(ctx, ctxFn.provider)
      }
      await typing(ctx, ctxFn.provider)
      ctxFn.flowDynamic(`${idealEmployee.answer}`)
      await typing(ctx, ctxFn.provider)

      ctxFn.state.update({ idealEmployee: idealEmployee });
      await ctxFn.state.update({ pastbody: fullSentence });
      await typing(ctx, ctxFn.provider)

      plugin.gotoFlow(idealEmployee.employee, ctxFn);
      await typing(ctx, ctxFn.provider)
    },

    [
      inscriptionflow,
      projectflow,
      storeflow,
      answerIAflow
    ]
    );

module.exports = giveVoicenoteflow;
