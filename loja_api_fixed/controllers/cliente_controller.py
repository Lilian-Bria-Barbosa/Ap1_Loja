from extensions import db
from models.cliente_model import Cliente

def criar_cliente(data):
    nome = data.get('nome')
    if not nome:
        return ({"error":"nome obrigatório"}, 400)
    c = Cliente(nome=nome, telefone=data.get('telefone'), email=data.get('email'), cpf=data.get('cpf'))
    db.session.add(c)
    db.session.commit()
    return (c, 201)

def listar_clientes():
    return Cliente.query.all()

def get_cliente(cid):
    return Cliente.query.get(cid)

def atualizar_cliente(cid, data):
    c = Cliente.query.get(cid)
    if not c:
        return ({"error":"cliente não encontrado"}, 404)
    if 'nome' in data:
        c.nome = data.get('nome')
    if 'telefone' in data:
        c.telefone = data.get('telefone')
    if 'email' in data:
        c.email = data.get('email')
    if 'cpf' in data:
        c.cpf = data.get('cpf')
    db.session.commit()
    return (c, 200)

def deletar_cliente(cid):
    c = Cliente.query.get(cid)
    if not c:
        return ({"error":"cliente não encontrado"}, 404)
    db.session.delete(c)
    db.session.commit()
    return ({'message':'deletado'}, 200)