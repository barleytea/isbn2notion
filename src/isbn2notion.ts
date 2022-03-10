import { AppSheetApi } from "./appSheetApi";
import { BooksApi } from "./booksApi";
import { GoogleBooksApi } from "./googleBooksApi";
import { NotionApi } from "./notionApi";
import { BookSummary } from "./types";
import { Utils } from "./utils";

function doPost(e) {
  const requestParams = JSON.parse(e.postData.getDataAsString());

  // event から必要な情報を取得
  const bookId = requestParams.id;
  const isbnCode = requestParams.isbn;

  // ISBN から書誌情報の概要を取得
  const summary: BookSummary = fecthBooksByIsbn(isbnCode);

  // notion に既に ISBN が登録済みであれば skip
  const page = NotionApi.fetchPageByIsbn(isbnCode);
  if (page && page.results && page.results.length > 0) {
    console.log(
      `skipped isbn: ${isbnCode}, because this isbn already registered.`
    );
    return;
  }

  summary.id = bookId;

  // AppSheet に書誌情報の概要レコードを追加
  AppSheetApi.postBookSummary(summary);

  // save to notion
  NotionApi.addPageToDatabase(summary);
}

function fecthBooksByIsbn(isbn: string): BookSummary {
  const openBdResponse = BooksApi.fecthBooksByIsbn(isbn);
  if (openBdResponse) {
    return {
      id: "",
      isbn,
      title: openBdResponse.title,
      publisher: openBdResponse.publisher,
      pubdate: Utils.formatDate(openBdResponse.pubdate),
      cover: openBdResponse.cover,
      author: openBdResponse.author,
    };
  }

  const googleBooksResponse = GoogleBooksApi.fecthBooksByIsbn(isbn);
  if (googleBooksResponse) {
    return {
      id: "",
      isbn,
      title: googleBooksResponse.title,
      publisher: "",
      pubdate: Utils.formatDate(googleBooksResponse.pubdate),
      cover: "",
      author: googleBooksResponse.author,
    };
  }
}
