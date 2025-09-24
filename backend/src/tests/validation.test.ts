import { describe, it, expect } from "vitest";
import { validateUserInput } from "../utils/validation";

describe("Validation Utils", () => {
  describe("extractNumber", () => {
    it("should extract numbers from text", () => {
      expect(validateUserInput.extractNumber("25")).toBe(25);
      expect(validateUserInput.extractNumber("Tenho 30 anos")).toBe(30);
      expect(validateUserInput.extractNumber("175cm")).toBe(175);
      expect(validateUserInput.extractNumber("sem números")).toBeNull();
    });
  });

  describe("extractSex", () => {
    it("should extract sex from text", () => {
      expect(validateUserInput.extractSex("masculino")).toBe("masculino");
      expect(validateUserInput.extractSex("Sou homem")).toBe("masculino");
      expect(validateUserInput.extractSex("feminino")).toBe("feminino");
      expect(validateUserInput.extractSex("Sou mulher")).toBe("feminino");
      expect(validateUserInput.extractSex("outro")).toBe("outro");
      expect(validateUserInput.extractSex("não binário")).toBe("outro");
      expect(validateUserInput.extractSex("texto inválido")).toBeNull();
    });
  });

  describe("extractActivityLevel", () => {
    it("should extract activity level from text", () => {
      expect(validateUserInput.extractActivityLevel("sedentário")).toBe(
        "sedentário"
      );
      expect(
        validateUserInput.extractActivityLevel("Sou muito sedentário")
      ).toBe("sedentário");
      expect(validateUserInput.extractActivityLevel("leve")).toBe("leve");
      expect(validateUserInput.extractActivityLevel("exercício leve")).toBe(
        "leve"
      );
      expect(validateUserInput.extractActivityLevel("moderado")).toBe(
        "moderado"
      );
      expect(validateUserInput.extractActivityLevel("intenso")).toBe("intenso");
      expect(
        validateUserInput.extractActivityLevel("texto inválido")
      ).toBeNull();
    });
  });

  describe("extractList", () => {
    it("should extract lists from text", () => {
      expect(validateUserInput.extractList("nenhuma")).toEqual([]);
      expect(validateUserInput.extractList("lactose, glúten")).toEqual([
        "lactose",
        "glúten",
      ]);
      expect(validateUserInput.extractList("amendoim; frutos do mar")).toEqual([
        "amendoim",
        "frutos do mar",
      ]);
      expect(validateUserInput.extractList("peixe e carne vermelha")).toEqual([
        "peixe",
        "carne vermelha",
      ]);
    });
  });
});
