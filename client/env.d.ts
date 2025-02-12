/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_CAPSULE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
