/// <reference types="cypress" />
/* eslint-disable cypress/no-unnecessary-waiting */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// !NOTE - If any tests are failing here make sure you've assigned your env variables for Openweather API key and rate limit debugging.

describe('Basic API testing', () => {
    it('fetches weather with city and country code - POST', () => {
        cy.request('POST', 'api/weather', { city: 'Melbourne', country_code: 'AU' }).as('weatherRequest');
        cy.get('@weatherRequest').then((request: any) => {
            expect(request.status).to.equal(200)
            expect(request.body).to.haveOwnProperty('data');
            expect(request.body.data).to.haveOwnProperty('description');
            expect(request.body.data.description).to.have.length.greaterThan(0)
        });
    });

    it('fetches weather with lat and long - POST', () => {
        cy.request('POST', 'api/weather', {lat:-37.67978041548561,lon:144.9956846719966}).as('weatherRequest');
        cy.get('@weatherRequest').then((request: any) => {
            expect(request.status).to.equal(200)
            expect(request.body).to.haveOwnProperty('data');
            expect(request.body.data).to.haveOwnProperty('description');
            expect(request.body.data.description).to.have.length.greaterThan(0)
        });
    });

    it('it should fail if longitude is not available - POST', () => {
        cy.request({
            method: 'POST',
            url: 'api/weather',
            failOnStatusCode: false,
            body: {lat:-37.67978041548561}
        }).as('weatherRequest');
        cy.get('@weatherRequest').then((request: any) => {
            expect(request.status).to.be.equal(400)
            expect(request.body).to.have.all.keys('message','status')
        })
    });

    it('it should fail if country code is not available - POST', () => {
        cy.request({
            method: 'POST',
            url: 'api/weather',
            failOnStatusCode: false,
            body: {city:'Melbourne'}
        }).as('weatherRequest');
        cy.get('@weatherRequest').then((request: any) => {
            expect(request.status).to.be.equal(400)
            expect(request.body).to.have.all.keys('message','status')
        })
    });

    it('it should fail if all of them is available - POST', () => {
        cy.request({
            method: 'POST',
            url: 'api/weather',
            failOnStatusCode: false,
            body: {city:'Melbourne', country_code: "AU", lat:-37.67978041548561,lon:144.9956846719966}
        }).as('weatherRequest');
        cy.get('@weatherRequest').then((request: any) => {
            expect(request.status).to.be.equal(400)
            expect(request.body).to.have.all.keys('message','status')
        })
    });

    it('it should fail if no data is available - POST', () => {
        cy.request({
            method: 'POST',
            url: 'api/weather',
            failOnStatusCode: false,
            body: {}
        }).as('weatherRequest');
        cy.get('@weatherRequest').then((request: any) => {
            expect(request.status).to.be.equal(400)
            expect(request.body).to.have.all.keys('message','status')
        })
    });


});

export { }