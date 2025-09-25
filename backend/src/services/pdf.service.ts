import PDFDocument from "pdfkit";
import { UserData } from "../types";

interface PdfOptions {
  json: UserData;
  text: string;
}

export class PdfService {
  async generatePdf(options: PdfOptions): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];

        doc.on("data", (chunk: Buffer) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        this.addContent(doc, options);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addContent(doc: PDFKit.PDFDocument, options: PdfOptions): void {
    const { json, text } = options;
    const user = json.user;

    // Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor("#2E8B57")
      .text("PLANO ALIMENTAR PERSONALIZADO", { align: "center" });

    doc.moveDown(2);

    // User Information Section
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text("DADOS PESSOAIS");

    doc.moveDown(0.5);

    const userInfo = [
      `Data: ${new Date().toLocaleDateString("pt-BR")}`,
      user?.age ? `Idade: ${user.age} anos` : null,
      user?.sex ? `Sexo: ${user.sex}` : null,
      user?.height_cm ? `Altura: ${user.height_cm} cm` : null,
      user?.weight_kg ? `Peso: ${user.weight_kg} kg` : null,
      user?.activity_level
        ? `Nível de atividade: ${user.activity_level}`
        : null,
      user?.goal ? `Objetivo: ${user.goal}` : null,
      user?.meals_per_day ? `Refeições por dia: ${user.meals_per_day}` : null,
    ].filter(Boolean);

    doc.fontSize(12).font("Helvetica");
    userInfo.forEach((info) => {
      if (info) {
        doc.fillColor("#555555").text(`• ${info}`, { indent: 20 });
      }
    });

    // Restrictions and Preferences
    if (
      user?.dietary_restrictions?.length ||
      user?.allergies?.length ||
      user?.preferences?.length
    ) {
      doc.moveDown(1);
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .fillColor("#333333")
        .text("RESTRIÇÕES E PREFERÊNCIAS");

      doc.moveDown(0.5).fontSize(12).font("Helvetica");

      if (user?.dietary_restrictions?.length) {
        doc
          .fillColor("#555555")
          .text(
            `• Restrições alimentares: ${user.dietary_restrictions.join(", ")}`,
            { indent: 20 }
          );
      }

      if (user?.allergies?.length) {
        doc
          .fillColor("#555555")
          .text(`• Alergias: ${user.allergies.join(", ")}`, { indent: 20 });
      }

      if (user?.preferences?.length) {
        doc
          .fillColor("#555555")
          .text(`• Preferências/aversões: ${user.preferences.join(", ")}`, {
            indent: 20,
          });
      }

      if (user?.medical_conditions?.length) {
        doc
          .fillColor("#555555")
          .text(`• Condições médicas: ${user.medical_conditions.join(", ")}`, {
            indent: 20,
          });
      }
    }

    doc.moveDown(2);

    // Nutrition Plan
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text("PLANO NUTRICIONAL");

    doc.moveDown(1);

    // Process the text content
    this.addFormattedText(doc, text);
  }

  private addFormattedText(doc: PDFKit.PDFDocument, text: string): void {
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = (line ?? "").trim();

      if (!trimmedLine || trimmedLine === "##EXPORT_PDF") continue;

      // Check if we need a new page before adding content
      if (doc.y > 720) {
        doc.addPage();
      }

      // Handle headers
      if (
        trimmedLine.startsWith("**") &&
        trimmedLine.endsWith("**") &&
        trimmedLine.length > 4
      ) {
        const headerText = trimmedLine.replace(/^\*\*|\*\*$/g, "");
        doc.moveDown(0.8);
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .fillColor("#2E8B57")
          .text(headerText, { indent: 0 });
        doc.moveDown(0.5);
      }
      // Handle table headers or section titles
      else if (
        trimmedLine.includes(" | ") &&
        (trimmedLine.includes("Horário") || trimmedLine.includes("Refeição"))
      ) {
        // Skip table headers and separators
        continue;
      } else if (trimmedLine.match(/^-+\s*\|\s*-+/)) {
        // Skip table separators
        continue;
      }
      // Handle table rows
      else if (trimmedLine.includes(" | ")) {
        this.addTableRow(doc, trimmedLine);
      }
      // Handle day headers (Segunda:, Terça:, etc.)
      else if (
        trimmedLine.match(
          /^\*\*(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo):\*\*$/
        )
      ) {
        const dayText = trimmedLine.replace(/^\*\*|\*\*$/g, "");
        doc.moveDown(0.5);
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .fillColor("#333333")
          .text(dayText, { indent: 0 });
        doc.moveDown(0.3);
      }
      // Handle bullet points starting with *
      else if (trimmedLine.startsWith("* ")) {
        doc
          .fontSize(11)
          .font("Helvetica")
          .fillColor("#555555")
          .text(`• ${trimmedLine.substring(2)}`, {
            indent: 20,
            width: 500,
            align: "left",
          });
        doc.moveDown(0.2);
      }
      // Handle bullet points starting with -
      else if (trimmedLine.startsWith("- ")) {
        doc
          .fontSize(11)
          .font("Helvetica")
          .fillColor("#555555")
          .text(`• ${trimmedLine.substring(2)}`, {
            indent: 20,
            width: 500,
            align: "left",
          });
        doc.moveDown(0.2);
      }
      // Handle regular text with potential bold formatting
      else if (trimmedLine.length > 0) {
        if (trimmedLine.includes("**")) {
          this.addTextWithBold(doc, trimmedLine);
        } else {
          doc
            .fontSize(11)
            .font("Helvetica")
            .fillColor("#555555")
            .text(trimmedLine, {
              indent: 0,
              width: 500,
              align: "left",
            });
        }
        doc.moveDown(0.3);
      }
    }
  }

  private addTableRow(doc: PDFKit.PDFDocument, row: string): void {
    const columns = row.split(" | ").map((col) => col.trim());

    if (columns.length >= 4) {
      const [horario, refeicao, sugestoes, observacoes] = columns;

      // Check if we need a new page
      if (doc.y > 680) {
        doc.addPage();
      }

      doc.moveDown(0.5);

      // Horário
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#333333")
        .text(`${horario}`, { indent: 0 });

      // Refeição
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#2E8B57")
        .text(`${refeicao}`, { indent: 20 });

      // Sugestões
      if (sugestoes && sugestoes.length > 10) {
        doc
          .fontSize(10)
          .font("Helvetica")
          .fillColor("#555555")
          .text(`${sugestoes}`, {
            indent: 40,
            width: 450,
            align: "left",
          });
      }

      // Observações
      if (observacoes && observacoes.length > 5) {
        doc
          .fontSize(10)
          .font("Helvetica-Oblique")
          .fillColor("#777777")
          .text(`${observacoes}`, {
            indent: 40,
            width: 450,
            align: "left",
          });
      }

      doc.moveDown(0.8);
    }
  }

  private addTextWithBold(doc: PDFKit.PDFDocument, text: string): void {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    let currentY = doc.y;

    doc.fontSize(11).font("Helvetica").fillColor("#555555");

    let textLine = "";

    for (const part of parts) {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Bold text
        const boldText = part.replace(/^\*\*|\*\*$/g, "");
        textLine += boldText;
      } else {
        // Regular text
        textLine += part;
      }
    }

    // Render the complete line
    doc.text(textLine, {
      indent: 0,
      width: 500,
      align: "left",
    });
  }
}

export const pdfService = new PdfService();
