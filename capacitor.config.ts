import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.circuitiq.app",
  appName: "CircuitIQ",
  webDir: "dist",
  // server: {
  //   androidScheme: "https"
  // },
  server: {
    url: "https://circuitiq-ecru.vercel.app",
    cleartext: true,
  },
};

export default config;
