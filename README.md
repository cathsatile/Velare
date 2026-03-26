# 💎 SGC Velare — Sistema de Gestão Comercial para Joalheria

## 📌 Sobre o Projeto

O **SGC Velare** é um sistema de gestão comercial desenvolvido para auxiliar na administração de uma loja de joias. O sistema tem como objetivo organizar e automatizar processos essenciais do negócio, como controle de estoque, cadastro de clientes e registro de vendas.

A aplicação foi desenvolvida como um sistema desktop com interface gráfica utilizando Java Swing, permitindo que funcionários utilizem o sistema de forma local e intuitiva.

Este projeto foi desenvolvido como parte da disciplina de Desenvolvimento de Sistemas, aplicando conceitos de engenharia de software, arquitetura em camadas e padrões de projeto.

---

## 🎯 Objetivos do Sistema

O sistema busca resolver problemas comuns enfrentados por pequenos comércios, como:

* dificuldade no controle de estoque
* registro manual de vendas
* falta de organização no cadastro de clientes
* ausência de relatórios de desempenho do negócio

Com o **SGC Velare**, essas operações passam a ser realizadas de forma digital e organizada.

---

## ⚙️ Funcionalidades

### 📦 Gestão de Produtos

* Cadastro de joias
* Atualização de produtos
* Controle de estoque
* Consulta de produtos disponíveis

### 👤 Gestão de Clientes

* Cadastro de clientes
* Consulta de clientes cadastrados
* Atualização de dados

### 💰 Registro de Vendas

* Registro de vendas
* Adição de múltiplos produtos em uma venda
* Atualização automática do estoque
* Histórico de vendas

### 📊 Relatórios

* Vendas por período
* Vendas por cliente
* Gráfico de vendas anuais
* Produtos mais vendidos
* Controle de estoque

## 🔐 Autenticação e Autorização

O sistema possui um mecanismo de autenticação baseado em **JWT (JSON Web Token)**, conforme os requisitos do projeto. O processo de autenticação funciona da seguinte forma:

1. O usuário realiza login na interface gráfica do sistema.
2. As credenciais são enviadas para o endpoint `POST /auth/login`.
3. O backend valida usuário e senha.
4. Em caso de sucesso, um token JWT é gerado e retornado para a aplicação.
5. A interface Swing utiliza esse token para acessar os demais recursos protegidos da API.
6. O acesso às funcionalidades é controlado de acordo com o perfil do usuário.

### Perfis de acesso
* **ADMIN**: possui acesso completo às funcionalidades do sistema.
* **FUNCIONARIO**: possui acesso às operações operacionais, como consultas e registro de vendas.

### Regras de segurança
* As senhas dos usuários são armazenadas de forma criptografada.
* O token JWT possui tempo de expiração.
* Endpoints protegidos exigem envio do token de autenticação.

---

## 🏗 Arquitetura do Sistema

O sistema foi desenvolvido utilizando **arquitetura em camadas**, separando responsabilidades para facilitar manutenção e escalabilidade.

### Camada de Apresentação (Interface Desktop)

Responsável pela interface com o usuário.

Tecnologias utilizadas:

* Swing

### Camada de Aplicação (Backend)

Responsável pelas regras de negócio e comunicação com o frontend.

Tecnologias utilizadas:

* Java
* Spring Boot

### Camada de Persistência

Responsável pelo acesso ao banco de dados.

Tecnologias utilizadas:

* Spring Data JPA
* Hibernate

### Banco de Dados

Sistema responsável pelo armazenamento das informações do sistema.

Tecnologia utilizada:

* MySQL

---

## 🧩 Padrões de Projeto Utilizados

O projeto utiliza alguns **Design Patterns** para melhor organização do código.

### Repository

Responsável pela abstração do acesso ao banco de dados.

Exemplos:

* ProdutoRepository
* ClienteRepository
* VendaRepository

### DTO (Data Transfer Object)

Utilizado para transferência de dados entre frontend e backend.

Exemplos:

* ProdutoDTO
* ClienteDTO
* VendaDTO

### Arquitetura em Camadas

Organiza o sistema em níveis bem definidos.

Benefícios:

* melhor manutenção  
* baixo acoplamento  
* maior clareza

### Singleton

Utilizado para garantir uma única instância de componentes compartilhados dentro da aplicação.

---

## 🗄 Modelo de Dados

Principais entidades do sistema:

### Usuario

* id
* username
* senha
* perfil

### Produto

* id
* nome
* categoria
* material
* preco
* quantidade
* descricao

### Cliente

* id
* nome
* cpf
* telefone
* email
* endereco

### Venda

* id
* data
* valor_total
* forma_pagamento
* cliente_id

### ItemVenda

* id
* venda_id
* produto_id
* quantidade
* preco_unitario

---

## 📂 Estrutura do Projeto

```
sgc-velare

src/
 ├── ui/           # Telas Swing
 ├── service/      # Regras de negócio
 ├── repository/   # Acesso ao banco
 ├── model/        # Entidades
 └── dto/          # DTOs

database/
 └── script.sql

docs/
 └── diagramas/

README.md
```

---

## 🚀 Tecnologias Utilizadas

### Backend / Aplicação
* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* Spring Security
* JWT

### Interface
* Java Swing

### Banco de Dados
* MySQL
* Ferramentas
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

O sistema disponibiliza uma API REST desenvolvida com Spring Boot para comunicação entre a interface desktop em Java Swing e a camada de negócio.

### Endpoints principais

#### Autenticação
* `POST /auth/login`

#### Clientes
* `GET /clientes`
* `GET /clientes/{id}`
* `POST /clientes`
* `PUT /clientes/{id}`
* `DELETE /clientes/{id}`

#### Produtos
* `GET /produtos`
* `GET /produtos/{id}`
* `POST /produtos`
* `PUT /produtos/{id}`
* `DELETE /produtos/{id}`

#### Vendas
* `GET /vendas`
* `GET /vendas/{id}`
* `POST /vendas`

#### Relatórios
* `GET /relatorios/vendas-por-periodo`
* `GET /relatorios/vendas-por-cliente`
* `GET /relatorios/produtos-mais-vendidos`
* `GET /relatorios/estoque`

---

## 👩‍💻 Autora

Projeto desenvolvido por **Catharina Satile**.

Disciplina: Desenvolvimento de Sistemas

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
