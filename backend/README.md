
# Backend - Velare SGC

Backend do projeto **Velare SGC**, um Sistema de Gestão Comercial desenvolvido em Java com Spring Boot.

Esta API foi desenvolvida para a **Entrega 2 - Backend e API**, com foco em:

- API REST funcional
- Integração com banco de dados MySQL
- CRUD de clientes
- CRUD de produtos
- Autenticação com JWT
- Proteção de rotas
- Senhas criptografadas com BCrypt
- Tratamento global de exceções
- Testes básicos com Maven, JUnit e Mockito

---

## Tecnologias utilizadas

- Java 21
- Spring Boot 3.3.5
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- MySQL
- Maven
- JUnit
- Mockito
- BCrypt

---

## Arquitetura do backend

O projeto segue uma arquitetura em camadas:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Banco de Dados
````

### Camadas principais

* `controller`: recebe as requisições HTTP da API REST.
* `service`: concentra as regras de negócio.
* `domain/model`: contém as entidades do sistema.
* `domain/repository`: contém os repositories do Spring Data JPA.
* `dto`: contém os objetos usados para entrada e saída de dados da API.
* `config`: contém configurações de segurança, JWT e dados iniciais.
* `exception`: contém exceções personalizadas e tratamento global de erros.

---

## Design Patterns utilizados

### Repository

Aplicado em:

* `ClienteRepository`
* `ProdutoRepository`
* `UsuarioRepository`

O padrão Repository separa a lógica de acesso ao banco de dados da regra de negócio.

### DTO

Aplicado em:

* `ClienteDTO`
* `ProdutoDTO`
* `AuthRequestDTO`
* `AuthResponseDTO`

O padrão DTO evita que as entidades JPA sejam expostas diretamente nas requisições e respostas da API.

---

## Pré-requisitos

Antes de rodar o projeto, é necessário ter instalado:

* Java 21
* Maven
* MySQL
* Postman ou Insomnia para testar os endpoints

Para verificar as versões:

```powershell
java -version
mvn -version
```

---

## Configuração do banco de dados

Crie um banco de dados MySQL com o nome:

```sql
CREATE DATABASE sgc_velare;
```

O projeto está configurado para usar o banco:

```text
sgc_velare
```

Configuração usada no `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/sgc_velare?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:root}
    driver-class-name: com.mysql.cj.jdbc.Driver
```

Por padrão, o usuário usado é `root`.

Caso seu MySQL tenha outra senha, configure a variável de ambiente antes de rodar o projeto.

No PowerShell:

```powershell
$env:DB_PASSWORD="sua_senha_do_mysql"
```

Se o usuário do MySQL não for `root`, configure também:

```powershell
$env:DB_USERNAME="seu_usuario"
```

---

## Configuração do JWT

O JWT está configurado no `application.yml`:

```yaml
jwt:
  secret: ${JWT_SECRET:minha-chave-secreta-super-segura-para-o-sgc-velare}
  expiration: 3600000
```

O tempo de expiração está em milissegundos.

```text
3600000 ms = 1 hora
```

Caso queira usar uma chave secreta própria:

```powershell
$env:JWT_SECRET="sua-chave-secreta"
```

---

## Como rodar os testes

Dentro da pasta `backend`, execute:

```powershell
mvn clean test
```

O resultado esperado é:

```text
BUILD SUCCESS
```

Também é possível rodar:

```powershell
mvn clean install
```

Esse comando executa os testes e gera o arquivo `.jar` do projeto.

---

## Como executar a aplicação

Dentro da pasta `backend`, execute:

```powershell
mvn spring-boot:run
```

Se tudo estiver correto, o terminal deve mostrar algo parecido com:

```text
Tomcat started on port 8080
Started SgcApplication
```

A API ficará disponível em:

```text
http://localhost:8080
```

---

## Usuário inicial

O projeto usa uma classe `DataLoader` para criar automaticamente um usuário administrador inicial.

Essa abordagem foi usada no lugar de um `data.sql`, porque a senha precisa ser criptografada com BCrypt antes de ser salva no banco de dados.

Credenciais iniciais:

```text
Email: admin@email.com
Senha: 123456
Perfil: ADMIN
```

Ao iniciar a aplicação, o `DataLoader` verifica se já existe um usuário com esse email.

Se não existir, ele cria o usuário administrador com a senha criptografada.

---

## Autenticação

Para acessar as rotas protegidas, primeiro é necessário fazer login.

### Login

```http
POST http://localhost:8080/auth/login
```

Body JSON:

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

Copie o valor do token.

Nas próximas requisições, use o token no header:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

No Postman, vá em:

```text
Authorization > Type > Bearer Token
```

E cole o token no campo indicado.

---

## Endpoints de autenticação

| Método | Endpoint      | Descrição                   | Proteção |
| ------ | ------------- | --------------------------- | -------- |
| POST   | `/auth/login` | Realiza login e retorna JWT | Público  |

---

## Endpoints de clientes

| Método | Endpoint         | Descrição                  | Proteção     |
| ------ | ---------------- | -------------------------- | ------------ |
| GET    | `/clientes`      | Lista todos os clientes    | Requer token |
| GET    | `/clientes/{id}` | Busca cliente por ID       | Requer token |
| POST   | `/clientes`      | Cria novo cliente          | Requer token |
| PUT    | `/clientes/{id}` | Atualiza cliente existente | Requer token |
| DELETE | `/clientes/{id}` | Remove cliente             | Requer token |

### Exemplo para criar cliente

```http
POST http://localhost:8080/clientes
```

Body JSON:

```json
{
  "nome": "João Silva",
  "cpf": "12345678900",
  "telefone": "61999999999",
  "email": "joao@email.com",
  "endereco": "Brasília - DF"
}
```

Resposta esperada:

```json
{
  "id": 1,
  "nome": "João Silva",
  "cpf": "12345678900",
  "telefone": "61999999999",
  "email": "joao@email.com",
  "endereco": "Brasília - DF"
}
```

### Regras de cliente

* Nome é obrigatório.
* CPF é obrigatório.
* CPF não pode ser duplicado.
* Email é obrigatório.
* Email deve ser válido.

---

## Endpoints de produtos

| Método | Endpoint         | Descrição                  | Proteção     |
| ------ | ---------------- | -------------------------- | ------------ |
| GET    | `/produtos`      | Lista todos os produtos    | Requer token |
| GET    | `/produtos/{id}` | Busca produto por ID       | Requer token |
| POST   | `/produtos`      | Cria novo produto          | Requer token |
| PUT    | `/produtos/{id}` | Atualiza produto existente | Requer token |
| DELETE | `/produtos/{id}` | Remove produto             | Requer token |

### Exemplo para criar produto

```http
POST http://localhost:8080/produtos
```

Body JSON:

```json
{
  "nome": "Anel de Ouro 18k",
  "descricao": "Anel em ouro 18k com acabamento polido",
  "preco": 1299.90,
  "quantidadeEstoque": 5,
  "estoqueMinimo": 1
}
```

Resposta esperada:

```json
{
  "id": 1,
  "nome": "Anel de Ouro 18k",
  "descricao": "Anel em ouro 18k com acabamento polido",
  "preco": 1299.90,
  "quantidadeEstoque": 5,
  "estoqueMinimo": 1
}
```

### Regras de produto

* Nome é obrigatório.
* Preço é obrigatório.
* Preço não pode ser negativo.
* Quantidade em estoque é obrigatória.
* Quantidade em estoque não pode ser negativa.
* Estoque mínimo é obrigatório.
* Estoque mínimo não pode ser negativo.

---

## Testes no Postman

### 1. Fazer login

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

Copie o token retornado.

---

### 2. Testar rota protegida sem token

```http
GET http://localhost:8080/clientes
```

Resultado esperado:

```text
401 Unauthorized
```

ou:

```text
403 Forbidden
```

Isso mostra que a rota está protegida.

---

### 3. Testar rota protegida com token

```http
GET http://localhost:8080/clientes
```

Authorization:

```text
Bearer Token
```

Resultado esperado:

```json
[]
```

ou uma lista de clientes cadastrados.

---

### 4. Criar cliente

```http
POST http://localhost:8080/clientes
```

Body:

```json
{
  "nome": "João Silva",
  "cpf": "12345678900",
  "telefone": "61999999999",
  "email": "joao@email.com",
  "endereco": "Brasília - DF"
}
```

---

### 5. Listar clientes

```http
GET http://localhost:8080/clientes
```

---

### 6. Buscar cliente por ID

```http
GET http://localhost:8080/clientes/1
```

---

### 7. Atualizar cliente

```http
PUT http://localhost:8080/clientes/1
```

Body:

```json
{
  "nome": "João Silva Atualizado",
  "cpf": "12345678900",
  "telefone": "61888888888",
  "email": "joao.atualizado@email.com",
  "endereco": "Taguatinga - DF"
}
```

---

### 8. Criar produto

```http
POST http://localhost:8080/produtos
```

Body:

```json
{
  "nome": "Anel de Ouro 18k",
  "descricao": "Anel em ouro 18k com acabamento polido",
  "preco": 1299.90,
  "quantidadeEstoque": 5,
  "estoqueMinimo": 1
}
```

---

### 9. Listar produtos

```http
GET http://localhost:8080/produtos
```

---

## Testes de validação

### CPF duplicado

Tente criar outro cliente com o mesmo CPF:

```http
POST http://localhost:8080/clientes
```

Body:

```json
{
  "nome": "Maria Souza",
  "cpf": "12345678900",
  "telefone": "61977777777",
  "email": "maria@email.com",
  "endereco": "Brasília - DF"
}
```

Resultado esperado:

```http
400 Bad Request
```

Exemplo de resposta:

```json
{
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "CPF já cadastrado",
  "caminho": "/clientes"
}
```

---

### Produto com preço negativo

```http
POST http://localhost:8080/produtos
```

Body:

```json
{
  "nome": "Produto Inválido",
  "descricao": "Teste de preço negativo",
  "preco": -10.00,
  "quantidadeEstoque": 5,
  "estoqueMinimo": 1
}
```

Resultado esperado:

```http
400 Bad Request
```

---

### Produto sem estoque mínimo

```http
POST http://localhost:8080/produtos
```

Body:

```json
{
  "nome": "Produto sem estoque mínimo",
  "descricao": "Teste",
  "preco": 100.00,
  "quantidadeEstoque": 5
}
```

Resultado esperado:

```http
400 Bad Request
```

---

## Formato padrão de erro

A API utiliza tratamento global de exceções.

Exemplo de resposta de erro:

```json
{
  "timestamp": "2026-05-14T11:25:57",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "Preço não pode ser negativo",
  "caminho": "/produtos"
}
```

---

## Testes automatizados

O projeto possui testes básicos para a camada de serviço.

Principais arquivos de teste:

* `AuthServiceTest`
* `ClienteServiceTest`
* `ProdutoServiceTest`

Os testes verificam:

* login válido;
* login inválido;
* criação de cliente;
* CPF duplicado;
* criação de produto;
* preço negativo;
* estoque negativo;
* estoque mínimo obrigatório.

Para executar:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

---

## Possíveis problemas e soluções

### Erro de conexão com MySQL

Erro comum:

```text
Access denied for user 'root'@'localhost'
```

Solução:

Verifique se a senha do MySQL está correta e configure:

```powershell
$env:DB_PASSWORD="sua_senha_do_mysql"
```

Depois rode novamente:

```powershell
mvn spring-boot:run
```

---

### Erro 403 Forbidden no Postman

Provavelmente o token JWT não foi enviado.

Solução:

1. Faça login em `/auth/login`.
2. Copie o token.
3. Vá na aba `Authorization`.
4. Escolha `Bearer Token`.
5. Cole o token.
6. Envie a requisição novamente.

---

### Banco não existe

Erro comum quando o banco `sgc_velare` não foi criado.

Solução:

```sql
CREATE DATABASE sgc_velare;
```

---

## Observação sobre o DataLoader

O projeto usa `DataLoader` para criar o usuário administrador inicial.

Essa solução substitui o uso de `data.sql`.

Justificativa:

* `data.sql` salvaria dados diretamente no banco.
* Como a senha precisa estar criptografada, o `DataLoader` permite usar o `PasswordEncoder`.
* Assim, a senha `123456` é transformada em hash BCrypt antes de ser salva.

---

## Status da Entrega 2

Itens implementados:

* API REST funcional
* Banco MySQL integrado
* CRUD de clientes
* CRUD de produtos
* Autenticação com JWT
* Rotas protegidas
* Senha criptografada com BCrypt
* Perfis de usuário `ADMIN` e `FUNCIONARIO`
* Uso de Repository Pattern
* Uso de DTO
* Tratamento global de exceções
* Testes básicos com Maven
* DataLoader para usuário inicial

---

## Comandos principais

```powershell
cd backend
$env:DB_PASSWORD="sua_senha_do_mysql"
mvn clean test
mvn spring-boot:run
```

API:

```text
http://localhost:8080
```

Login:

```text
POST http://localhost:8080/auth/login
```

```
```
