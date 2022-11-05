/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

describe('Basic application test', () => {
    it('Assert if all elements are available on the page', () => {

        // Start from the index page
        cy.visit('http://localhost:3000/')

        // Find form related elements
        cy.get('input').should('have.length', 3);
        cy.get('button').contains('Check weather');

        // Assert some textual content
        cy.get('h1').contains("What's the weather like today?");
        cy.get('p').contains("Get started by telling us city and country.");

    })
    it('Make a request successfully and assert the expected weather', () => {

        // We are gonna intercept so that we could pass our test in all weathers ;)
        cy.intercept('POST', '/api/weather', { fixture: 'weather-200.json', statusCode: 200 })

        // Find and fill form elements
        cy.get('input[name="city"]').type("Melbourne")
        cy.get('input[name="country_code"]').type("AU", { force: true })
        cy.get('input[name="country_name"]').type("Australia", { force: true })

        // Assuming there would be a dropdown, let's click the first option which would be Australia
        cy.get('[role="option"]').first().click();

        // Submit the request
        cy.get('button').click();

        // Assert our weather conditions are coming through
        cy.get('h1').contains("beautiful sky");
        cy.get('p').contains("Melbourne, AU");

    })
    it('Make an incorrect request and assert the error', () => {

        // We are gonna intercept so that we could pass our test in all weathers ;)
        cy.intercept('POST', '/api/weather', { fixture: 'weather-400.json', statusCode: 400 })

        // Find and fill form elements
        cy.get('input[name="city"]').clear().type("Neom")
        cy.get('input[name="country_code"]').type("AR", { force: true })
        cy.get('input[name="country_name"]').clear({ force: true }).type("Afghanistan", { force: true })

        // Assuming there would be a dropdown, let's click the first option which would be Australia
        cy.get('[role="option"]').first().click();

        // Submit the request
        cy.get('button').click();

        // Assert our weather conditions are coming through
        cy.get('h1').contains("What's the weather like today?");
        cy.get('p').contains("Oops! city not found. Try again.");

    })
})

// Prevent TypeScript from reading file as legacy script
export { }