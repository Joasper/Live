const mongoose = require("mongoose");

const dbConecction = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:oEczmPP8KQOr4ShV@cluster0.zuukayk.mongodb.net/"
    );

    console.log("Base de datos montada");
  } catch (error) {
    console.log(error);
    throw new Error("Error al inicializar BD");
  }
};

module.exports = {
  dbConecction,
};
