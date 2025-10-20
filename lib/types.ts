export interface GeminiImagePart {
  base64: string;
  mimeType: string;
}

export interface GeminiTextPart {
  text: string;
}

export interface GeminiInlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export type GeminiContentPart = GeminiTextPart | GeminiInlineDataPart;
