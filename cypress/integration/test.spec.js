import "cypress-react-selector";
describe("test", () => {
  before(() => {
    cy.visit("/");
  });
  it("runs",()=>{
    cy.getReact('div').should('exist');
  });
});
