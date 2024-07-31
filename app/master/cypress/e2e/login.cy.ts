describe('E2E : 로그인', () => {
  it('UI 체크', () => {
    cy.visit('/');
    cy.url().should('include', 'login');
    cy.get('[data-v-inspector="src/pages/Common/Layouts/Components/SideBar/Logo.vue:2:3"]').should('exist');
    cy.get('[data-v-inspector="src/pages/Common/UI/InfoHeader.vue:3:5"]').should('exist').contains('로그인을 해주세요.');
    cy.get('.text-gray-400').should('exist').contains('development');
    cy.get('[type="text"]').should('exist');
    cy.get('[aria-label="password"]').should('exist');
    cy.get('.h-full > .btn').should('exist');
  });

  it('로그인 및 매장선택 체크', () => {
    cy.login();
  });
});
