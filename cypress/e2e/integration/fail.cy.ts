describe("Visit landing page", () => {
  it("can visit the landing page", () => {
    cy.visit("/");

    cy.get("h1").should("contain", "FAIL");
  });
});

export {};
