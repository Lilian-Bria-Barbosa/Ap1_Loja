from extensions import db
from models.funcionario_model import Funcionario

def criar_funcionario(data):
    nome = data.get('nome')
    if not nome:
        return ({"error":"nome obrigatório"}, 400)
    f = Funcionario(nome=nome, cargo=data.get('cargo'), cpf=data.get('cpf'))
    db.session.add(f)
    db.session.commit()
    return (f, 201)

def listar_funcionarios():
    return Funcionario.query.all()

def get_funcionario(fid):
    return Funcionario.query.get(fid)

def atualizar_funcionario(fid, data):
    f = Funcionario.query.get(fid)
    if not f:
        return ({"error":"funcionario não encontrado"}, 404)
    if 'nome' in data:
        f.nome = data.get('nome')
    if 'cargo' in data:
        f.cargo = data.get('cargo')
    if 'cpf' in data:
        f.cpf = data.get('cpf')
    db.session.commit()
    return (f, 200)

def deletar_funcionario(fid):
    f = Funcionario.query.get(fid)
    if not f:
        return ({"error":"funcionario não encontrado"}, 404)
    db.session.delete(f)
    db.session.commit()
    return ({'message':'deletado'}, 200)