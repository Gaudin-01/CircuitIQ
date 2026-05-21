import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.circuitiq.app",
  appName: "CircuitIQ",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
