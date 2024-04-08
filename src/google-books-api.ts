import { BookSummary } from "./types";

export namespace GoogleBooksApi {
  // Google Booksの書籍情報取得API
  const bookApi =
    "https://www.googleapis.com/books/v1/volumes?country=JP&q=isbn:";

  export const fecthBooksByIsbn = (isbn: string): BookSummary => {
    const response = JSON.parse(
      UrlFetchApp.fetch(bookApi + isbn).getContentText("UTF-8"),
    );

    if (response.totalItems < 1) {
      return null as unknown as BookSummary;
    }

    const item = response.items[0];
    const volumeInfo = item.volumeInfo;

    return {
      id: "",
      isbn: isbn,
      cover: volumeInfo.imageLinks?.thumbnail ?? "",
      title: ((volumeInfo.subtitle !== undefined ? volumeInfo.subtitle : "") + " " + volumeInfo.title).trim(),
      pubdate: volumeInfo.publishedDate,
      author: volumeInfo.authors.join(","),
      publisher: volumeInfo.publisher !== undefined ? volumeInfo.publisher : "",
    };
  };
}
