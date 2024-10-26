import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 ,
    proxy: {
      "/api": "https://br-selab.onrender.com",
      "/upload": "https://br-selab.onrender.com",
    },
  },
});