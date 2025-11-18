
import { GoogleGenAI, Type } from "@google/genai";
import { BehavioralQuestion, Customer, SecurityScanResult } from "../types";

// Ensure API_KEY is available in the environment.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeCustomerCredit = async (customer: Customer): Promise<{ riskScore: number; predictedRepaymentDate: string }> => {
  const prompt = `
    Analyze the following customer's credit history to generate a risk score and predict the next repayment date.
    Customer Name: ${customer.name}
    Credit History: ${JSON.stringify(customer.creditHistory, null, 2)}
    
    RULES:
    - Risk score should be between 0 (very high risk) and 100 (very low risk).
    - A customer with many late payments is high risk. A new customer with no history is medium risk. A customer with a long history of timely payments is low risk.
    - Predicted repayment date should be a date string (YYYY-MM-DD) based on their past payment behavior, or 30 days from now if no clear pattern exists.
    - Output ONLY a JSON object with 'riskScore' (number) and 'predictedRepaymentDate' (string).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            predictedRepaymentDate: { type: Type.STRING }
          }
        }
      }
    });
    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Error analyzing customer credit:", error);
    // Return a default error state
    return { riskScore: 50, predictedRepaymentDate: "N/A" };
  }
};

export const generateCyberGuardianReport = async (networkDescription: string): Promise<SecurityScanResult> => {
  const prompt = `
    Act as a senior cybersecurity expert (AI CyberGuardian). Analyze the provided business network description for vulnerabilities.
    Description: "${networkDescription}"

    Identify potential weaknesses such as:
    - Weak or default WiFi passwords (e.g., 'admin', 'password123').
    - Mention of open, unnecessary ports (like FTP, Telnet).
    - General misconfigurations or insecure practices.

    Generate a security report with a score and actionable steps.
    - The security score should be from 0 (very insecure) to 100 (very secure).
    - Provide at least 3 actionable recommendations.
    - Format the output as a JSON object matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  risk: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating CyberGuardian report:", error);
    return { score: 0, vulnerabilities: [{ title: "API Error", description: "Could not generate report.", risk: "High", recommendation: "Check the API connection and try again." }] };
  }
};


export const generateBehavioralQuestions = async (personalTopic: string): Promise<BehavioralQuestion[]> => {
    const prompt = `
    Based on the personal topic "${personalTopic}", generate 4 unique, personal, multiple-choice questions that only the user would likely know the answer to.
    The questions should be subjective but have plausible distractors.

    RULES:
    - Each question must have exactly 4 options.
    - The options should be concise.
    - The output must be a valid JSON array of objects, where each object has a "question" (string) and "options" (array of 4 strings).
    - DO NOT include the correct answer in your response.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        });

        const questions: BehavioralQuestion[] = JSON.parse(response.text);
        // Ensure each question has exactly 4 options
        return questions.filter(q => q.options && q.options.length === 4);
    } catch (error) {
        console.error("Error generating behavioral questions:", error);
        return [];
    }
};
