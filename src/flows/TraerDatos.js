const { addKeyword } = require("@bot-whatsapp/bot");

const fs = require("fs");
const path = require("path");
const CLiente = require("../../Models/ClientModel");
const { default: jsPDF } = require("jspdf");
const { default: autoTable } = require("jspdf-autotable");

const vidPath = path.resolve(__dirname, "../../Clientes.pdf");

const TraerDatos = addKeyword("83DJ-3829-3JD9-39CM")
  .addAnswer("Consultando datos...")
  .addAnswer("Tu licencia es valida", null, async (ctx, ctxFn) => {
    try {
      let clients = await CLiente.find();
      clients.reverse();

      const generarNuevoPDF = () => {
        const doc = new jsPDF();

        const columns = ["Cliente", "Informacion", "Email", "Numero"];

        const DataonPdf = clients.map((client) => {
          return [
            `${client.clientName}`,
            `${client.information}`,
            `${client.email}`,
            `${client.number}`,
          ];
        });

        doc.autoTable({ startY: 30, head: [columns], body: DataonPdf });

        // Guardar el archivo en una ubicación local
        const filePath = "./Clientes.pdf";
        fs.writeFileSync(filePath, doc.output());

        // Enviar el mensaje dinámico con el PDF desde la ubicación local
        ctxFn.flowDynamic([
          {
            body: "Aquí está el informe de clientes en PDF.",
            media: vidPath,
          },
        ]);
      };

      generarNuevoPDF();
    } catch (error) {
      console.error(
        "Error durante la ejecución del código asincrónico:",
        error
      );
    }
  });

module.exports = TraerDatos;
