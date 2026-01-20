
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GroundingChunk } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  // Gemini 2.5 Flash Image - Edit Images
  async editImage(base64Image: string, prompt: string): Promise<string | null> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1] || base64Image, mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }

  // Gemini 3 Pro Image Preview - Generate Images
  async generateImage(prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }

  // Gemini 2.5 Flash - Maps Grounding
  async searchPlaces(query: string, location?: { lat: number; lng: number }) {
    const config: any = {
      tools: [{ googleMaps: {} }]
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng
          }
        }
      };
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config
    });

    return {
      text: response.text,
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  // Gemini 3 Flash Preview - Search Grounding
  async searchInfo(query: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    return {
      text: response.text,
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }
}
