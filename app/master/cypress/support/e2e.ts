declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<any>,
    pushSecret(): Chainable<any>,
  }
}
Cypress.Commands.add('login', () => {
  cy.intercept('POST', 'http://dev-api-shop.torder.com/api/master/users/login').as('loginApiRequest');

  cy.visit('/');
  cy.url().should('include', 'login');
  cy.get('[data-v-inspector="src/pages/Common/UI/InfoHeader.vue:3:5"]').should('exist').contains('로그인을 해주세요.');
  cy.get('.text-gray-400').should('exist').contains('development');
  cy.get('[type="text"]').type('testtpay3');
  cy.get('[aria-label="password"]').type('1234');
  cy.get('.h-full > .btn').click();

  cy.wait('@loginApiRequest').then((interception) => {
    const { request } = interception;
    const { response } = interception;

    // 요청 및 응답에 대한 검증 수행
    expect(request.method).to.equal('POST');
    expect(request.url).to.equal('http://dev-api-shop.torder.com/api/master/users/login');
    if (response) {
      expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.property('code');
      expect(response.body).to.have.property('result');
      expect(response.body).to.have.property('data');
      expect(response.body.code).to.be.an('number');
      expect(response.body.result).to.be.an('boolean');
      expect(response.body.data).to.be.an('Object');
    }
  });
  cy.url().should('include', 'store');
  cy.get(':nth-child(2) > [data-v-inspector="src/pages/Store/Components/StoreDataTable.vue:26:11"] > .btn').should('exist').click();
  cy.url().should('include', 'orderlist');
  cy.wait(6000);
  cy.get('.countdown').should('exist');
  cy.get('.countdown');
});

Cypress.Commands.add('pushSecret', () => {
  cy.get('.countdown').should('exist').as('secret');
  for (let n = 0; n < 4; n += 1) {
    cy.get('@secret').click();
  }
});
