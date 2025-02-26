declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_URL: string;
    }
  }
}

export {}; 