async function loadPageUrl(pageURL, divId) {
  // Cria uma nova div dentro do container para exibir o GIF animado
  const container = document.getElementById(divId);
  const loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = `
    <p>Carregando página...</p>
    <img src="https://i.stack.imgur.com/kOnzy.gif" alt="Carregando...">
  `;
  container.appendChild(loadingDiv);

  // Tenta carregar a página usando o método fetch() e async/await
  try {
    const response = await fetch(pageURL);
    const html = await response.text();

    // Remove a div de carregamento e atualiza o conteúdo do container
    loadingDiv.remove();
    container.innerHTML = html;
  } catch (error) {
    // Exibe o erro na tela caso ocorra alguma exceção
    loadingDiv.innerText = `Erro ao carregar página: ${error}`;
  }
}
//https://meusite.com.br/path
loadPageUrl('/path', 'ElementoID');