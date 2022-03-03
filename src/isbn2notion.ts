import { AppSheetApi } from "./appSheetApi";
import { BooksApi } from "./booksApi";
import { NotionApi } from "./notionApi";
import { BookSummary } from "./types";

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
        // 日付を適当に format しておく
        pubdate:
            response.pubdate.slice(0, 4) +
            "-" +
            response.pubdate.slice(4, 6) +
            "-" +
            response.pubdate.slice(6, 8),
        cover: response.cover,
        author: response.author,
    };

    // AppSheet に書誌情報の概要レコードを追加
    AppSheetApi.postBookSummary(summary);

    // save to notion
    NotionApi.addPageToDatabase(summary);
}
