# VarejoLocal — Sistema de Controle de Validade e Estoque

Sistema web desenvolvido para auxiliar pequenos comércios no controle de produtos, lotes, validade, estoque mínimo, movimentações e análise de prejuízos por descarte.

O projeto possui autenticação com JWT, cadastro de produtos, categorias, lotes, painel de indicadores, alertas de vencimento/estoque baixo e controle de movimentações como entrada, venda e descarte.

---

## 📌 Sobre o Projeto

O **VarejoLocal** foi desenvolvido com o objetivo de facilitar o controle de produtos perecíveis e reduzir perdas causadas por vencimento de mercadorias.

O sistema permite que o administrador cadastre produtos, acompanhe seus lotes, visualize alertas de validade, controle entradas e saídas de estoque e analise prejuízos gerados por descartes.

---

## 🚀 Funcionalidades

### Autenticação

* Login de administrador
* Autenticação via token JWT
* Rotas protegidas no backend
* Controle de acesso para ações administrativas

### Produtos

* Cadastro de produtos
* Edição de produtos
* Remoção de produtos
* Associação do produto a uma categoria
* Cadastro de SKU/código de barras
* Preço de custo
* Estoque mínimo
* Dias de alerta antes do vencimento

### Categorias

* Listagem de categorias cadastradas no backend
* Categorias utilizadas no cadastro de produtos
* Associação por `categoryId`

Categorias utilizadas no sistema:

* Hortifruti
* Carnes
* Grãos
* Laticínios
* Padaria
* Bebidas
* Congelados
* Mercearia
* Limpeza
* Higiene

### Lotes

* Criação automática de lote ao cadastrar produto
* Controle de quantidade por lote
* Controle de validade
* Número do lote
* Status do lote
* Limpeza de lotes órfãos

### Estoque

* Visualização dos produtos cadastrados
* Quantidade total
* Próximo vencimento
* Status do produto
* Ações de editar, movimentar estoque e remover produto

Status possíveis:

* Em dia
* Estoque baixo
* Sem estoque
* Vencendo
* Vencido

### Alertas

* Produtos vencidos
* Produtos próximos do vencimento
* Produtos com estoque baixo
* Produtos sem estoque
* Ações rápidas para editar, movimentar estoque e remover produto

### Movimentações

* Entrada/reposição de estoque
* Venda/saída de estoque
* Descarte
* Bloqueio para impedir venda ou descarte acima da quantidade disponível
* Histórico de movimentações
* Filtro por data, tipo e categoria

### Análise de Prejuízos

* Cálculo de prejuízo com base no descarte
* Fórmula utilizada:

```txt
prejuízo = quantidade descartada × preço de custo
```

* Exibição das categorias com maior prejuízo
* Opção de ver todas as categorias

### Painel

* Resumo geral do estoque
* Indicadores de produtos
* Indicadores de alertas
* Movimentações recentes
* Acesso rápido às principais telas

---

## 🛠️ Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* Vite
* Bootstrap
* CSS
* Lucide React
* Fetch API

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* JWT
* Bcrypt
* Dotenv
* CORS

### Banco de Dados

* MongoDB Atlas

### Ferramentas

* VS Code
* Postman
* Git
* GitHub

---

## 📁 Estrutura do Projeto

```txt
Sistema-Validade---Desenv-Web
├── backend
│   ├── config
│   ├── controllers
│   ├── dtos
│   ├── errors
│   ├── jobs
│   ├── mappers
│   ├── middlewares
│   ├── models
│   ├── repositories
│   ├── routes
│   ├── services
│   ├── utils
│   ├── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🔐 Variáveis de Ambiente

Para executar o backend, crie um arquivo `.env` dentro da pasta `backend`.

Caminho correto:

```txt
backend/.env
```

Exemplo:

```env
PORT=5000
MONGODB_URI=sua_uri_do_mongodb_atlas
JWT_SECRET=sua_chave_secreta_jwt
```

> Atenção: nunca envie o arquivo `.env` para o GitHub.

---

## ▶️ Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/varejo-local-sistema-validade.git
```

Entre na pasta do projeto:

```bash
cd varejo-local-sistema-validade
```

---

## Executando o Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` dentro da pasta `backend` com as variáveis necessárias:

```env
PORT=5000
MONGODB_URI=sua_uri_do_mongodb_atlas
JWT_SECRET=sua_chave_secreta_jwt
```

Execute o backend:

```bash
npm run dev
```

O backend deverá iniciar em:

```txt
http://localhost:5000
```

---

## Executando o Frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o frontend:

```bash
npm run dev
```

O frontend deverá iniciar em:

```txt
http://localhost:5173
```

---

## 🔑 Login de Teste

Usuário utilizado para testes:

```txt
E-mail: testeweb@gmail.com
Senha: 123456
```

> Esse usuário precisa existir no MongoDB Atlas utilizado pelo backend.

---

## 📡 Principais Rotas da API

### Autenticação

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Categorias

```txt
GET  /api/categories
POST /api/categories
```

### Produtos

```txt
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Lotes

```txt
GET    /api/lots
GET    /api/lots/:id
POST   /api/lots
PUT    /api/lots/:id
PATCH  /api/lots/:id/discard
DELETE /api/lots/orphans/remove
```

---

## 🧪 Testes pelo Postman

### Login

```txt
POST http://localhost:5000/api/auth/login
```

Body:

```json
{
  "email": "testeweb@gmail.com",
  "password": "123456"
}
```

A resposta retorna um token JWT.

Para acessar rotas protegidas, use o header:

```txt
Authorization: Bearer SEU_TOKEN
```

---

### Listar Categorias

```txt
GET http://localhost:5000/api/categories
```

Header:

```txt
Authorization: Bearer SEU_TOKEN
```

---

### Criar Produto

```txt
POST http://localhost:5000/api/products
```

Body:

```json
{
  "name": "Macarrão",
  "sku": "7891000300305",
  "categoryId": "ID_DA_CATEGORIA",
  "unitCost": 4.5,
  "minimumStock": 5,
  "alertDaysBeforeExpiry": 15
}
```

---

### Criar Lote

```txt
POST http://localhost:5000/api/lots
```

Body:

```json
{
  "productId": "ID_DO_PRODUTO",
  "lotNumber": "LOTE-001",
  "quantity": 10,
  "expirationDate": "2026-12-30"
}
```

---

## 📊 Regras de Negócio

### Estoque Baixo

Um produto é considerado com estoque baixo quando:

```txt
quantidade atual <= estoque mínimo
```

Exemplo:

```txt
Quantidade atual: 5
Estoque mínimo: 5
Status: Estoque Baixo
```

---

### Sem Estoque

Um produto é considerado sem estoque quando:

```txt
quantidade atual <= 0
```

---

### Vencido

Um produto é considerado vencido quando a data de validade do lote é anterior à data atual.

---

### Vencendo

Um produto é considerado próximo do vencimento quando sua validade está dentro do período definido para alerta.

---

### Prejuízo por Descarte

O prejuízo é calculado com base na quantidade descartada e no custo unitário do produto:

```txt
prejuízo = quantidade descartada × preço de custo
```

---

## 🗃️ Observação sobre Produtos e Lotes

O sistema separa **produto** e **lote**.

O produto armazena informações gerais:

```txt
nome
sku
categoria
preço de custo
estoque mínimo
dias de alerta
```

O lote armazena informações de estoque e validade:

```txt
produto relacionado
número do lote
quantidade
data de validade
status
```

Essa separação permite que um mesmo produto tenha vários lotes com datas de validade diferentes.

---

## 🧹 Limpeza de Lotes Órfãos

Durante testes, pode acontecer de existirem lotes sem produto relacionado. Para remover esses registros, existe a rota:

```txt
DELETE /api/lots/orphans/remove
```

Essa rota remove apenas lotes que apontam para produtos inexistentes.

---

## ✅ Status do Projeto

Funcionalidades principais concluídas:

* Login com JWT
* Integração frontend e backend
* Cadastro de produtos
* Cadastro automático de lotes
* Categorias vindas do backend
* Controle de estoque mínimo
* Alertas de validade e estoque
* Movimentações de entrada, venda e descarte
* Bloqueio de movimentação acima do estoque disponível
* Análise de prejuízo
* Painel de indicadores
* Limpeza de lotes órfãos

---

## 👨‍💻 Autor

Desenvolvido por **Leanderson Lima**.

Projeto acadêmico com foco em desenvolvimento web, controle de estoque e gerenciamento de validade de produtos.
