import { z } from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z
    .string()
    .min(1, "GEMINI_API_KEY is required")
    .default("test-api-key"),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SESSION_TIMEOUT: z.coerce.number().default(3600000), // 1 hour
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:");
  console.error(result.error.format());
  process.exit(1);
}

export const env = result.data;
