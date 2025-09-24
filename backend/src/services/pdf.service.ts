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

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine === "##EXPORT_PDF") continue;

      // Handle headers (lines starting with #)
      if (trimmedLine.startsWith("###")) {
        doc.moveDown(0.5);
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .fillColor("#2E8B57")
          .text(trimmedLine.replace(/^#+\s*/, ""), { indent: 40 });
        doc.moveDown(0.3);
      } else if (trimmedLine.startsWith("##")) {
        doc.moveDown(0.8);
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .fillColor("#2E8B57")
          .text(trimmedLine.replace(/^#+\s*/, ""), { indent: 20 });
        doc.moveDown(0.5);
      } else if (trimmedLine.startsWith("#")) {
        doc.moveDown(1);
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .fillColor("#333333")
          .text(trimmedLine.replace(/^#+\s*/, ""));
        doc.moveDown(0.7);
      }
      // Handle bullet points
      else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("• ")) {
        doc
          .fontSize(11)
          .font("Helvetica")
          .fillColor("#555555")
          .text(trimmedLine, { indent: 40 });
      }
      // Handle bold text (**text**)
      else if (trimmedLine.includes("**")) {
        const parts = trimmedLine.split("**");
        let x = doc.x;
        const y = doc.y;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (i % 2 === 0) {
            // Normal text
            doc.fontSize(11).font("Helvetica").fillColor("#555555");
          } else {
            // Bold text
            doc.fontSize(11).font("Helvetica-Bold").fillColor("#333333");
          }

          if (part) {
            doc.text(part, x, y, { continued: i < parts.length - 1 });
            x += doc.widthOfString(part);
          }
        }
        doc.moveDown();
      }
      // Regular text
      else if (trimmedLine.length > 0) {
        doc
          .fontSize(11)
          .font("Helvetica")
          .fillColor("#555555")
          .text(trimmedLine, { indent: 20, align: "justify" });
      }
      // Empty line
      else {
        doc.moveDown(0.3);
      }

      // Check if we need a new page
      if (doc.y > 700) {
        doc.addPage();
      }
    }
  }
}

export const pdfService = new PdfService();
