/*
Enviar nome do produto através da url usando método get para página de orçamento
url inicial: https://domain.com/produto/nome-produto
url orçamento: https://domain.com/solicite-um-orcamento
url final: https://domain.com/solicite-um-orcamento?product_title=${productTitle}
*/

const isProductPage = window.location.pathname.indexOf("produto") !== -1;

if(isProductPage){
	const productTitle = document.querySelector("h2.product_title.entry-title.show-product-nav").textContent.trim();
	const formBudget = document.querySelector("#btn-solicite-orcamento a").href;
	document.querySelector("#btn-solicite-orcamento a").href =  formBudget+`?product_title=${productTitle}`;
}

const isBudgetPage = window.location.pathname.indexOf("solicite-um-orcamento") !== -1;

if(isBudgetPage){
	const urlParams = new URLSearchParams(window.location.search);
	const productTitle = urlParams.get('product_title');
	document.querySelector("#forminator-field-text-1").value = productTitle;
}