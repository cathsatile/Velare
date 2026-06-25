# 💎 SGC Velare — Sistema de Gestão Comercial para Joalheria

## 📌 Sobre o Projeto

O **SGC Velare** é um sistema de gestão comercial criado para atender às necessidades de uma joalheria, facilitando o controle de clientes, produtos, estoque e processos do dia a dia.

Nesta etapa do projeto (**Entrega 2 — Backend e API**), desenvolvemos a parte de backend da aplicação. Ela oferece uma API REST com autenticação JWT, integração com banco de dados MySQL, CRUD para clientes e produtos, tratamento de exceções e testes básicos.

O projeto usa arquitetura em camadas, separando responsabilidades entre controllers, serviços, repositórios, entidades, DTOs, configurações e tratamento de erros.

---

## 🎯 Objetivos do Sistema

O sistema foi pensado para resolver problemas comuns de pequenos negócios, como:

- dificuldade no controle de produtos e estoque;
- desorganização no cadastro de clientes;
- ausência de padronização no registro de informações;
- necessidade de autenticação segura;
- necessidade de uma API organizada para futura integração com interface gráfica.

---

## ✅ Como está o projeto hoje

### Entrega 2 — Backend e API

O que já está pronto nesta entrega:

- API REST funcional;
- integração com banco de dados MySQL;
- CRUD de clientes;
- CRUD de produtos;
- autenticação com JWT;
- proteção de rotas;
- senhas criptografadas com BCrypt;
- criação automática de usuário administrador via `DataLoader`;
- tratamento global de exceções;
- uso de DTOs;
- uso do padrão Repository;
- testes básicos com Maven, JUnit e Mockito.

## ⚙️ Funcionalidades Implementadas

### 👤 Gestão de Clientes

- Cadastro de clientes;
- Listagem de clientes;
- Busca de cliente por ID;
- Atualização de cliente;
- Remoção de cliente;
- Validação de CPF duplicado;
- Validação de email.

### 📦 Gestão de Produtos

- Cadastro de produtos;
- Listagem de produtos;
- Busca de produto por ID;
- Atualização de produto;
- Remoção de produto;
- Validação de preço negativo;
- Validação de estoque negativo;
- Controle de estoque mínimo.

### 🔐 Autenticação

- Login com email e senha;
- Geração de token JWT;
- Validação de token JWT;
- Proteção de rotas;
- Senha criptografada com BCrypt;
- Perfis de usuário `ADMIN` e `FUNCIONARIO`.

---

## 🏗 Arquitetura do Backend

O backend foi construído seguindo o modelo de **Arquitetura em Camadas**:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Banco de Dados
```

### Camadas principais

- `controller`: recebe as requisições HTTP da API REST.
- `service`: concentra as regras de negócio.
- `domain/model`: contém as entidades do sistema.
- `domain/repository`: contém os repositories do Spring Data JPA.
- `domain/enums`: contém enums do domínio, como os perfis de usuário.
- `dto`: contém os objetos utilizados para a entrada e a saída de dados da API.
- `config`: contém configurações de segurança, de JWT e dados iniciais.
- `exception`: contém exceções personalizadas e tratamento global de erros.

---

## 🧩 Padrões de Projeto Utilizados

### Repository

Aplicado em:

- `ClienteRepository`
- `ProdutoRepository`
- `UsuarioRepository`

O padrão Repository separa a lógica de acesso ao banco de dados da camada de serviço.

### DTO — Data Transfer Object

Aplicado em:

- `ClienteDTO`
- `ProdutoDTO`
- `AuthRequestDTO`
- `AuthResponseDTO`

O padrão DTO evita expor diretamente as entidades JPA nas requisições e respostas da API.

---

## 🗄 Modelo de Dados Atual

### Usuario

- `id`
- `nome`
- `email`
- `senha`
- `perfil`

### Cliente

- `id`
- `nome`
- `cpf`
- `email`
- `telefone`
- `endereco`

### Produto

- `id`
- `nome`
- `descricao`
- `preco`
- `quantidadeEstoque`
- `estoqueMinimo`

---

## 📂 Estrutura do Repositório

```text
Velare/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/br/com/sgc/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── domain/
│   │   │   │   ├── dto/
│   │   │   │   ├── exception/
│   │   │   │   ├── service/
│   │   │   │   └── SgcApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   ├── pom.xml
│   └── README.md
└── README.md
```

---

## 🚀 Tecnologias Utilizadas

### Backend

- Java 21
- Spring Boot 3.3.5
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- BCrypt
- Maven

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Zod
- Lucide React
- React Hot Toast

### Banco de Dados

- MySQL

### Testes

- JUnit
- Mockito
- Maven Surefire

### Ferramentas

- Git
- GitHub
- VS Code / IntelliJ IDEA
- Postman / Insomnia

---

## 🖥️ Frontend

O frontend do **SGC Velare** está na pasta:

```text
frontend/
```

Ele foi desenvolvido com React, TypeScript e Vite, consumindo a API REST do backend por meio do Axios.

### Funcionalidades do Frontend

- Tela de login integrada com autenticação JWT;
- rotas protegidas para área administrativa;
- dashboard do sistema;
- listagem, cadastro e edição de clientes;
- listagem, cadastro e edição de produtos;
- telas de vendas;
- relatório de vendas;
- área de loja pública com catálogo de produtos;
- página de detalhes do produto;
- carrinho de compras;
- checkout;
- tela de confirmação de compra;
- feedback visual com notificações.

### Estrutura principal do Frontend

```text
frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

### Rotas principais do Frontend

| Rota | Descrição | Proteção |
|---|---|---|
| `/login` | Tela de login | Pública |
| `/dashboard` | Painel principal | Requer login |
| `/clientes` | Gestão de clientes | Requer login |
| `/produtos` | Gestão de produtos | Requer login |
| `/vendas` | Listagem de vendas | Requer login |
| `/vendas/nova` | Cadastro de nova venda | Requer login |
| `/vendas/relatorio` | Relatório de vendas | Requer login |
| `/loja/catalogo` | Catálogo público da loja | Pública |
| `/loja/produto/:id` | Detalhes do produto | Pública |
| `/loja/carrinho` | Carrinho de compras | Pública |
| `/loja/checkout` | Finalização da compra | Pública |
| `/loja/sucesso` | Confirmação da compra | Pública |

### Configuração do Frontend

O frontend usa variáveis de ambiente para localizar a API:

```text
VITE_API_URL=http://localhost:8080
VITE_SERVICE_TOKEN=seu_token_jwt_de_funcionario_aqui
```

Essas variáveis estão exemplificadas em:

```text
frontend/.env.example
```

### Como Executar o Frontend

Dentro da pasta `frontend`, instale as dependências e inicie o servidor de desenvolvimento:

```powershell
cd frontend
npm install
npm run dev
```

O frontend ficará disponível no endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

Para gerar a versão de produção:

```powershell
npm run build
```

---

## ▶️ Como Executar o Backend

As instruções completas para executar e testar a API estão disponíveis no README específico do backend:

```text
backend/README.md
```

Resumo dos comandos principais:

```powershell
cd backend
$env:DB_PASSWORD="sua_senha_do_mysql"
mvn clean test
mvn spring-boot:run
```

A API ficará disponível em:

```text
http://localhost:8080
```

---

## 🗄 Configuração do Banco

O backend usa o banco MySQL:

```sql
CREATE DATABASE sgc_velare;
```

A configuração fica em:

```text
backend/src/main/resources/application.yml
```

O projeto utiliza variáveis de ambiente para facilitar a execução em máquinas diferentes:

```powershell
$env:DB_PASSWORD="sua_senha_do_mysql"
```

Caso o usuário do MySQL não seja `root`:

```powershell
$env:DB_USERNAME="seu_usuario"
```

---

## 🔐 Usuário Inicial

O projeto utiliza uma classe `DataLoader` para criar automaticamente um usuário administrador inicial.

Credenciais:

```text
Email: admin@email.com
Senha: 123456
Perfil: ADMIN
```

A senha é criptografada com BCrypt antes de ser salva no banco de dados.

Essa abordagem foi escolhida em vez de `data.sql` porque permite usar o `PasswordEncoder` do Spring Security para salvar a senha de forma segura.

---

## 🌐 API REST

### Autenticação

| Método | Endpoint | Descrição | Proteção |
|---|---|---|---|
| POST | `/auth/login` | Realiza login e retorna JWT | Público |

### Clientes

| Método | Endpoint | Descrição | Proteção |
|---|---|---|---|
| GET | `/clientes` | Lista todos os clientes | Requer token |
| GET | `/clientes/{id}` | Busca cliente por ID | Requer token |
| POST | `/clientes` | Cria novo cliente | Requer token |
| PUT | `/clientes/{id}` | Atualiza cliente existente | Requer token |
| DELETE | `/clientes/{id}` | Remove cliente | Requer token |

### Produtos

| Método | Endpoint | Descrição | Proteção |
|---|---|---|---|
| GET | `/produtos` | Lista todos os produtos | Requer token |
| GET | `/produtos/{id}` | Busca produto por ID | Requer token |
| POST | `/produtos` | Cria novo produto | Requer token |
| PUT | `/produtos/{id}` | Atualiza produto existente | Requer token |
| DELETE | `/produtos/{id}` | Remove produto | Requer token |

---

## 🔑 Fluxo de Autenticação

1. O usuário envia email e senha para:

```http
POST http://localhost:8080/auth/login
```

2. O backend valida as credenciais.

3. Se estiver correto, a API retorna um token JWT.

4. O token deve ser enviado nas próximas requisições protegidas:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 🧪 Testes Automatizados

O backend possui testes básicos para a camada de serviço.

Arquivos principais:

- `AuthServiceTest`
- `ClienteServiceTest`
- `ProdutoServiceTest`

Para executar:

```powershell
cd backend
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

---

## 🧪 Testes no Postman

Ordem recomendada para testar:

1. `POST /auth/login`
2. `GET /clientes` sem token
3. `GET /clientes` com token
4. `POST /clientes`
5. `GET /clientes`
6. `GET /clientes/{id}`
7. `PUT /clientes/{id}`
8. `POST /produtos`
9. `GET /produtos`
10. Testar CPF duplicado
11. Testar produto com preço negativo
12. Testar produto sem estoque mínimo

### Exemplo de login

```http
POST http://localhost:8080/auth/login
```

Body:

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

Resposta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## 👥 Autoria

Quem fez o projeto:

- Catharina Satile
- Lucas Diógenes Landim Vasques
- Felipe Tolentino Soares
- Pedro César Delgado Gomes

Disciplina: Desenvolvimento de Sistemas

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
