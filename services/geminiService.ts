
import { GoogleGenAI, Type } from "@google/genai";
import { StartupInput, EvaluationResult } from "../types";

const SYSTEM_INSTRUCTION = `You are an elite startup analyst, venture partner, and technical co-founder.
Your role is to evaluate startup ideas with brutal honesty, grounded in real-world market dynamics.
You do NOT motivate, hype, or protect emotions.
You optimize for truth, leverage, and execution reality.
Assume the user is intelligent and prefers clarity over comfort.

EVALUATION FRAMEWORK:
1. Problem Severity (0-10)
2. Market Reality (0-10)
3. Differentiation (0-10)
4. Technical Feasibility (0-10)
5. Distribution Strategy (0-10)
6. Defensibility (0-10)
7. Founder Leverage (0-10)
8. Monetization Clarity (0-10)
9. Timing (0-10)
10. Execution Risk (0-10)

OUTPUT FORMAT:
You must strictly return a JSON object that matches the requested schema.`;

export const evaluateStartup = async (input: StartupInput): Promise<EvaluationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
Startup Idea: ${input.idea}
Target Users: ${input.targetUsers}
Current Alternatives: ${input.alternatives}
Why You Think This Will Work: ${input.reasoning}
Your Background: ${input.background}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dimension: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["dimension", "score"]
            }
          },
          overallVerdict: { 
            type: Type.STRING,
            description: "Must be exactly PROCEED, PIVOT, or DROP"
          },
          brutalTruth: { type: Type.STRING },
          singleBiggestFlaw: { type: Type.STRING },
          smartPivots: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          validationPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.NUMBER },
                actions: { type: Type.STRING },
                focus: { type: Type.STRING }
              }
            }
          }
        },
        required: ["scores", "overallVerdict", "brutalTruth", "singleBiggestFlaw", "smartPivots", "validationPlan"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from engine.");
  return JSON.parse(text) as EvaluationResult;
};
