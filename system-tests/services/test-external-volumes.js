require("../_support/utils/ServicesUtil");

describe("Services", function() {
  /**
   * Test the external volumes
   */
  describe("External Volumes", function() {
    afterEach(() => {
      cy.window().then(win => {
        win.location.href = "about:blank";
      });
    });

    it("should be persistent after suspension in single container services", function() {
      const serviceName = "external-volumes-single";
      const message = `TEST_OUTPUT_${Cypress.env("TEST_UUID")}`;

      cy.visitUrl(
        `services/detail/%2F${Cypress.env("TEST_UUID")}%2F${serviceName}`
      );

      // link is partly covered by another one, so we have to force it.
      cy
        .contains(`${Cypress.env("TEST_UUID")}_${serviceName}`)
        .click({ force: true });

      cy.contains("Logs").click();

      cy.contains(message);

      cy.visitUrl(
        `services/detail/%2F${Cypress.env("TEST_UUID")}%2F${serviceName}`
      );

      cy
        .get(".page-header-actions .dropdown")
        .click()
        .get(".dropdown-menu-items")
        .contains("Suspend")
        .click();

      cy.root().contains("button", "Suspend Service").click();

      cy
        .get(".page-header-actions .dropdown")
        .click()
        .get(".dropdown-menu-items")
        .contains("Resume")
        .click();

      cy.contains("button", "Resume Service").click();

      // link is partly covered by another one, so we have to force it.
      cy
        .contains(`${Cypress.env("TEST_UUID")}_${serviceName}`)
        .click({ force: true });

      cy.contains("Logs").click();

      cy.contains(message + "\n" + message);
    });
  });
});
