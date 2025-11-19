from flask import Blueprint, request, jsonify
from controllers.cliente_controller import criar_cliente, listar_clientes, get_cliente, atualizar_cliente, deletar_cliente

cliente_bp = Blueprint('cliente_bp', __name__)

@cliente_bp.route('', methods=['POST'])
def criar():
    """Descrição: Criar cliente"""
    data = request.get_json() or {}
    res = criar_cliente(data)
    if isinstance(res, tuple) and hasattr(res[0], '__class__') and res[1]==201:
        c = res[0]
        return jsonify({'id':c.id, 'nome':c.nome}), 201
    return jsonify(res[0]), res[1]

@cliente_bp.route('', methods=['GET'])
def listar():
    """Descrição: Listar clientes"""
    cs = listar_clientes()
    return jsonify([{'id':c.id, 'nome':c.nome, 'telefone':c.telefone, 'email':c.email} for c in cs])

@cliente_bp.route('/<int:cid>', methods=['GET'])
def get_one(cid):
    """Descrição: get_one"""
    c = get_cliente(cid)
    if not c:
        return jsonify({'error':'não encontrado'}), 404
    return jsonify({'id':c.id, 'nome':c.nome, 'telefone':c.telefone, 'email':c.email, 'cpf':c.cpf})

@cliente_bp.route('/<int:cid>', methods=['PUT'])
def atualizar(cid):
    """Descrição: Atualizar informações do cliente"""
    data = request.get_json() or {}
    res = atualizar_cliente(cid, data)
    if isinstance(res, tuple) and hasattr(res[0], '__class__'):
        c = res[0]; status = res[1]
        return jsonify({'id':c.id, 'nome':c.nome, 'telefone':c.telefone, 'email':c.email}), status
    return jsonify(res[0]), res[1]

@cliente_bp.route('/<int:cid>', methods=['DELETE'])
def deletar(cid):
    """Descrição: Deletar cliente"""
    res = deletar_cliente(cid)
    return jsonify(res[0]), res[1]