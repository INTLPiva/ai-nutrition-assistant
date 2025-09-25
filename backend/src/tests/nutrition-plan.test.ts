import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { generateNutritionPlan } from "../utils/nutrition-plan";
import { UserData } from "../types";

vi.mock("@langchain/google-genai");
vi.mock("langchain/schema");

type MockLLM = {
  invoke: ReturnType<typeof vi.fn>;
};

describe("generateNutritionPlan", () => {
  let mockLlm: MockLLM;
  let userData: UserData;

  beforeEach(() => {
    vi.clearAllMocks();

    mockLlm = { invoke: vi.fn() };

    userData = {
      completed: true,
      collected_at: new Date().toISOString(),
      user: {
        age: 30,
        sex: "masculino",
        height_cm: 175,
        weight_kg: 70,
        activity_level: "moderado",
        goal: "emagrecimento",
        meals_per_day: 4,
        dietary_restrictions: [],
        allergies: [],
        preferences: [],
        medical_conditions: [],
        timezone: "America/Sao_Paulo",
      },
    };
  });

  describe("Successful plan generation", () => {
    it("should generate a nutrition plan with complete user data", async () => {
      const expectedResponse = {
        content: {
          toString: () => `# PLANO ALIMENTAR PERSONALIZADO
          
1. RESUMO NUTRICIONAL
Este plano é personalizado para suas necessidades.

2. PLANO ALIMENTAR DIÁRIO
Café da manhã: Opções saudáveis

3. SUGESTÕES DE CARDÁPIO SEMANAL
Segunda-feira: Menu completo

4. DICAS IMPORTANTES
- Hidrate-se bem
- Exercite-se regularmente

5. RECOMENDAÇÕES GERAIS
Consulte um profissional de saúde.`,
        },
      };

      mockLlm.invoke.mockResolvedValue(expectedResponse);

      const result = await generateNutritionPlan(userData, mockLlm as any);

      expect(mockLlm.invoke).toHaveBeenCalledTimes(1);
      expect(result).toContain("PLANO ALIMENTAR PERSONALIZADO");
      expect(result).toContain("RESUMO NUTRICIONAL");
      expect(result).toContain("PLANO ALIMENTAR DIÁRIO");
      expect(result).toContain("SUGESTÕES DE CARDÁPIO SEMANAL");
      expect(result).toContain("DICAS IMPORTANTES");
      expect(result).toContain("RECOMENDAÇÕES GERAIS");
    });

    it("should include user data in the system prompt", async () => {
      const expectedResponse = {
        content: { toString: () => "Plano gerado" },
      };
      mockLlm.invoke.mockResolvedValue(expectedResponse);

      await generateNutritionPlan(userData, mockLlm as any);

      const callArgs = mockLlm.invoke.mock.calls[0][0];
      const systemMessage = callArgs.find(
        (msg: any) =>
          msg instanceof SystemMessage ||
          msg.constructor.name === "SystemMessage"
      );

      expect(systemMessage).toBeDefined();
      expect(systemMessage.content || systemMessage.text).toContain(
        "Idade: 30 anos"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Sexo: masculino"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Altura: 175 cm"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Peso: 70 kg"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Nível de atividade: moderado"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Objetivo: emagrecimento"
      );
    });

    it("should calculate TMB correctly for men", async () => {
      const expectedResponse = {
        content: { toString: () => "Plano gerado" },
      };
      mockLlm.invoke.mockResolvedValue(expectedResponse);

      await generateNutritionPlan(userData, mockLlm as any);

      const callArgs = mockLlm.invoke.mock.calls[0][0];
      const systemMessage = callArgs.find(
        (msg: any) =>
          msg instanceof SystemMessage ||
          msg.constructor.name === "SystemMessage"
      );

      expect(systemMessage.content || systemMessage.text).toContain(
        "TMB estimada: 1649 kcal"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Gasto calórico diário estimado: 2556 kcal"
      );
    });

    it("should calculate TMB correctly for women", async () => {
      userData.user.sex = "feminino";
      const expectedResponse = {
        content: { toString: () => "Plano gerado" },
      };
      mockLlm.invoke.mockResolvedValue(expectedResponse);

      await generateNutritionPlan(userData, mockLlm as any);

      const callArgs = mockLlm.invoke.mock.calls[0][0];
      const systemMessage = callArgs.find(
        (msg: any) =>
          msg instanceof SystemMessage ||
          msg.constructor.name === "SystemMessage"
      );

      expect(systemMessage.content || systemMessage.text).toContain(
        "TMB estimada: 1483 kcal"
      );
    });
  });

  describe("Different activity levels", () => {
    const activityTests = [
      { level: "sedentário", multiplier: 1.2 },
      { level: "leve", multiplier: 1.375 },
      { level: "moderado", multiplier: 1.55 },
      { level: "intenso", multiplier: 1.725 },
    ];

    activityTests.forEach(({ level, multiplier }) => {
      it(`should calculate calories correctly for ${level} activity`, async () => {
        userData.user.activity_level =
          level as typeof userData.user.activity_level;
        const expectedResponse = {
          content: { toString: () => "Plano gerado" },
        };
        mockLlm.invoke.mockResolvedValue(expectedResponse);

        await generateNutritionPlan(userData, mockLlm as any);

        const callArgs = mockLlm.invoke.mock.calls[0][0];
        const systemMessage = callArgs.find(
          (msg: any) =>
            msg instanceof SystemMessage ||
            msg.constructor.name === "SystemMessage"
        );

        const tmb = 10 * 70 + 6.25 * 175 - 5 * 30 + 5;
        const expectedCalories = Math.round(tmb * multiplier);
        expect(systemMessage.content || systemMessage.text).toContain(
          `Gasto calórico diário estimado: ${expectedCalories} kcal`
        );
      });
    });
  });

  describe("Missing data", () => {
    it("should handle missing user data", async () => {
      const incompleteUserData: UserData = {
        completed: false,
        collected_at: new Date().toISOString(),
        user: {
          age: undefined,
          sex: undefined,
          height_cm: undefined,
          weight_kg: undefined,
          activity_level: undefined,
          goal: undefined,
          meals_per_day: undefined,
          dietary_restrictions: [],
          allergies: [],
          preferences: [],
          medical_conditions: [],
          timezone: "America/Sao_Paulo",
        },
      };

      const expectedResponse = {
        content: { toString: () => "Plano gerado" },
      };
      mockLlm.invoke.mockResolvedValue(expectedResponse);

      await generateNutritionPlan(incompleteUserData, mockLlm as any);

      const callArgs = mockLlm.invoke.mock.calls[0][0];
      const systemMessage = callArgs.find(
        (msg: any) =>
          msg instanceof SystemMessage ||
          msg.constructor.name === "SystemMessage"
      );

      expect(systemMessage.content || systemMessage.text).toContain(
        "Idade: não informada anos"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Sexo: não informado"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "TMB estimada: 0 kcal"
      );
    });

    it("should handle dietary restrictions, allergies, and preferences", async () => {
      userData.user.dietary_restrictions = ["vegetariano", "sem glúten"];
      userData.user.allergies = ["amendoim", "frutos do mar"];
      userData.user.preferences = ["não gosta de brócolis"];
      userData.user.medical_conditions = ["diabetes", "hipertensão"];

      const expectedResponse = {
        content: { toString: () => "Plano gerado" },
      };
      mockLlm.invoke.mockResolvedValue(expectedResponse);

      await generateNutritionPlan(userData, mockLlm as any);

      const callArgs = mockLlm.invoke.mock.calls[0][0];
      const systemMessage = callArgs.find(
        (msg: any) =>
          msg instanceof SystemMessage ||
          msg.constructor.name === "SystemMessage"
      );

      expect(systemMessage.content || systemMessage.text).toContain(
        "Restrições alimentares: vegetariano, sem glúten"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Alergias: amendoim, frutos do mar"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Preferências/aversões: não gosta de brócolis"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Condições médicas: diabetes, hipertensão"
      );
    });
  });

  describe("Error handling", () => {
    it("should return a fallback plan when LLM fails", async () => {
      mockLlm.invoke.mockRejectedValue(new Error("LLM Error"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await generateNutritionPlan(userData, mockLlm as any);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error generating nutrition plan:",
        expect.any(Error)
      );
      expect(result).toContain("PLANO ALIMENTAR PERSONALIZADO");
      expect(result).toContain("RESUMO NUTRICIONAL");
      expect(result).toContain("emagrecimento");
      expect(result).toContain("4 refeições");
      expect(result).toContain("moderado");

      consoleSpy.mockRestore();
    });

    it("should use default values in the fallback plan when data is missing", async () => {
      const incompleteUserData: UserData = {
        completed: false,
        collected_at: new Date().toISOString(),
        user: {
          dietary_restrictions: [],
          allergies: [],
          preferences: [],
          medical_conditions: [],
          timezone: "America/Sao_Paulo",
        },
      };

      mockLlm.invoke.mockRejectedValue(new Error("LLM Error"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await generateNutritionPlan(
        incompleteUserData,
        mockLlm as any
      );

      expect(result).toContain("Melhoria da saúde geral");
      expect(result).toContain("4 refeições");
      expect(result).toContain("Moderado");

      consoleSpy.mockRestore();
    });
  });

  describe("Prompt structure", () => {
    it("should include all necessary instructions in the system prompt", async () => {
      const expectedResponse = {
        content: { toString: () => "Plano gerado" },
      };
      mockLlm.invoke.mockResolvedValue(expectedResponse);

      await generateNutritionPlan(userData, mockLlm as any);

      const callArgs = mockLlm.invoke.mock.calls[0][0];
      const systemMessage = callArgs.find(
        (msg: any) =>
          msg instanceof SystemMessage ||
          msg.constructor.name === "SystemMessage"
      );
      const humanMessage = callArgs.find(
        (msg: any) =>
          msg instanceof HumanMessage || msg.constructor.name === "HumanMessage"
      );

      expect(systemMessage.content || systemMessage.text).toContain(
        "nutricionista experiente"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Use linguagem clara e acessível"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "ESTRUTURA DO PLANO:"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "1. RESUMO NUTRICIONAL"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "2. PLANO ALIMENTAR DIÁRIO"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "3. SUGESTÕES DE CARDÁPIO SEMANAL"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "4. DICAS IMPORTANTES"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "5. RECOMENDAÇÕES GERAIS"
      );

      expect(humanMessage.content || humanMessage.text).toContain(
        "Crie um plano alimentar completo e personalizado"
      );
    });
  });

  describe("Edge cases for calculations", () => {
    it("should handle zero or negative values", async () => {
      userData.user.weight_kg = 0;
      userData.user.height_cm = 0;
      userData.user.age = 0;

      const expectedResponse = {
        content: { toString: () => "Plano gerado" },
      };
      mockLlm.invoke.mockResolvedValue(expectedResponse);

      await generateNutritionPlan(userData, mockLlm as any);

      const callArgs = mockLlm.invoke.mock.calls[0][0];
      const systemMessage = callArgs.find(
        (msg: any) =>
          msg instanceof SystemMessage ||
          msg.constructor.name === "SystemMessage"
      );

      expect(systemMessage.content || systemMessage.text).toContain(
        "TMB estimada: 0 kcal"
      );
      expect(systemMessage.content || systemMessage.text).toContain(
        "Gasto calórico diário estimado: 0 kcal"
      );
    });

    it("should use default multiplier for unknown activity level", async () => {
      userData.user.activity_level = "nivel_inexistente" as any;

      const expectedResponse = {
        content: { toString: () => "Plano gerado" },
      };
      mockLlm.invoke.mockResolvedValue(expectedResponse);

      await generateNutritionPlan(userData, mockLlm as any);

      const callArgs = mockLlm.invoke.mock.calls[0][0];
      const systemMessage = callArgs.find(
        (msg: any) =>
          msg instanceof SystemMessage ||
          msg.constructor.name === "SystemMessage"
      );

      const expectedCalories = Math.round(1649 * 1.2);
      expect(systemMessage.content || systemMessage.text).toContain(
        `Gasto calórico diário estimado: ${expectedCalories} kcal`
      );
    });
  });
});

describe("Helper functions", () => {
  describe("calculateTMB", () => {
    it("should calculate TMB for different profiles", async () => {
      const testCases = [
        {
          userData: {
            user: { weight_kg: 60, height_cm: 165, age: 25, sex: "feminino" },
          },
          expected: 10 * 60 + 6.25 * 165 - 5 * 25 - 161,
        },
        {
          userData: {
            user: { weight_kg: 80, height_cm: 180, age: 35, sex: "masculino" },
          },
          expected: 10 * 80 + 6.25 * 180 - 5 * 35 + 5,
        },
      ];

      const mockLlm = {
        invoke: vi.fn().mockResolvedValue({
          content: { toString: () => "Plano gerado" },
        }),
      };

      for (const testCase of testCases) {
        await generateNutritionPlan(testCase.userData as any, mockLlm as any);

        const callArgs =
          mockLlm.invoke.mock.calls[mockLlm.invoke.mock.calls.length - 1][0];
        const systemMessage = callArgs.find(
          (msg: any) =>
            msg instanceof SystemMessage ||
            msg.constructor.name === "SystemMessage"
        );

        expect(systemMessage.content || systemMessage.text).toContain(
          `TMB estimada: ${Math.round(testCase.expected)} kcal`
        );
      }
    });
  });
});
