from extensions import db
from models.produto_model import Produto

def criar_produto(data):
    nome = data.get('nome')
    preco = data.get('preco_unit')
    if not nome or preco is None:
        return ({"error":"nome e preco_unit obrigatórios"}, 400)
    try:
        preco = float(preco)
    except:
        return ({"error":"preco_unit inválido"}, 400)
    qtd = int(data.get('qtd_estoque', 0))
    if qtd < 0:
        return ({"error":"qtd_estoque não pode ser negativa"}, 400)
    p = Produto(nome=nome, descricao=data.get('descricao'), preco_unit=preco, tamanho=data.get('tamanho'), qtd_estoque=qtd, categoria_id=data.get('categoria_id'))
    db.session.add(p)
    db.session.commit()
    return (p, 201)

def listar_produtos():
    return Produto.query.all()

def get_produto(pid):
    return Produto.query.get(pid)