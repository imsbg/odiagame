
export interface GameScene {
  story: string;
  choices: string[];
  image_prompt: string;
}

export type GameState = 'initial' | 'loading' | 'playing' | 'error';

// This could be expanded if Gemini returns richer grounding metadata.
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // other types of chunks if applicable
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other grounding metadata fields
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // other candidate fields
}
