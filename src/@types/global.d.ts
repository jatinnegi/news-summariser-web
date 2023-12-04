export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPLICATION_PASSWORD: string;
      JWT_SECRET: string;
      MONGODB_URI: string;
      CHAT_GPT_TOKEN: string;
      GOOGLE_CLIENT_ID: string;
    }
  }
}
