const fs = require('fs')
const path = require('path')

const inscriptionflow = require('../src/flows/inscription.flow');
const storeflow = require('../src/flows/store.flow');
const projectflow = require('../src/flows/project.flow');
const answerIAflow = require('../src/flows/answerIAflow');



const agents = [
  {
      name: 'BOT_PARA_BIENVENIDA',
      description: fs.readFileSync(path.join(__dirname, '../src/prompts/05_BIENVENIDA.txt'), 'utf8'),
      flow: answerIAflow
  },
  {
      name: 'BOT_PARA_INSCRIPCIONES',
      description: fs.readFileSync(path.join(__dirname, '../src/prompts/01_INSCRIPCIONES.txt'), 'utf8'),
      flow: inscriptionflow
  },
  {
      name: 'BOT_PARA_VENTAS',
      description: fs.readFileSync(path.join(__dirname, '../src/prompts/02_TIENDA.txt'), 'utf8'),
      flow: storeflow
  },
  {
      name: 'BOT_PARA_PROYECTOS',
      description: fs.readFileSync(path.join(__dirname, '../src/prompts/03_PROYECTO.txt'), 'utf8'),
      flow: projectflow
  },
  {
      name: 'BOT_PARA_ATENCION',
      description: fs.readFileSync(path.join(__dirname, '../src/prompts/04_ATENCION.txt'), 'utf8'),
      flow: answerIAflow
  },
]

module.exports = agents