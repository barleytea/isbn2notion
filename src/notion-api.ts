import { type BookSummary } from "./types";

export namespace NotionApi {
  const notionEndpoint = "https://api.notion.com/v1/pages";
  const notionDabaBaseEndPoint = "https://api.notion.com/v1/databases/";

  const properties = PropertiesService.getScriptProperties().getProperties();
  const { NOTION_TOKEN, NOTION_DB_ID } = properties;

  export const addPageToDatabase = (book: BookSummary): any => {
    const postData = {
      parent: { database_id: NOTION_DB_ID },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: book.title,
              },
            },
          ],
        },
        //
        Author: {
          rich_text: [
            {
              text: {
                content: book.author,
              },
            },
          ],
        },
        //
        ISBN: {
          rich_text: [
            {
              text: {
                content: book.isbn,
              },
            },
          ],
        },
        //
        Publisher: {
          rich_text: [
            {
              text: {
                content: book.publisher,
              },
            },
          ],
        },
        //
        PubDate: {
          rich_text: [
            {
              text: {
                content: book.pubdate,
              },
            },
          ],
        },
      },
    };

    if (book.cover != null) {
      Object.assign(postData, {
        cover: {
          type: "external",
          external: {
            url: book.cover,
          },
        },
      });
    }

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + NOTION_TOKEN,
        "Notion-Version": "2021-05-13",
      },
      payload: JSON.stringify(postData),
    };

    return UrlFetchApp.fetch(notionEndpoint, options);
  };

  export const fetchPageByIsbn = (isbn: string): any => {
    const postData = {
      filter: {
        property: "ISBN",
        rich_text: {
          equals: isbn,
        },
      },
    };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + NOTION_TOKEN,
        "Notion-Version": "2021-05-13",
      },
      payload: JSON.stringify(postData),
    };

    return JSON.parse(
      UrlFetchApp.fetch(
        notionDabaBaseEndPoint + NOTION_DB_ID + "/query",
        options,
      ).getContentText("UTF-8"),
    );
  };

  export const patchPageCover = (pageId: string, cover: string): void => {
    const param = {
      cover: {
        type: "external",
        external: {
          url: cover,
        },
      },
    };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "patch",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + NOTION_TOKEN,
        "Notion-Version": "2021-05-13",
      },
      payload: JSON.stringify(param),
    };

    UrlFetchApp.fetch(`${notionEndpoint}/${pageId}`, options);
  };

  export const listPages = (cursor: string): any => {
    const postData =
      cursor === ""
        ? {
            sorts: [
              {
                property: "created",
                direction: "ascending",
              },
            ],
          }
        : {
            start_cursor: cursor,
            sorts: [
              {
                property: "created",
                direction: "ascending",
              },
            ],
          };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + NOTION_TOKEN,
        "Notion-Version": "2021-05-13",
      },
      payload: JSON.stringify(postData),
    };

    return JSON.parse(
      UrlFetchApp.fetch(
        notionDabaBaseEndPoint + NOTION_DB_ID + "/query",
        options,
      ).getContentText("UTF-8"),
    );
  };
}
