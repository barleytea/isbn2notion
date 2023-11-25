import { AppSheetApi } from "./app-sheet-api";
import { NotionApi } from "./notion-api";
import { BookSummary } from "./types";

const BOOK_COVER_BASE_ENDPOINT = "https://iss.ndl.go.jp/thumbnail/";

const replaceAppSheetCovers = (): void => {
  AppSheetApi.listBookSummaries().forEach((res) => {
    const isbn: string = res.isbn;
    if (res.cover.startsWith(BOOK_COVER_BASE_ENDPOINT)) {
      console.log(
        `skipped isbn: ${isbn}, because this isbn already registered.`,
      );
      return;
    }
    const cover: string = BOOK_COVER_BASE_ENDPOINT + isbn;
    // AppSheet の cover を置換
    AppSheetApi.postBookSummary({ ...res, cover });
    console.log(`replaced AppSheet cover: ${isbn}`);
  });

  console.log("finished");
};

const replaceNotionCovers = (): void => {
  let processedCount = 0;
  let nextCorsor: string = "a8547154-87f2-4b3c-a0c2-9ff8b6b59f50";
  let hasMore = true;

  while (hasMore) {
    const response = NotionApi.listPages(nextCorsor);
    const results = response.results;
    hasMore = response.has_more;
    nextCorsor = response.next_cursor;
    console.log(`nextCorsor: ${nextCorsor}`);

    results.forEach((page: { properties: any; id: string; cover: any }) => {
      const isbn: string = page.properties.ISBN.rich_text[0].text.content;
      const cover: string = BOOK_COVER_BASE_ENDPOINT + isbn;

      // Notion の cover を置換
      NotionApi.patchPageCover(page.id, cover);
      console.log(`replaced Notion cover: ${isbn}`);
      processedCount++;
    });
  }

  console.log("finished: " + processedCount);
};
