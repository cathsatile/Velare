💎 SGC Velare — Sistema de Gestão Comercial para Joalheria

---

## 📌 Sobre o Projeto

O **SGC Velare** é um sistema de gestão comercial desenvolvido para auxiliar na administração de uma joalheria, permitindo o controle eficiente de clientes, produtos e vendas.

O sistema tem como objetivo automatizar processos essenciais do negócio, reduzir erros operacionais e fornecer informações estratégicas para tomada de decisão.

A aplicação segue uma arquitetura em camadas, sendo composta por um backend em API REST e uma interface desktop desenvolvida em Java Swing.

Este projeto foi desenvolvido como parte da disciplina de Desenvolvimento de Sistemas, aplicando conceitos de engenharia de software, boas práticas arquiteturais e padrões de projeto.

---

## 🎯 Objetivos do Sistema

O sistema busca resolver problemas comuns enfrentados por pequenos comércios, como:

* dificuldade no controle de estoque
* registro manual de vendas
* desorganização no cadastro de clientes
* ausência de relatórios gerenciais

Com o SGC Velare, essas operações passam a ser realizadas de forma digital, segura e organizada.

---

## ⚙️ Funcionalidades

### 📦 Gestão de Produtos

* Cadastro de produtos
* Atualização de dados
* Controle de estoque
* Consulta de produtos

### 👤 Gestão de Clientes

* Cadastro de clientes
* Consulta e listagem
* Atualização de dados
* Visualização de histórico de compras (para clientes autenticados)

### 💰 Registro de Vendas

* Registro de vendas
* Associação de múltiplos itens
* Cálculo automático do valor total
* Atualização automática do estoque
* Histórico de vendas

### 📊 Relatórios

* Vendas por período
* Vendas por cliente
* Produtos mais vendidos
* Controle de estoque

---

## 🔐 Autenticação e Autorização

O sistema utiliza autenticação baseada em **JWT (JSON Web Token)**.

### 🔄 Fluxo de autenticação

1. O usuário realiza login na aplicação
2. As credenciais são enviadas para `POST /auth/login`
3. O backend valida os dados
4. Um token JWT é gerado
5. O token é utilizado nas requisições seguintes

---

### 👥 Perfis de acesso

* **FUNCIONARIO**

  * Cadastro e gestão de clientes
  * Cadastro e gestão de produtos
  * Registro de vendas
  * Acesso a relatórios

* **CLIENTE**

  * Visualização dos próprios dados
  * Consulta do histórico de compras

---

### 🔒 Regras de segurança

* Senhas armazenadas com criptografia (BCrypt)
* Token com tempo de expiração
* Rotas protegidas por autenticação
* Controle de acesso baseado em perfil

---

## 🏗 Arquitetura do Sistema

O sistema utiliza **Arquitetura em Camadas**, promovendo separação de responsabilidades e facilidade de manutenção.

### Camadas:

#### 🎨 Apresentação (Desktop)

* Interface com o usuário
* Tecnologia: Java Swing

#### 🌐 Controller

* Exposição de endpoints REST
* Controle de requisições

#### ⚙️ Service (Aplicação)

* Regras de negócio
* Processamento de vendas
* Validações

#### 🧠 Domínio

* Entidades e regras centrais
* Independente de infraestrutura

#### 💾 Persistência

* Acesso ao banco de dados
* JPA/Hibernate

#### 🗄 Banco de Dados

* MySQL

---

## 🧩 Padrões de Projeto Utilizados

### Repository

* Abstração da camada de dados
* Redução de acoplamento

### DTO (Data Transfer Object)

* Transferência segura de dados
* Evita exposição direta das entidades

### Singleton (Spring)

* Gerenciamento de instâncias únicas

### Arquitetura em Camadas

* Separação clara de responsabilidades

---

## 🗄 Modelo de Dados

### Usuario

* id
* username
* senha
* perfil (CLIENTE, FUNCIONARIO)

### Cliente

* id
* nome
* cpf
* email
* telefone
* endereco
* usuario_id (opcional)

### Produto

* id
* nome
* descricao
* preco
* quantidade_estoque

### Venda

* id
* data
* valor_total
* cliente_id
* usuario_id

### ItemVenda

* id
* venda_id
* produto_id
* quantidade
* preco_unitario
* subtotal

---

## 🔗 Relacionamentos

* Cliente 1 — 0..1 Usuario
* Cliente 1 — N Venda
* Usuario 1 — N Venda
* Venda 1 — N ItemVenda
* Produto 1 — N ItemVenda

---

## 📂 Estrutura do Projeto

```
backend/
 ├── controller/
 ├── service/
 ├── domain/
 ├── repository/
 ├── dto/
 ├── config/
 └── exception/

frontend/
 └── swing/

database/
 └── script.sql

docs/
 └── diagramas/
```

---

## 🚀 Tecnologias Utilizadas

### Backend

* Java 21+
* Spring Boot
* Spring Data JPA
* Hibernate
* Spring Security
* JWT

### Frontend

* Java Swing

### Banco de Dados

* MySQL

### Ferramentas

* Git
* GitHub
* IntelliJ IDEA / VS Code

---

## ▶️ Como Executar

1. Clonar o repositório
2. Configurar o banco MySQL
3. Executar o script SQL
4. Iniciar o backend (Spring Boot)
5. Executar a aplicação Swing

---

## 🌐 API REST

### 🔐 Autenticação

* POST `/auth/login`

### 👤 Clientes

* GET `/clientes`
* GET `/clientes/{id}`
* POST `/clientes`
* PUT `/clientes/{id}`
* DELETE `/clientes/{id}`

### 📦 Produtos

* GET `/produtos`
* GET `/produtos/{id}`
* POST `/produtos`
* PUT `/produtos/{id}`
* DELETE `/produtos/{id}`

### 💰 Vendas

* GET `/vendas`
* GET `/vendas/{id}`
* POST `/vendas`

### 📊 Relatórios

* GET `/relatorios/vendas-por-periodo`
* GET `/relatorios/vendas-por-cliente`
* GET `/relatorios/produtos-mais-vendidos`
* GET `/relatorios/estoque`

---

## 👩‍💻 Autora

Projeto desenvolvido por **Catharina Satile**

Disciplina: Desenvolvimento de Sistemas

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
