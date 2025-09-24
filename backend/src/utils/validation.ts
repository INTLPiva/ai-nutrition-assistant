export const validateUserInput = {
  extractNumber: (text: string): number | null => {
    const numbers = text.match(/\d+/);
    return numbers ? parseInt(numbers[0], 10) : null;
  },

  extractSex: (text: string): "masculino" | "feminino" | "outro" | null => {
    const normalized = text.toLowerCase().trim();

    if (
      normalized.includes("masc") ||
      normalized.includes("homem") ||
      normalized.includes("menino")
    ) {
      return "masculino";
    }
    if (
      normalized.includes("fem") ||
      normalized.includes("mulher") ||
      normalized.includes("menina")
    ) {
      return "feminino";
    }
    if (
      normalized.includes("outro") ||
      normalized.includes("não binário") ||
      normalized.includes("nb")
    ) {
      return "outro";
    }

    return null;
  },

  extractActivityLevel: (
    text: string
  ): "sedentário" | "leve" | "moderado" | "intenso" | null => {
    const normalized = text.toLowerCase().trim();

    if (
      normalized.includes("sedent") ||
      normalized.includes("nenhum") ||
      normalized.includes("pouco")
    ) {
      return "sedentário";
    }
    if (
      normalized.includes("leve") ||
      normalized.includes("1-3") ||
      normalized.includes("pouco exerc")
    ) {
      return "leve";
    }
    if (
      normalized.includes("moderad") ||
      normalized.includes("3-5") ||
      normalized.includes("regular")
    ) {
      return "moderado";
    }
    if (
      normalized.includes("intens") ||
      normalized.includes("pesado") ||
      normalized.includes("6-7") ||
      normalized.includes("muito")
    ) {
      return "intenso";
    }

    return null;
  },

  extractList: (text: string): string[] => {
    const normalized = text.toLowerCase().trim();

    if (
      normalized === "nenhuma" ||
      normalized === "nenhum" ||
      normalized === "não" ||
      normalized === "não tenho"
    ) {
      return [];
    }

    return text
      .split(/[,;]|(?:\s+e\s+)|(?:\s+ou\s+)/)
      .map((item) => item.trim())
      .filter(
        (item) =>
          item.length > 0 && !["e", "ou", "também"].includes(item.toLowerCase())
      );
  },
};
