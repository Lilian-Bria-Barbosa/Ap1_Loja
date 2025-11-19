🏬 Loja API + Frontend

Sistema completo de controle de estoque e vendas — Flask + SQLite + Next.js

📌 Sobre o Projeto

Este projeto consiste em uma aplicação completa com backend em Flask e frontend em Next.js, permitindo o gerenciamento de:

Produtos
Categorias
Entradas e saídas de estoque
Vendas (com baixa automática)
Clientes
Funcionários

A API utiliza SQLite como banco local e oferece documentação via Swagger.

🚀 Como Executar o Projeto

⚠️ Importante:
Para rodar corretamente, você precisa abrir dois terminais:

Terminal 1 → Backend (Flask)

Terminal 2 → Frontend (Next.js)

🖥️ 1️⃣ Terminal 1 — Executando a API (Flask)
1. Crie e ative o ambiente virtual (opcional)
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

2. Instale as dependências
pip install -r requirements.txt

3. Inicie o servidor Flask
python app.py

4. Endpoints disponíveis

API Root: http://127.0.0.1:5000/

Swagger UI: http://127.0.0.1:5000/docs

🌐 2️⃣ Terminal 2 — Executando o Frontend (Next.js)
1. Acesse a pasta do frontend
cd frontend

2. Instale as dependências
npm install

3. Inicie o servidor de desenvolvimento
npm run dev

4. Acesse no navegador
http://localhost:3000

🧰 Tecnologias Utilizadas
Backend
Python
Flask
Flask-SQLAlchemy
Flask-Marshmallow
Flasgger (Swagger)
SQLite

Frontend
Next.js
React
(Opcional) TailwindCSS

🔗 Endpoints Principais (prefixo /api)
Produtos

CRUD → /api/produtos
Movimentações
Entrada → POST /api/entrada
Saída → POST /api/saida

Vendas

Criar venda → POST /api/vendas
(gera saída automática do estoque)

Itens

GET /api/itens
GET /api/itens/<id>

Clientes
CRUD → /api/clientes

Funcionários
CRUD → /api/funcionarios

👥 Integrantes do Grupo

Cindy Joyce (SI)
Lilian Barbosa (ADS)
Lavinia Braga (SI)
