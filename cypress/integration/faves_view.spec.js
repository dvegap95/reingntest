import "cypress-react-selector";
import "@testing-library/cypress/add-commands";

let testFaves = new Array(40).fill(0).map((e, i) => {
  return {
    author: `author${i}`,
    created_at: new Date(Date.now() - i * 3600000).toString(), //i hours ago
    objectID: "" + i,
    story_title: `title_${i}`,
    story_url: "http://custom.url/" + i,
  };
});
let testFavesObj = testFaves.reduce((prev, cur, idx) => {
  prev[idx] = cur;
  return prev;
}, {});

describe("FavesView functional tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForReact();
    cy.setLocalStorage("favorites", JSON.stringify(testFavesObj));
    cy.findByText("My faves").click();
    cy.findByTestId("select_component__container").should("not.exist");
  });
  it("navigates trough pages", () => {
    cy.findByTestId("page_component__next").click().click();
    cy.findByText("title_" + 8 * 2).should("exist");
  });
  it("toggles (deletes) favorite", () => {
    cy.findByText("title_" + 2)
      .parent()
      .parent()
      .react("*", { props: { "data-testid": "item_component__faves" } })
      .click();
    cy.findByText("title_" + 2).should("not.exist");
  });
  it("toggles (deletes) all favorite", () => {
    localStorage.setItem("faves_page", 5);
    cy.reload();
    cy.waitForReact();
    cy.findByText("My faves").click();
    for (let i = 39; i >= 0; i--) {
      cy.findByText("title_" + i)
        .parent()
        .parent()
        .react("*", { props: { "data-testid": "item_component__faves" } })
        .click();
      cy.findByText("title_" + i).should("not.exist");
    }
    cy.findByText("- No favorites -").should("exist");
  });
});
