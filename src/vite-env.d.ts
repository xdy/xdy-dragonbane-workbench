/// <reference types="vite/client" />

interface ImportMeta {
  glob: (pattern: string, options?: { eager?: boolean }) => Record<string, any>;
}
