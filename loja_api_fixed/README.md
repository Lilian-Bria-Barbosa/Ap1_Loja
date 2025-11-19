# Loja API (Flask + SQLite) - Versão Completa

## Propósito
API para controle de estoque e vendas: produtos, categorias, entradas, saídas, vendas, clientes e funcionários.

## Como rodar
1. Crie e ative venv (opcional):
   ```bash
   python -m venv venv
   source venv/bin/activate   # macOS/Linux
   venv\Scripts\activate    # Windows
   ```
2. Instale dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Rode a API:
   ```bash
   python app.py
   ```
4. Acesse:
   - API root: http://127.0.0.1:5000/
   - Swagger UI: http://127.0.0.1:5000/docs

## Stack
- Python, Flask, Flask-SQLAlchemy, Flask-Marshmallow, Flasgger, SQLite

## Endpoints principais (prefixo /api)
- Produtos: CRUD `/api/produtos`
- Entradas: `POST /api/entrada`
- Saídas: `POST /api/saida`
- Vendas: `POST /api/vendas` (cria venda e saída automática)
- Itens: `GET /api/itens`, `GET /api/itens/<id>`
- Clientes: CRUD `/api/clientes`
- Funcionários: CRUD `/api/funcionarios`

Grupo: Cindy Joyce (SI), Lilian Barbosa (ADS), Leticia Policeno (SI), Lavinia Braga (SI)