import "cypress-react-selector";
import "@testing-library/cypress/add-commands";

// let testItems = new Array(40).fill(0).map((e, i) => {
//   return {
//     author: `author${i}`,
//     created_at: new Date(Date.now() - i * 3600000).toString(), //i hours ago
//     objectID: "" + i,
//     story_title: `title_${i}`,
//     story_url: "http://custom.url/" + i,
//   };
// });
// let testItemsObj = testItems.reduce((prev, cur, idx) => {
//   prev[idx] = cur;
//   return prev;
// }, {});

//interface Hit{
// author: string;
// created_at: string;
// objectID: string; //assumed to be unique
// story_title: string;
// story_url: string;
// }

// interface HitsPageInfo {
//   exhaustiveNbHits: boolean;
//   exhaustiveTypo: boolean;
//   hits: Array<Hit>;
//   hitsPerPage: number;
//   nbHits: number;
//   nbPages: number;
//   page: number;
//   params: string;
//   processingTimeMS: number;
//   query: string;
// }

describe("AllView API tests", () => {
  it("renders at least 8 items", async () => {
    var fetchedPage = await new Promise(async(resolve) => {
      cy.intercept(
        "https://hn.algolia.com/api/v1/search_by_date*",
        { middleware: true },
        (req) => {
          req.on("response", (res) => {
            fetchedPage = { ...res.body };
            res.send();
            resolve(fetchedPage);
            // throw Error("myError");
          });
        }
      ).as("apiRequest");
      cy.visit("/");
    });
    cy.waitForReact();
    for (let i = 0; i < 8; i++) {
      cy.findAllByTestId("item_component__container", { timeout: 10000 })
        .eq(i)
        .should("exist");
      cy.findAllByTestId("item_component__container", { timeout: 10000 })
        .eq(i)
        .findByText(fetchedPage.hits[5].story_title)
        .should("exist");
      cy.findAllByTestId("item_component__container", { timeout: 10000 })
        .eq(i)
        .should("contain.text", fetchedPage.hits[5].story_title);
    }
    cy.findAllByText(fetchedPage.nbPages).should("have.length", 1);
  });
});
