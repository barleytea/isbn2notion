import { AppSheetApi } from "./app-sheet-api";
import { GoogleBooksApi } from "./google-books-api";
import { NotionApi } from "./notion-api";
import { type BookSummary } from "./types";
import { Utils } from "./utils";

const doGet = (e: any): void => {
  console.log("doGet");
};

const doPost = (e: any): void => {
  const requestParams = JSON.parse(e.postData.getDataAsString());

  // event から必要な情報を取得
  const bookId = requestParams.id;
  const isbnCode = requestParams.isbn;

  handleDoPost(bookId, isbnCode);
};

const handleDoPost = (bookId: string, isbnCode: string): void => {
  // ISBN から書誌情報の概要を取得
  const summary: BookSummary = fecthBooksByIsbn(isbnCode);

  if (Object.keys(summary).length === 0) {
    console.log(`isbn: ${isbnCode} is not found.`);
    return;
  }

  // notion に既に ISBN が登録済みであれば skip
  const page = NotionApi.fetchPageByIsbn(isbnCode);
  if (page?.results != null && page.results.length > 0) {
    console.log(
      `skipped isbn: ${isbnCode}, because this isbn already registered.`,
    );
    return;
  }

  summary.id = bookId;

  // AppSheet に書誌情報の概要レコードを追加
  AppSheetApi.postBookSummary(summary);

  // save to notion
  NotionApi.addPageToDatabase(summary);
};

function fecthBooksByIsbn(isbn: string): BookSummary {
  const bookCoverBaseEndpoint = "https://iss.ndl.go.jp/thumbnail/";

  const googleBooksResponse = GoogleBooksApi.fecthBooksByIsbn(isbn);
  if (googleBooksResponse) {
    return {
      id: "",
      isbn,
      title: googleBooksResponse.title,
      publisher: googleBooksResponse.publisher,
      pubdate: Utils.formatDate(googleBooksResponse.pubdate),
      cover: bookCoverBaseEndpoint + isbn,
      author: googleBooksResponse.author,
    };
  }

  const emptySummary: BookSummary = {
    id: "",
    author: "",
    isbn,
    title: "",
    publisher: "",
    pubdate: "",
    cover: "",
  };
  return emptySummary;
}
