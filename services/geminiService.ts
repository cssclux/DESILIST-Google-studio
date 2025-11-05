import { GoogleGenAI } from "@google/genai";
import type { Category } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDescription = async (title: string, keywords: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("AI functionality is disabled. Please set your API key.");
  }

  const prompt = `Generate a compelling and professional classified ad description for a "${title}" with the following key features or keywords: "${keywords}". The description should be friendly, persuasive, and highlight the key features to attract potential buyers. Keep it under 100 words and format it as a single paragraph. Do not use markdown or special formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini API:", error);
    throw new Error("Failed to generate the description due to an API error. Please try again.");
  }
};

export const suggestCategory = async (title: string, categories: Category[]): Promise<string> => {
  if (!API_KEY || !title) {
    return '';
  }

  const flatSubcategories = categories.flatMap(cat => cat.subcategories);
  const categoryList = flatSubcategories.map(c => `${c.id} (${c.name})`).join(', ');
  const prompt = `Based on the ad title "${title}", which of the following categories is the best fit? Please return ONLY the category ID from this list: [${categoryList}]. For example, if the best category is 'for-sale-electronics (Electronics)', you should return just 'for-sale-electronics'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });
    
    const suggestedId = response.text.trim();
    // Validate that the returned ID is one of the possible categories
    if (flatSubcategories.some(c => c.id === suggestedId)) {
        return suggestedId;
    }
    console.warn('Gemini returned an invalid category ID:', suggestedId);
    return ''; // Return empty if the model returns something unexpected
  } catch (error) {
    console.error("Error suggesting category with Gemini API:", error);
    throw new Error("Failed to suggest a category due to an API error. Please select one manually.");
  }
};

export const suggestPrice = async (title: string, description: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("AI functionality is disabled. Please set your API key.");
  }

  const prompt = `Based on the ad title "${title}" and description "${description}", suggest a realistic price for this item or service. The ad is for an African market, so use appropriate currency symbols if possible (e.g., ₦ for Nigeria, Ksh for Kenya, R for South Africa, GH₵ for Ghana, Br for Ethiopia, TSh for Tanzania, DH for Morocco, CFA for West/Central Africa, DZD for Algeria, P for Botswana, FC for DRC).
- For items, provide a clear price or a narrow price range (e.g., '₦150,000' or 'R 7,000 - R 7,500').
- For jobs, suggest a term like 'Competitive Salary'.
- For services where price varies, suggest 'Request a Quote'.
Return only the suggested price string, with no extra explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error suggesting price with Gemini API:", error);
    throw new Error("Failed to suggest a price due to an API error. Please enter one manually.");
  }
};