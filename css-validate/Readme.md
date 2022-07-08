# Validação CSS

Esse script surgiu com a necessidade de validar o CSS dos projetos que desenvolvia em React/Next.

Após fazer o build do projeto é possível fazer a validação dos arquivos tendo como objetivo a leitura dos dados na pasta 
`./dist/server/pages`

## Como adicionar ao seu projeto ?

Clone o projeto

```bash
  git clone https://github.com/emerson-oliveira/snippets
```

Adicione o script na raiz do seu projeto
```bash
  mv snippets/css-validate seu-projeto
  cd seu-projeto
```

Inclua o script no `package.json` 

```
{
  ...
  "scripts": {
    "validate:css": "node ./cssvalidator.js"
  },
  ...
}

```

## Como rodar no projeto ?

Execute os comandos:

```bash
  npm run build
```
Para criar os arquivos estaticos 

```bash
  npm run validate:css
```
para gerar os logs de validação