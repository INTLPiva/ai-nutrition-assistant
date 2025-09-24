import { FastifyInstance } from "fastify";
import { pdfService } from "../services/pdf.service";
import { PdfExportRequest } from "../types";

export const pdfRoutes = async (server: FastifyInstance): Promise<void> => {
  // Export PDF endpoint
  server.post("/export-pdf", async (request, reply) => {
    try {
      const body = request.body as PdfExportRequest;

      if (!body.json || typeof body.json !== "object") {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "json field is required and must be an object",
        });
      }

      if (!body.text || typeof body.text !== "string") {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "text field is required and must be a string",
        });
      }

      const { json, text } = body;

      if (!json.completed) {
        return reply.status(400).send({
          error: "INCOMPLETE_DATA",
          message: "Os dados do usuário ainda não estão completos",
        });
      }

      const pdfBuffer = await pdfService.generatePdf({ json, text });
      const filename = `plano-alimentar-${Date.now()}.pdf`;

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename="${filename}"`);
      reply.header("Content-Length", pdfBuffer.length);
      reply.header("Cache-Control", "no-cache");

      return reply.send(pdfBuffer);
    } catch (error: any) {
      server.log.error("Error generating PDF:", error);

      return reply.status(500).send({
        error: "PDF_GENERATION_ERROR",
        message: "Erro ao gerar o PDF. Tente novamente mais tarde.",
      });
    }
  });

  // Preview PDF (returns PDF in browser instead of download)
  server.post("/preview-pdf", async (request, reply) => {
    try {
      const body = request.body as PdfExportRequest;

      if (!body.json || typeof body.json !== "object") {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "json field is required and must be an object",
        });
      }

      if (!body.text || typeof body.text !== "string") {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "text field is required and must be a string",
        });
      }

      const { json, text } = body;

      if (!json.completed) {
        return reply.status(400).send({
          error: "INCOMPLETE_DATA",
          message: "Os dados do usuário ainda não estão completos",
        });
      }

      const pdfBuffer = await pdfService.generatePdf({ json, text });

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", "inline");
      reply.header("Content-Length", pdfBuffer.length);
      reply.header("Cache-Control", "no-cache");

      return reply.send(pdfBuffer);
    } catch (error: any) {
      server.log.error("Error generating PDF preview:", error);

      return reply.status(500).send({
        error: "PDF_GENERATION_ERROR",
        message: "Erro ao gerar a prévia do PDF. Tente novamente mais tarde.",
      });
    }
  });
};
