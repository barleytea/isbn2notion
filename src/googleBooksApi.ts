import { BookSummary } from "./types";

export namespace GoogleBooksApi {
  // Google Booksの書籍情報取得API
  const bookApi =
    "https://www.googleapis.com/books/v1/volumes?country=JP&q=isbn:";

  export const fecthBooksByIsbn = (isbn: string) => {
    const response = JSON.parse(
      UrlFetchApp.fetch(bookApi + isbn).getContentText("UTF-8")
    );

    if (response.totalItems < 1) {
      return undefined;
    }

    const item = response.items[0];
    const volumeInfo = item.volumeInfo;

    return {
      title: (
        (volumeInfo.subtitle ? volumeInfo.subtitle : "") +
        " " +
        volumeInfo.title
      ).trim(),
      pubdate: volumeInfo.publishedDate,
      author: volumeInfo.authors.join(","),
    };
  };
}
