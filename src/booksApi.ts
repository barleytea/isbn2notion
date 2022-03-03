import { BookSummary } from "./types";

export namespace BooksApi {
    // openBDの書籍情報取得API
    const bookApi = "https://api.openbd.jp/v1/get?isbn=";

    export const fecthBooksByIsbn = (isbn: string): BookSummary => {
        const response = JSON.parse(
            UrlFetchApp.fetch(bookApi + isbn).getContentText("UTF-8")
        )[0];
        return response.summary;
    };
}
