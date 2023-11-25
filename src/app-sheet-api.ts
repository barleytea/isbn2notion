import { type BookSummary } from "./types";

export namespace AppSheetApi {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const { APP_SHEET_URL, APP_SHEET_KEY } = properties;

  export const postBookSummary = (summary: BookSummary): void => {
    // AppSheet API に渡す params の payload 部分を組み立てる
    const payload = {
      Action: "Edit",
      Properties: {
        Locale: "ja-JP",
      },
      Rows: [summary],
    };

    const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      contentType: "application/json",
      headers: {
        ApplicationAccessKey: APP_SHEET_KEY,
      },
      method: "post",
      payload: JSON.stringify(payload),
    };

    UrlFetchApp.fetch(APP_SHEET_URL, params);
  };

  export const listBookSummaries = (): BookSummary[] => {
    const payload = {
      Action: "Find",
      Properties: {
        Locale: "ja-JP",
      },
    };

    const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      contentType: "application/json",
      headers: {
        ApplicationAccessKey: APP_SHEET_KEY,
      },
      method: "post",
      payload: JSON.stringify(payload),
    };

    const res: BookSummary[] = JSON.parse(
      UrlFetchApp.fetch(APP_SHEET_URL, params).getContentText("UTF-8"),
    );
    return res;
  };
}
