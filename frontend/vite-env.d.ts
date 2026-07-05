/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IC_HOST: string;
  readonly VITE_IDENTITY_PROVIDER: string;
  readonly VITE_CANISTER_ID_QUIZ_ENGINE: string;
  readonly VITE_CANISTER_ID_SCORING: string;
  readonly VITE_CANISTER_ID_USER: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
