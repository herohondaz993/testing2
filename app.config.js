module.exports = {
  name: "MindJournal",
  slug: "mindjournal",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    bundler: "metro"
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true
  },
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  },
  // Environment variables that will be available at runtime
  runtimeEnv: {
    EXPO_PUBLIC_RORK_API_BASE_URL: process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "https://api.rork.app"
  }
};