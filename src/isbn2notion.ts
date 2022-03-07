import { AppSheetApi } from "./appSheetApi";
import { BooksApi } from "./booksApi";
import { NotionApi } from "./notionApi";
import { BookSummary } from "./types";
import { Utils } from "./utils";

function doPost(e) {
  const requestParams = JSON.parse(e.postData.getDataAsString());

  // event から必要な情報を取得
  const bookId = requestParams.id;
  const isbnCode = requestParams.isbn;

  // ISBN から書誌情報の概要を取得
  const response = BooksApi.fecthBooksByIsbn(isbnCode);
  const summary: BookSummary = {
    id: bookId,
    isbn: isbnCode,
    title: response.title,
    publisher: response.publisher,
    pubdate: Utils.formatDate(response.pubdate),
    cover: response.cover,
    author: response.author,
  };

  // notion に既に ISBN が登録済みであれば skip
  const page = NotionApi.fetchPageByIsbn(isbnCode);
  if (page && page.results && page.results.length > 0) {
    console.log(
      `skipped isbn: ${isbnCode}, because this isbn already registered.`
    );
    return;
  }

  // AppSheet に書誌情報の概要レコードを追加
  AppSheetApi.postBookSummary(summary);

  // save to notion
  NotionApi.addPageToDatabase(summary);
}
