require("../_support/utils/ServicesUtil");
const { Timeouts } = require("../_support/constants");

describe("Services", function() {
  /**
   * Test the external volumes
   */
  describe("External Volumes", function() {
    beforeEach(function() {
      cy.visitUrl(`services/overview/%2F${Cypress.env("TEST_UUID")}/create`);
    });

    afterEach(() => {
      cy.window().then(win => {
        win.location.href = "about:blank";
      });
    });

    it("should be persistent after suspension and resume", function() {
      const serviceName = "external-volumes-single";
      const message = `TEST_OUTPUT_${Cypress.env("TEST_UUID")}`;

      cy.contains("JSON Configuration").click();

      cy.get("#brace-editor").setJSON(
        `{
          "id": "/${Cypress.env("TEST_UUID")}/${serviceName}",
          "instances": 1,
          "container": {
            "type": "MESOS",
            "volumes": [
              {
                "containerPath": "data",
                "external": {
                  "name": "integration-test-dcos-ui-${Cypress.env("TEST_UUID")}-exvolsingle",
                  "provider": "dvdi",
                  "options": {
                    "dvdi/driver": "rexray"
                  },
                  "size": 1
                },
                "mode": "RW"
              }
            ]
          },
          "cpus": 0.1,
          "cmd": "echo TEST_OUTPUT_${Cypress.env("TEST_UUID")} >> \$MESOS_SANDBOX/data/foo; cat \$MESOS_SANDBOX/data/foo; while true; do sleep 10; done;",
          "mem": 16
        }`
      );

      cy.contains("Review & Run").click();
      cy.contains("button", "Run Service").click();

      cy
        .get(".page-body-content table")
        .contains(serviceName, { timeout: Timeouts.SERVICE_DEPLOYMENT_TIMEOUT })
        .should("exist");

      cy
        .get(".page-body-content table")
        .getTableRowThatContains(serviceName)
        .should("exist");

      cy.visitUrl(
        `services/detail/%2F${Cypress.env("TEST_UUID")}%2F${serviceName}`
      );

      // Link is partly covered by another one, so we have to force it.
      cy
        .contains(`${Cypress.env("TEST_UUID")}_${serviceName}`)
        .click({ force: true });

      cy.get(".menu-tabbed-item").contains("Logs").click();
      cy.contains("button", "Output (stdout)").click();

      cy.contains(message).should("exist");

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

      // Link is partly covered by another one, so we have to force it.
      cy
        .contains(`${Cypress.env("TEST_UUID")}_${serviceName}`)
        .click({ force: true });

      cy.get(".menu-tabbed-item").contains("Logs").click();
      cy.contains("button", "Output (stdout)").click();

      cy.contains(message + "\n" + message).should("exist");
    });
  });
});
