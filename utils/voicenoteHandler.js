const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('node:fs/promises');

const convertOggMp3 = require('../services/convert')
const { voiceToText } = require('../services/whisper');

const handlerAI = async (ctx) => {
try{
  const buffer = await downloadMediaMessage(ctx, "buffer");
  const pathTmpOgg = `${process.cwd()}/src/tmp/voice-note-${Date.now()}.ogg`;
  const pathTmpMp3 = `${process.cwd()}/src/tmp/voice-note-${Date.now()}.mp3`;
  await fs.writeFile(pathTmpOgg, buffer);
  await convertOggMp3(pathTmpOgg, pathTmpMp3);
  const text = await voiceToText(pathTmpMp3);
  return text; //el habla1!!
}
catch(err){
  console.log('Error encontrado en el voicenoteHandler', err)
}
};

module.exports = { handlerAI };