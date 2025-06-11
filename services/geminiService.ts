
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GameScene } from '../types';
import { GEMINI_MODEL_TEXT, IMAGEN_MODEL, INITIAL_ODIA_SYSTEM_PROMPT_JSON, NEXT_SCENE_ODIA_PROMPT_JSON_TEMPLATE } from '../constants';

const parseGeminiJsonResponse = (responseText: string): GameScene | null => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/si;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr);
    if (
      parsed &&
      typeof parsed.story === 'string' &&
      Array.isArray(parsed.choices) &&
      parsed.choices.every((choice: any) => typeof choice === 'string') &&
      typeof parsed.image_prompt === 'string'
    ) {
      return parsed as GameScene;
    }
    console.error("Parsed JSON does not match GameScene structure or has invalid types:", parsed);
    throw new Error("Received invalid data structure from AI.");
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e, "\nRaw text:", responseText);
    throw new Error(`AI ରୁ JSON ପ୍ରତିକ୍ରିୟା ପାର୍ସ କରିବାରେ ବିଫଳ: ${e instanceof Error ? e.message : String(e)}`);
  }
};

export const getInitialScene = async (ai: GoogleGenAI): Promise<GameScene> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: INITIAL_ODIA_SYSTEM_PROMPT_JSON,
      config: {
        responseMimeType: "application/json",
      }
    });
    const gameScene = parseGeminiJsonResponse(response.text);
    if (!gameScene) {
      // Error already thrown by parseGeminiJsonResponse if parsing fails
      throw new Error("ପ୍ରାରମ୍ଭିକ ଦୃଶ୍ୟ ପାଇଁ AI ରୁ କୌଣସି ବୈଧ ତଥ୍ୟ ମିଳିଲା ନାହିଁ |");
    }
    return gameScene;
  } catch (error) {
    console.error("Error fetching initial scene:", error);
    throw new Error(`ପ୍ରାରମ୍ଭିକ ଦୃଶ୍ୟ ପାଇବାରେ ତ୍ରୁଟି: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getNextScene = async (ai: GoogleGenAI, currentStory: string, playerChoice: string): Promise<GameScene> => {
  const prompt = NEXT_SCENE_ODIA_PROMPT_JSON_TEMPLATE(currentStory, playerChoice);
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    const gameScene = parseGeminiJsonResponse(response.text);
     if (!gameScene) {
      throw new Error("ପରବର୍ତ୍ତୀ ଦୃଶ୍ୟ ପାଇଁ AI ରୁ କୌଣସି ବୈଧ ତଥ୍ୟ ମିଳିଲା ନାହିଁ |");
    }
    return gameScene;
  } catch (error) {
    console.error("Error fetching next scene:", error);
    throw new Error(`ପରବର୍ତ୍ତୀ ଦୃଶ୍ୟ ପାଇବାରେ ତ୍ରୁଟି: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateImageFromPrompt = async (ai: GoogleGenAI, imagePrompt: string): Promise<string> => {
  try {
    // Enhance prompt for better, culturally relevant images if possible
    const enhancedPrompt = `${imagePrompt}, cinematic lighting, fantasy illustration, Odia cultural elements if relevant.`;
    
    const response = await ai.models.generateImages({
        model: IMAGEN_MODEL,
        prompt: enhancedPrompt,
        config: {numberOfImages: 1, outputMimeType: 'image/jpeg'},
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      console.error("No image generated or image data is missing in API response:", response);
      throw new Error("AI ଦ୍ଵାରା କୌଣସି ଚିତ୍ର ତିଆରି ହେଲା ନାହିଁ କିମ୍ବା ଚିତ୍ର ତଥ୍ୟ ମିଳିଲା ନାହିଁ |");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    // Check if the error is from the API or local processing
    if (error instanceof Error && error.message.includes("SAFETY")) {
         throw new Error(`ଚିତ୍ର ତିଆରି କରିବାରେ ସୁରକ୍ଷା ନୀତି ସମସ୍ୟା: ${error.message}`);
    }
    throw new Error(`ଚିତ୍ର ତିଆରି କରିବାରେ ତ୍ରୁଟି: ${error instanceof Error ? error.message : String(error)}`);
  }
};
