import { BookSummary } from "./types";

export namespace NotionApi {
    const notionEndpoint = "https://api.notion.com/v1/pages";

    const properties = PropertiesService.getScriptProperties().getProperties();
    const { NOTION_TOKEN, NOTION_DB_ID } = properties;

    export const addPageToDatabase = (book: BookSummary) => {
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

        if (book.cover) {
            Object.assign(postData, {
                cover: {
                    type: "external",
                    external: {
                        url: book.cover,
                    },
                },
            });
        }

        const options = {
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
}
