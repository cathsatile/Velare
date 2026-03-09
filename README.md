# 💎 SGC Velare — Sistema de Gestão Comercial para Joalheria

## 📌 Sobre o Projeto

O **SGC Velare** é um Sistema de Gestão Comercial desenvolvido para auxiliar na administração de uma loja de joias. O sistema tem como objetivo organizar e automatizar processos essenciais do negócio, como controle de estoque, cadastro de clientes e registro de vendas.

A aplicação foi projetada como um sistema web, permitindo que funcionários da loja acessem o sistema diretamente pelo navegador.

Este projeto foi desenvolvido como parte da disciplina de **Desenvolvimento de Sistemas**, aplicando conceitos de engenharia de software, arquitetura em camadas e padrões de projeto.

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
* Produtos mais vendidos
* Controle de estoque

---

## 🏗 Arquitetura do Sistema

O sistema foi desenvolvido utilizando **arquitetura em camadas**, separando responsabilidades para facilitar manutenção e escalabilidade.

### Camada de Apresentação (Frontend)

Responsável pela interface com o usuário.

Tecnologias utilizadas:

* Angular
* HTML
* CSS
* TypeScript

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

* PostgreSQL

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

### Singleton

Utilizado para garantir uma única instância de componentes compartilhados dentro da aplicação.

---

## 🗄 Modelo de Dados

Principais entidades do sistema:

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

backend/
    src/
        controller/
        service/
        repository/
        model/
        dto/

frontend/
    src/
        app/
            pages/
            components/
            services/

docs/
    diagramas/
    documentacao/

README.md
```

---

## 🚀 Tecnologias Utilizadas

### Frontend

* Angular
* TypeScript
* HTML
* CSS

### Backend

* Java
* Spring Boot
* Spring Data JPA

### Banco de Dados

* PostgreSQL

### Ferramentas

* GitHub
* Git
* VS Code
* IntelliJ IDEA

---

## 👩‍💻 Autora

Projeto desenvolvido por **Catharina Satile**.

Disciplina: Desenvolvimento de Sistemas

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
