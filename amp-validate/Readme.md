# Validação AMP

Esse script surgiu com a necessidade de validar a versão amp dos projetos que desenvolvia em React/Next.

Após fazer o build do projeto é possível fazer a validação dos arquivos tendo como objetivo a leitura dos dados na pasta 
`./dist/server/pages`

## Como adicionar no seu projeto ?

Adicione o script na raiz do seu projeto

```bash
  git clone https://github.com/emerson-oliveira/snippets
```

Adicione o script na raiz do seu projeto
```bash
  mv snippets/amp-validate seu-projeto
  cd seu-projeto
```

Instale a dependencia amphtml-validator

```bash
  npm i amphtml-validator
```

Adicione o script no `package.json` 

```
{
  ...
  "scripts": {
    "validate:amp": "node ./ampvalidator.js"
  },
  ...
}

```

## Como rodar no projeto ?

Faça o build para criar os arquivos estaticos 

```bash
  npm run build
```

Rode o comando para gerar os logs de validação

```bash
  npm run validate:amp
```