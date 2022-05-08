import "cypress-react-selector";
import "@testing-library/cypress/add-commands";

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
let testItemsArrLength = 400;
let testItems = {};
testItems.angular = new Array(testItemsArrLength).fill(0).map((e, i) => {
  return {
    author: `author${i}`,
    created_at: new Date(Date.now() - i * 3600000).toString(), //i hours ago
    objectID: "" + i,
    story_title: `angular_${i}`,
    story_url: "http://custom.url/angular/" + i,
  };
});
testItems.reactjs = new Array(testItemsArrLength).fill(0).map((e, i) => {
  return {
    author: `author${i}`,
    created_at: new Date(Date.now() - i * 3600000).toString(), //i hours ago
    objectID: "" + i,
    story_title: `reactjs_${i}`,
    story_url: "http://custom.url/react/" + i,
  };
});
testItems.vuejs = new Array(testItemsArrLength).fill(0).map((e, i) => {
  return {
    author: `author${i}`,
    created_at: new Date(Date.now() - i * 3600000).toString(), //i hours ago
    objectID: "" + i,
    story_title: `vuejs_${i}`,
    story_url: "http://custom.url/vuejs/" + i,
  };
});

describe("AllView API tests", () => {
  beforeEach(() => {
    cy.intercept("https://hn.algolia.com/api/v1/search_by_date*", (req) => {
      const { page, query, hitsPerPage } = req.query;
      req.reply({
        statusCode: 200,
        body: {
          page,
          hitsPerPage,
          query,
          nbPages: Math.ceil(testItemsArrLength / hitsPerPage),
          hits: testItems[query].slice(
            page * hitsPerPage,
            Math.min(testItemsArrLength, (+page + 1) * hitsPerPage)
          ),
        },
        delay: 20,
      });
    }).as("fakeApiRequest");
    cy.setLocalStorage("newsSelection", JSON.stringify({ id: 0 }));
    cy.setLocalStorage("all_page", 1);
    cy.visit("/");
    cy.waitForReact();
    cy.wait("@fakeApiRequest", { timeout: 7000 });
  });

  it("selects news subject", () => {
    cy.findByText("Select your news").click();
    cy.findByText("React").click();
    cy.wait("@fakeApiRequest", { timeout: 7000 }).then(() => {
      cy.findByText("reactjs_3").should("exist");
    });
  });
});
context("test requeriments", () => {
  beforeEach(() => {
    cy.intercept("https://hn.algolia.com/api/v1/search_by_date*", (req) => {
      const { page, query, hitsPerPage } = req.query;
      req.reply({
        statusCode: 200,
        body: {
          page,
          hitsPerPage,
          query,
          nbPages: Math.ceil(testItemsArrLength / hitsPerPage),
          hits: testItems[query].slice(
            page * hitsPerPage,
            Math.min(testItemsArrLength, (+page + 1) * hitsPerPage)
          ),
        },
        delay: 20,
      });
    }).as("fakeApiRequest");
    cy.setLocalStorage("all_page", 1);
    cy.setLocalStorage("newsSelection", JSON.stringify({ id: 0 }));
    cy.removeLocalStorage("favorites");
    cy.visit("/");
    cy.waitForReact();
  });
  //The selected filter should persist on the local storage
  it("selected filter persists in local storage", () => {
    cy.findByText("angular_3").should("exist");
    cy.findByText("reactjs_3").should("not.exist");
    cy.findByText("vuejs_3").should("not.exist");

    cy.findByText("Select your news").click();
    cy.findByText("React").click();

    cy.wait("@fakeApiRequest", { timeout: 7000 }).then(() => {
      cy.findByText("angular_3").should("not.exist");
      cy.findByText("reactjs_3").should("exist");
      cy.findByText("vuejs_3").should("not.exist");
      cy.reload().then(() => {
        cy.waitForReact();
        cy.findByText("angular_3").should("not.exist");
        cy.findByText("reactjs_3").should("exist");
        cy.findByText("vuejs_3").should("not.exist");
      });
    });
  });
  //The favorited posts should persist on the local storage
  it("has favorites persistent in local storage", () => {
    cy.findByText("angular_3")
      .parent()
      .parent()
      .findByTestId("item_component__faves")
      .click();
    cy.findByText("angular_5")
      .parent()
      .parent()
      .findByTestId("item_component__faves")
      .click();

    cy.findByText("angular_3")
      .parent()
      .parent()
      .findByTestId("item_component__faves")
      .invoke("prop", "src")
      .then((src) => {
        expect(src).to.contain("favorite-3");
      });
    cy.findByText("angular_5")
      .parent()
      .parent()
      .findByTestId("item_component__faves")
      .invoke("prop", "src")
      .then((src) => {
        expect(src).to.contain("favorite-3");
      });

    cy.reload().then(() => {
      cy.findByText("angular_3")
        .parent()
        .parent()
        .findByTestId("item_component__faves")
        .invoke("prop", "src")
        .then((src) => {
          expect(src).to.contain("favorite-3");
        });
      cy.findByText("angular_5")
        .parent()
        .parent()
        .findByTestId("item_component__faves")
        .invoke("prop", "src")
        .then((src) => {
          expect(src).to.contain("favorite-3");
        });

      cy.findByText("My faves").click();

      cy.findByText("angular_3").should("exist");
      cy.findByText("angular_5").should("exist");
    });
  });
});
