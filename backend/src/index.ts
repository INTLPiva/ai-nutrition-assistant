import "dotenv/config";
import { buildServer } from "./server"; // Usando servidor completo
import { env } from "./config/env";

const start = async (): Promise<void> => {
  try {
    const server = buildServer();

    await server.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📊 Environment: ${env.NODE_ENV}`);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("📤 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📤 SIGINT received, shutting down gracefully");
  process.exit(0);
});

start();
