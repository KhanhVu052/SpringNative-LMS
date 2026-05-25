import Constants from "expo-constants";

// Một cách mạnh mẽ hơn để lấy cấu hình `extra`, kiểm tra các phiên bản manifest khác nhau.
const extra = (Constants.expoConfig?.extra ??
  Constants.manifest?.extra ??
  Constants.manifest2?.extra) as { API_BASE_URL: string } | undefined;

// Fallback to local API endpoint during standalone testing or when imported without extra field configuration
export const API_BASE_URL = extra?.API_BASE_URL || "http://10.0.2.2:8080";
