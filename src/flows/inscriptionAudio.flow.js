const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const fs = require('fs');
const path = require('path');

const audPath = path.resolve(__dirname, '../../assets/RESULTADO.mp3');

const inscriptionAudio = addKeyword(EVENTS.ACTION)
  .addAnswer("Audio", { media: audPath, delay: 2000 })

module.exports = inscriptionAudio