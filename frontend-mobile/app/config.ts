import Constants from "expo-constants";

// Một cách mạnh mẽ hơn để lấy cấu hình `extra`, kiểm tra các phiên bản manifest khác nhau.
const extra = (Constants.expoConfig?.extra ??
  Constants.manifest?.extra ??
  Constants.manifest2?.extra) as { API_BASE_URL: string } | undefined;

if (!extra?.API_BASE_URL) {
  // Lỗi này mô tả rõ ràng hơn và sẽ giúp gỡ lỗi nếu cấu hình bị thiếu.
  // Thà rằng ứng dụng dừng lại sớm còn hơn là gặp lỗi khó hiểu lúc chạy.
  throw new Error(
    "API_BASE_URL is not defined in your app.json's `extra` field. Please add it.",
  );
}

export const API_BASE_URL = extra.API_BASE_URL;
