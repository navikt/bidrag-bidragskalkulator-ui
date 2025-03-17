declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_URL: string;
      UMAMI_WEBSITE_ID: string;
    }
  }

  interface Window {
    umami?: {
      /**
       * Sporer en hendelse til Umami Analytics
       *
       * @param event Navnet på hendelsen som skal spores
       * @param data Valgfri data som skal sendes med hendelsen
       * @returns Promise<void>
       */
      track: (event: string, data?: Record<string, unknown>) => Promise<void>;
    };
  }
}

export {};
