const { JWT } = require("google-auth-library");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

class GoogleSheetService {
  jwtFromEnv = undefined;
  doc = undefined;

  constructor(id = undefined) {
    if (!id) {
      throw new Error("ID_UNDEFINED");
    }

    this.jwtFromEnv = new JWT({
      email: process.env.CLIENT_EMAIL,
      key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    });
    this.doc = new GoogleSpreadsheet(id, this.jwtFromEnv);
  }


  /**
   * Guardar pedido
   * @param {*} data
   */
  saveRequest = async (data = {}) => {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[0]; // the first sheet

    const order = await sheet.addRow({
      nombre: data.clientName,
      descripcion: data.description,
      informacion: data.information,
      email: data.email,
      numero: data.number,

    });
    return order

  };


}

module.exports = GoogleSheetService ;