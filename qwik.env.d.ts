// This file can be used to add references for global types like `vite/client`.

// Add global `vite/client` types. For more info, see: https://vitejs.dev/guide/features#client-types
import "vite/client";

declare global {
  interface Window {
    $setTheme: (theme: string) => void;
  }
}
