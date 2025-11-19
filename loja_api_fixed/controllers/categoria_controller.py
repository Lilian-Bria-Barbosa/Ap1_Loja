from extensions import db
from models.categoria_model import Categoria

def criar_categoria(data):
    nome = data.get('nome')
    if not nome:
        return ({"error":"nome obrigatório"}, 400)
    c = Categoria(nome=nome, descricao=data.get('descricao'))
    db.session.add(c)
    db.session.commit()
    return (c, 201)

def listar_categorias():
    return Categoria.query.all()