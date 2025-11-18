🏬 Loja API + Frontend (Flask + SQLite + Next.js)
📌 Propósito do Projeto

Este sistema tem como objetivo gerenciar estoque e vendas, incluindo:

Produtos

Categorias

Entradas e saídas

Vendas (com baixa automática no estoque)

Clientes

Funcionários

A API é construída em Flask + SQLite e o frontend em Next.js.

🚀 Como executar o projeto

Para rodar corretamente, abra dois terminais:

Terminal 1 → Backend Flask

Terminal 2 → Frontend Next.js (npm run dev)

Abaixo está o passo a passo completo.

🖥️ Terminal 1 — Rodando a API (Flask)

Crie e ative o ambiente virtual (opcional)

python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows


Instale as dependências

pip install -r requirements.txt


Inicie a API

python app.py


Acesse:

API root → http://127.0.0.1:5000

Swagger (documentação) → http://127.0.0.1:5000/docs

🌐 Terminal 2 — Rodando o Frontend (Next.js)

Acesse a pasta do frontend:

cd frontend


Instale as dependências:

npm install


Execute o servidor de desenvolvimento:

npm run dev


Acesse no navegador:

http://localhost:3000


⚠️ O frontend depende da API Flask. Portanto, o backend deve estar rodando antes.

🧰 Stack Utilizada
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

Tailwind (se estiver usando)

🔗 Endpoints principais (prefixo /api)
Produtos

CRUD → /api/produtos

Movimentações de estoque

Entrada → POST /api/entrada

Saída → POST /api/saida

Vendas

Criar venda (gera saída automática) → POST /api/vendas

Itens

Listar → GET /api/itens

Buscar por ID → GET /api/itens/<id>

Clientes

CRUD → /api/clientes

Funcionários

CRUD → /api/funcionarios

👥 Integrantes do Grupo

Cindy Joyce (SI)

Lilian Barbosa (ADS)

Leticia Policeno (SI)

Lavinia Braga (SI)
Grupo: Cindy Joyce (SI), Lilian Barbosa (ADS), Lavinia Braga (SI)
