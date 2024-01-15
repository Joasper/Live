const { Schema, model } = require("mongoose");

const ClientSchema = Schema({
  clientName: {
    type: String,
  },
  information: {
    type: String,
  },
  email: {
    type: String,
  },
  number: {
    type: String,
  },
});

module.exports = model("Client", ClientSchema);
