import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { UserSession, MessageResponse, QuestionStep, UserData } from "../types";
import { env } from "../config/env";
import { sessionService } from "./session.service";
import { validateUserInput } from "../utils/validation";
import { generateNutritionPlan } from "../utils/nutrition-plan";

class NutritionAssistantService {
  private llm: ChatGoogleGenerativeAI;

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      modelName: "gemini-2.0-flash",
      apiKey: env.GEMINI_API_KEY,
      temperature: 0.7,
      maxOutputTokens: 2048,
    });
  }

  async processMessage(
    sessionId: string,
    message: string
  ): Promise<MessageResponse> {
    try {
      let session = sessionService.getSession(sessionId);

      if (!session) {
        session = sessionService.createSession(sessionId);
      }

      // Add user message to history
      sessionService.addMessage(sessionId, {
        role: "user",
        content: message,
        timestamp: new Date(),
      });

      const response = await this.handleCurrentStep(session, message);

      // Add assistant response to history
      sessionService.addMessage(sessionId, {
        role: "assistant",
        content: response.text,
        timestamp: new Date(),
      });

      return response;
    } catch (error) {
      console.error("Error processing message:", error);
      return {
        json: null,
        text: "Desculpe, ocorreu um erro interno. Tente novamente mais tarde.",
        done: false,
      };
    }
  }

  private async handleCurrentStep(
    session: UserSession,
    message: string
  ): Promise<MessageResponse> {
    const step = session.currentStep;

    switch (step) {
      case QuestionStep.PERMISSION:
        return this.handlePermissionStep(session, message);

      case QuestionStep.AGE:
        return this.handleAgeStep(session, message);

      case QuestionStep.SEX:
        return this.handleSexStep(session, message);

      case QuestionStep.HEIGHT:
        return this.handleHeightStep(session, message);

      case QuestionStep.WEIGHT:
        return this.handleWeightStep(session, message);

      case QuestionStep.ACTIVITY_LEVEL:
        return this.handleActivityLevelStep(session, message);

      case QuestionStep.GOAL:
        return this.handleGoalStep(session, message);

      case QuestionStep.MEALS_PER_DAY:
        return this.handleMealsStep(session, message);

      case QuestionStep.DIETARY_RESTRICTIONS:
        return this.handleDietaryRestrictionsStep(session, message);

      case QuestionStep.ALLERGIES:
        return this.handleAllergiesStep(session, message);

      case QuestionStep.PREFERENCES:
        return this.handlePreferencesStep(session, message);

      case QuestionStep.MEDICAL_CONDITIONS:
        return this.handleMedicalConditionsStep(session, message);

      default:
        return this.handleGeneralQuestion(session, message);
    }
  }

  private handlePermissionStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const isPositive = /sim|yes|ok|pode|claro|vamos|aceito/i.test(
      message.toLowerCase()
    );

    if (isPositive) {
      sessionService.advanceStep(session.id);
      return {
        json: session.userData,
        text: "Perfeito! Vamos começar. Qual é a sua idade?",
        done: false,
      };
    }

    return {
      json: session.userData,
      text: "Tudo bem! Quando quiser criar seu plano alimentar personalizado, é só me avisar. Posso fazer algumas perguntas para criar seu plano alimentar personalizado?",
      done: false,
    };
  }

  private handleAgeStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const age = validateUserInput.extractNumber(message);

    if (!age || age < 1 || age > 120) {
      return {
        json: session.userData,
        text: "Por favor, me informe uma idade válida entre 1 e 120 anos.",
        done: false,
      };
    }

    sessionService.updateUserData(session.id, {
      user: { age },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: "Obrigado! Qual é o seu sexo/gênero? (masculino, feminino ou outro)",
      done: false,
    };
  }

  private handleSexStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const sex = validateUserInput.extractSex(message);

    if (!sex) {
      return {
        json: session.userData,
        text: "Por favor, informe: masculino, feminino ou outro.",
        done: false,
      };
    }

    sessionService.updateUserData(session.id, {
      user: { sex },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: "Perfeito! Qual é a sua altura em centímetros?",
      done: false,
    };
  }

  private handleHeightStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const height = validateUserInput.extractNumber(message);

    if (!height || height < 50 || height > 300) {
      return {
        json: session.userData,
        text: "Por favor, informe uma altura válida entre 50 e 300 cm.",
        done: false,
      };
    }

    sessionService.updateUserData(session.id, {
      user: { height_cm: height },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: "Ótimo! E qual é o seu peso atual em quilogramas?",
      done: false,
    };
  }

  private handleWeightStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const weight = validateUserInput.extractNumber(message);

    if (!weight || weight < 20 || weight > 500) {
      return {
        json: session.userData,
        text: "Por favor, informe um peso válido entre 20 e 500 kg.",
        done: false,
      };
    }

    sessionService.updateUserData(session.id, {
      user: { weight_kg: weight },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: "Entendi! Como você classificaria seu nível de atividade física?\n\n• Sedentário (pouco ou nenhum exercício)\n• Leve (exercício leve 1-3 dias por semana)\n• Moderado (exercício moderado 3-5 dias por semana)\n• Intenso (exercício pesado 6-7 dias por semana)",
      done: false,
    };
  }

  private handleActivityLevelStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const activityLevel = validateUserInput.extractActivityLevel(message);

    if (!activityLevel) {
      return {
        json: session.userData,
        text: "Por favor, escolha uma opção: sedentário, leve, moderado ou intenso.",
        done: false,
      };
    }

    sessionService.updateUserData(session.id, {
      user: { activity_level: activityLevel },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: "Perfeito! Qual é o seu objetivo principal? (ex: emagrecimento, ganho de massa muscular, manutenção do peso, controle de glicemia, etc.)",
      done: false,
    };
  }

  private handleGoalStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    sessionService.updateUserData(session.id, {
      user: { goal: message.trim() },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: "Excelente! Quantas refeições você costuma fazer por dia?",
      done: false,
    };
  }

  private handleMealsStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const meals = validateUserInput.extractNumber(message);

    if (!meals || meals < 1 || meals > 10) {
      return {
        json: session.userData,
        text: "Por favor, informe um número válido de refeições entre 1 e 10.",
        done: false,
      };
    }

    sessionService.updateUserData(session.id, {
      user: { meals_per_day: meals },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: 'Ótimo! Você tem alguma restrição alimentar? (ex: vegetariano, vegano, halal, kosher, sem glúten, etc.) Se não tiver, pode responder "nenhuma".',
      done: false,
    };
  }

  private handleDietaryRestrictionsStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const restrictions = validateUserInput.extractList(message);

    sessionService.updateUserData(session.id, {
      user: { dietary_restrictions: restrictions },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: 'Entendi! Você tem alguma alergia ou intolerância alimentar? (ex: lactose, amendoim, frutos do mar, etc.) Se não tiver, pode responder "nenhuma".',
      done: false,
    };
  }

  private handleAllergiesStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const allergies = validateUserInput.extractList(message);

    sessionService.updateUserData(session.id, {
      user: { allergies },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: 'Perfeito! Há algum alimento que você não gosta ou tem preferência em evitar? Se não houver, pode responder "nenhuma".',
      done: false,
    };
  }

  private handlePreferencesStep(
    session: UserSession,
    message: string
  ): MessageResponse {
    const preferences = validateUserInput.extractList(message);

    sessionService.updateUserData(session.id, {
      user: { preferences },
    });
    sessionService.advanceStep(session.id);

    return {
      json: session.userData,
      text: 'Última pergunta! Você tem alguma condição médica relevante que devo considerar? (ex: diabetes, hipertensão, etc.) Se não tiver, pode responder "nenhuma".',
      done: false,
    };
  }

  private async handleMedicalConditionsStep(
    session: UserSession,
    message: string
  ): Promise<MessageResponse> {
    const medicalConditions = validateUserInput.extractList(message);

    const finalUserData: UserData = {
      completed: true,
      collected_at: new Date().toISOString(),
      user: {
        ...session.userData.user,
        medical_conditions: medicalConditions,
        timezone: "America/Sao_Paulo",
      },
    };

    sessionService.updateUserData(session.id, finalUserData);
    sessionService.advanceStep(session.id);

    const nutritionPlan = await generateNutritionPlan(finalUserData, this.llm);

    const responseText = `Perfeito! Coletei todas as informações necessárias. Aqui está seu plano alimentar personalizado:\n\n${nutritionPlan}\n\n##EXPORT_PDF`;

    return {
      json: finalUserData,
      text: responseText,
      done: true,
    };
  }

  private async handleGeneralQuestion(
    session: UserSession,
    message: string
  ): Promise<MessageResponse> {
    if (this.containsMedicalRequest(message)) {
      return {
        json: session.userData,
        text: "Importante: Não posso fornecer diagnósticos ou prescrições médicas. Para questões de saúde específicas, recomendo consultar um profissional de saúde qualificado. Posso ajudar com orientações gerais sobre alimentação saudável.",
        done: false,
      };
    }

    try {
      const systemPrompt = `Você é um assistente nutricional amigável. Responda de forma útil e educativa, mas sempre recomende consultar profissionais de saúde para questões médicas específicas.`;

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(message),
      ];

      const response = await this.llm.invoke(messages);

      return {
        json: session.userData,
        text: response.content.toString(),
        done: false,
      };
    } catch (error) {
      console.error("Error in general conversation:", error);
      return {
        json: session.userData,
        text: "Desculpe, não consegui processar sua mensagem. Pode reformular sua pergunta?",
        done: false,
      };
    }
  }

  private containsMedicalRequest(message: string): boolean {
    const medicalKeywords = [
      "diagnóstico",
      "diagnostico",
      "remédio",
      "medicamento",
      "receita",
      "prescrição",
      "doença",
      "sintoma",
      "tratamento",
      "cura",
      "medicina",
    ];

    return medicalKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
  }
}

export const nutritionAssistant = new NutritionAssistantService();
