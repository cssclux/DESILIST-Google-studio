import { GoogleGenAI, Type } from "@google/genai";
import type { Category } from '../types';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

export const generateDescription = async (title: string, keywords: string): Promise<string> => {
  if (!ai) {
    throw new Error("AI functionality is disabled. Please set your API key.");
  }

  const prompt = `Generate a compelling and professional classified ad description for a "${title}" with the following key features or keywords: "${keywords}". The description should be friendly, persuasive, and highlight the key features to attract potential buyers. Keep it under 100 words and format it as a single paragraph. Do not use markdown or special formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini API:", error);
    throw new Error("Failed to generate the description due to an API error. Please try again.");
  }
};

export const suggestCategory = async (title: string, categories: Category[]): Promise<string> => {
  if (!ai || !title) {
    return '';
  }

  const flatSubcategories = categories.flatMap(cat => cat.subcategories);
  const categoryList = flatSubcategories.map(c => `${c.id} (${c.name})`).join(', ');
  const prompt = `Based on the ad title "${title}", which of the following categories is the best fit? Please return ONLY the category ID from this list: [${categoryList}]. For example, if the best category is 'for-sale-electronics (Electronics)', you should return just 'for-sale-electronics'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
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
  if (!ai) {
    throw new Error("AI functionality is disabled. Please set your API key.");
  }

  const prompt = `Based on the ad title "${title}" and description "${description}", suggest a realistic price for this item or service for the Nigerian market. The primary currency is the Nigerian Naira (₦).
- For items, provide a clear price or a narrow price range in Naira (e.g., '₦50,000' or '₦70,000 - ₦75,000').
- For jobs, suggest a term like 'Competitive Salary'.
- For services where price varies, suggest 'Request a Quote'.
Return only the suggested price string, with no extra explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error suggesting price with Gemini API:", error);
    throw new Error("Failed to suggest a price due to an API error. Please enter one manually.");
  }
};

// FIX: Updated suggestFilters to use responseSchema for reliable JSON output.
export const suggestFilters = async (query: string, categoryName: string): Promise<string[]> => {
  if (!ai || (!query && !categoryName)) {
    return [];
  }

  const prompt = `You are an intelligent search assistant for a Nigerian classifieds website called OJA.ng.
Based on the search query "${query}" and the category "${categoryName}", suggest 3 to 5 concise and relevant filter chips to help the user narrow down their search.
These filters could be about condition (e.g., 'Brand New', 'Slightly Used'), price points relevant to Nigeria (e.g., 'Under ₦100,000'), specific features (e.g., '16GB RAM', 'En-suite'), or type (e.g., 'Remote', 'For Rent').`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    
    const responseText = response.text.trim();
    try {
      const filters = JSON.parse(responseText);
      if (Array.isArray(filters) && filters.every(item => typeof item === 'string')) {
        return filters;
      }
      console.warn("Gemini returned a valid JSON but not an array of strings:", responseText);
      return [];
    } catch (e) {
      console.warn("Gemini did not return a valid JSON array for filters:", responseText);
      return [];
    }
  } catch (error) {
    console.error("Error suggesting filters with Gemini API:", error);
    // Don't throw, just return empty array to prevent UI crash
    return [];
  }
};