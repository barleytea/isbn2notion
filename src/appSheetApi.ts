import { BookSummary } from "./types";

export namespace AppSheetApi {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const { APP_SHEET_URL, APP_SHEET_KEY } = properties;

  export const postBookSummary = (summary: BookSummary) => {
    // AppSheet API に渡す params の payload 部分を組み立てる
    const payload = {
      Action: "Edit",
      Properties: {
        Locale: "ja-JP",
      },
      Rows: [summary],
    };

    const params = {
      contentType: "application/json",
      headers: {
        ApplicationAccessKey: APP_SHEET_KEY,
      },
      method: "post",
      payload: JSON.stringify(payload),
    };

    UrlFetchApp.fetch(APP_SHEET_URL, params);
  };
}
