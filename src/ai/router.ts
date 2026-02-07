export type AIProvider = "stub" | "openai" | "anthropic" | "gemini";

export interface AIRequest {
  prompt: string;
  context?: string;
  provider?: AIProvider;
  locale?: string;
}

export interface AIResponse {
  message: string;
  provider: AIProvider;
  timestamp: string;
}

export async function routeAIRequest(request: AIRequest): Promise<AIResponse> {
  const provider = request.provider ?? "stub";

  switch (provider) {
    case "stub":
      return stubResponse(request);
    case "openai":
    case "anthropic":
    case "gemini":
      return stubResponse(request);
    default:
      return stubResponse(request);
  }
}

async function stubResponse(request: AIRequest): Promise<AIResponse> {
  const locale = request.locale ?? "sv";

  const responses: Record<string, string> = {
    sv: "Hej! Jag är Boris 🐙 Just nu lär jag mig fortfarande, men snart kan jag hjälpa dig på riktigt!",
    en: "Hi! I'm Boris 🐙 I'm still learning, but soon I'll be able to really help you!",
    ar: "مرحباً! أنا بوريس 🐙 ما زلت أتعلم، لكن قريباً سأتمكن من مساعدتك حقاً!",
  };

  return {
    message: responses[locale] ?? responses["sv"],
    provider: "stub",
    timestamp: new Date().toISOString(),
  };
}
