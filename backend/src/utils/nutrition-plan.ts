import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { UserData } from "../types";

export const generateNutritionPlan = async (
  userData: UserData,
  llm: ChatGoogleGenerativeAI
): Promise<string> => {
  const user = userData.user;

  // Calculate BMR and daily calories
  const bmr = calculateBMR(
    user?.weight_kg || 0,
    user?.height_cm || 0,
    user?.age || 0,
    user?.sex || "outro"
  );
  const dailyCalories = calculateDailyCalories(
    bmr,
    user?.activity_level || "sedentário"
  );

  const systemPrompt = `Você é um nutricionista experiente. Crie um plano alimentar personalizado detalhado e estruturado.

INSTRUÇÕES IMPORTANTES:
- Use linguagem clara e acessível
- Organize o plano de forma estruturada com seções bem definidas
- Inclua horários sugeridos para as refeições
- Considere todas as restrições e preferências informadas
- Forneça alternativas quando possível
- Inclua dicas práticas e motivacionais
- NÃO forneça diagnósticos ou prescrições médicas
- Recomende acompanhamento profissional quando necessário

DADOS DO USUÁRIO:
- Idade: ${user?.age || "não informada"} anos
- Sexo: ${user?.sex || "não informado"}
- Altura: ${user?.height_cm || "não informada"} cm
- Peso: ${user?.weight_kg || "não informado"} kg
- Nível de atividade: ${user?.activity_level || "não informado"}
- Objetivo: ${user?.goal || "não informado"}
- Refeições por dia: ${user?.meals_per_day || "não informado"}
- Restrições alimentares: ${user?.dietary_restrictions?.join(", ") || "nenhuma"}
- Alergias: ${user?.allergies?.join(", ") || "nenhuma"}
- Preferências/aversões: ${user?.preferences?.join(", ") || "nenhuma"}
- Condições médicas: ${user?.medical_conditions?.join(", ") || "nenhuma"}
- TMB estimada: ${bmr.toFixed(0)} kcal
- Gasto calórico diário estimado: ${dailyCalories.toFixed(0)} kcal

ESTRUTURA DO PLANO:
1. RESUMO NUTRICIONAL
2. PLANO ALIMENTAR DIÁRIO
3. SUGESTÕES DE CARDÁPIO SEMANAL
4. DICAS IMPORTANTES
5. RECOMENDAÇÕES GERAIS`;

  const userPrompt = `Crie um plano alimentar completo e personalizado para este usuário, seguindo todas as instruções e considerando todos os dados fornecidos.`;

  try {
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ];

    const response = await llm.invoke(messages);
    return response.content.toString();
  } catch (error) {
    console.error("Error generating nutrition plan:", error);
    return generateFallbackPlan(userData);
  }
};

const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  sex: string
): number => {
  if (!weight || !height || !age) return 0;

  // Mifflin-St Jeor Equation
  if (sex === "masculino") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

const calculateDailyCalories = (bmr: number, activityLevel: string): number => {
  const activityMultipliers = {
    sedentário: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725,
  };

  const multiplier =
    activityMultipliers[activityLevel as keyof typeof activityMultipliers] ||
    1.2;
  return bmr * multiplier;
};

const generateFallbackPlan = (userData: UserData): string => {
  const user = userData.user;

  return `# PLANO ALIMENTAR PERSONALIZADO

## 📊 RESUMO NUTRICIONAL
- **Objetivo**: ${user?.goal || "Melhoria da saúde geral"}
- **Refeições diárias**: ${user?.meals_per_day || 4} refeições
- **Nível de atividade**: ${user?.activity_level || "Moderado"}

## 🍽️ ESTRUTURA ALIMENTAR DIÁRIA

### Café da Manhã (7h-8h)
- Fonte de carboidrato: aveia, pães integrais ou frutas
- Proteína: ovos, iogurte grego ou queijo branco
- Gordura saudável: castanhas ou abacate
- Hidratação: água, chá ou café

### Lanche da Manhã (10h-10h30)
- Fruta + oleaginosa
- Ou iogurte com granola caseira

### Almoço (12h-13h)
- Proteína: carnes magras, peixes ou leguminosas
- Carboidrato: arroz integral, batata doce ou quinoa
- Vegetais: salada variada e legumes refogados
- Gordura: azeite de oliva extravirgem

### Lanche da Tarde (15h-16h)
- Opção 1: Vitamina de frutas com leite
- Opção 2: Sanduíche natural integral
- Opção 3: Mix de castanhas e frutas secas

### Jantar (19h-20h)
- Similar ao almoço, mas com porções menores
- Priorizar preparações mais leves
- Incluir sempre vegetais

## 💡 DICAS IMPORTANTES

### Hidratação
- Consuma pelo menos 2-3 litros de água por dia
- Inicie o dia com um copo de água

### Preparação
- Prefira alimentos in natura e minimamente processados
- Planeje as refeições com antecedência
- Tenha sempre lanches saudáveis disponíveis

### Horários
- Mantenha intervalos regulares entre as refeições
- Evite ficar mais de 4 horas sem comer
- Faça a última refeição até 3 horas antes de dormir

## ⚠️ OBSERVAÇÕES IMPORTANTES
- Este plano é uma orientação geral baseada nas informações fornecidas
- Para um acompanhamento personalizado e adequado, consulte um nutricionista
- Em caso de condições médicas específicas, procure orientação médica
- Ajuste as porções conforme sua fome e saciedade

## 🎯 PRÓXIMOS PASSOS
1. Implemente gradualmente as mudanças alimentares
2. Monitore como seu corpo responde às alterações
3. Mantenha um registro alimentar por algumas semanas
4. Considere buscar acompanhamento profissional personalizado

*Lembre-se: uma alimentação saudável é um processo gradual. Seja paciente consigo mesmo!*`;
};
