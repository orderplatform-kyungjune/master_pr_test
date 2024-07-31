describe('E2E : 시크릿', () => {
  beforeEach(() => {
    cy.login();
    cy.pushSecret();
  });

  it('UI 체크', () => {
    cy.get('#app > .absolute').should('exist');
    cy.get('.secret-wrapper > .flex').should('exist');
    cy.get('#logoutBtn').should('exist');
    cy.get('#storeSelectBtn').should('exist');
    cy.get('#kitchenSelectBtn').should('exist');
  });

  it('시크릿 종료 테스트', () => {
    cy.get('#app > .absolute').should('exist').click();
    cy.get('#app > .absolute').should('not.exist');
  });

  it('로그아웃 테스트', () => {
    cy.get('#logoutBtn').should('exist').click();
    cy.url().should('include', 'login');
  });

  it('매장선택 테스트', () => {
    cy.get('#storeSelectBtn').should('exist').click();
    cy.url().should('include', 'store');
  });
});
