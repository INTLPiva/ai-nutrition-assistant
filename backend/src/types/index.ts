import { z } from "zod";

// User Data Types
export const UserDataSchema = z.object({
  completed: z.boolean(),
  collected_at: z.string().optional(),
  user: z
    .object({
      age: z.number().min(1).max(120).optional(),
      sex: z.enum(["masculino", "feminino", "outro"]).optional(),
      height_cm: z.number().min(50).max(300).optional(),
      weight_kg: z.number().min(20).max(500).optional(),
      activity_level: z
        .enum(["sedentário", "leve", "moderado", "intenso"])
        .optional(),
      goal: z.string().optional(),
      meals_per_day: z.number().min(1).max(10).optional(),
      dietary_restrictions: z.array(z.string()).optional(),
      allergies: z.array(z.string()).optional(),
      preferences: z.array(z.string()).optional(),
      medical_conditions: z.array(z.string()).optional(),
      supplements: z.array(z.string()).optional(),
      timezone: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

// Request/Response Types
export const MessageRequestSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1),
});

export const MessageResponseSchema = z.object({
  json: z.record(z.unknown()).nullable(),
  text: z.string(),
  done: z.boolean(),
});

export const PdfExportRequestSchema = z.object({
  json: UserDataSchema,
  text: z.string(),
});

// Session Management
export interface UserSession {
  id: string;
  createdAt: Date;
  lastActivity: Date;
  userData: UserData;
  conversationHistory: ConversationMessage[];
  currentStep: number;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Type exports
export type MessageRequest = z.infer<typeof MessageRequestSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type PdfExportRequest = z.infer<typeof PdfExportRequestSchema>;
export type UserData = z.infer<typeof UserDataSchema>;

// Question Steps
export enum QuestionStep {
  PERMISSION = 0,
  AGE = 1,
  SEX = 2,
  HEIGHT = 3,
  WEIGHT = 4,
  ACTIVITY_LEVEL = 5,
  GOAL = 6,
  MEALS_PER_DAY = 7,
  DIETARY_RESTRICTIONS = 8,
  ALLERGIES = 9,
  PREFERENCES = 10,
  MEDICAL_CONDITIONS = 11,
  COMPLETE = 12,
}

// Fastify JSON Schema equivalents for validation
export const MessageRequestJSONSchema = {
  type: "object",
  required: ["sessionId", "message"],
  properties: {
    sessionId: { type: "string", minLength: 1 },
    message: { type: "string", minLength: 1 },
  },
  additionalProperties: false,
};

export const MessageResponseJSONSchema = {
  type: "object",
  required: ["json", "text", "done"],
  properties: {
    json: {
      anyOf: [{ type: "object" }, { type: "null" }],
    },
    text: { type: "string" },
    done: { type: "boolean" },
  },
  additionalProperties: false,
};

export const PdfExportRequestJSONSchema = {
  type: "object",
  required: ["json", "text"],
  properties: {
    json: {
      type: "object",
      additionalProperties: true,
    },
    text: { type: "string" },
  },
  additionalProperties: false,
};

// Activity levels mapping
export const ACTIVITY_LEVELS = {
  sedentário: "Sedentário (pouco ou nenhum exercício)",
  leve: "Leve (exercício leve 1-3 dias por semana)",
  moderado: "Moderado (exercício moderado 3-5 dias por semana)",
  intenso: "Intenso (exercício pesado 6-7 dias por semana)",
} as const;
