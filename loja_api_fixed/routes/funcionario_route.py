from flask import Blueprint, request, jsonify

from controllers.funcionario_controller import (
    criar_funcionario,
    listar_funcionarios,
    get_funcionario,
    atualizar_funcionario,
    deletar_funcionario
)

funcionario_bp = Blueprint('funcionario_bp', __name__, url_prefix="/api/funcionarios")

@funcionario_bp.route('', methods=['POST'])
def criar():
    """Descrição: Criar funcionário"""
    data = request.get_json() or {}
    res = criar_funcionario(data)
    if isinstance(res, tuple) and hasattr(res[0], '__class__') and res[1]==201:
        f = res[0]
        
        return jsonify({'id':f.id, 'nome':f.nome, 'cargo':f.cargo, 'cpf':f.cpf}), 201
    return jsonify(res[0]), res[1]

@funcionario_bp.route('', methods=['GET'])
def listar():
    """Descrição: Listar funcionários"""
    fs = listar_funcionarios()
  
    return jsonify([
        {'id':f.id, 'nome':f.nome, 'cargo':f.cargo, 'cpf':f.cpf}
        for f in fs
    ])

@funcionario_bp.route('/<int:fid>', methods=['GET'])
def get_one(fid):
    """Descrição: get_one"""
    f = get_funcionario(fid)
    if not f:
        return jsonify({'error': 'não encontrado'}), 404
 
    return jsonify({'id':f.id, 'nome':f.nome, 'cargo':f.cargo, 'cpf':f.cpf})

@funcionario_bp.route('/<int:fid>', methods=['PUT'])
def atualizar(fid):
    """Descrição: Atualizar informações do funcionário"""
    data = request.get_json() or {}
    res = atualizar_funcionario(fid, data)
    if isinstance(res, tuple) and hasattr(res[0], '__class__'):
        f = res[0]
        status = res[1]
       
        return jsonify({'id':f.id, 'nome':f.nome, 'cargo':f.cargo, 'cpf':f.cpf}), status
    return jsonify(res[0]), res[1]

@funcionario_bp.route('/<int:fid>', methods=['DELETE'])
def deletar(fid):
    """Descrição: Deletar funcionário"""
    res = deletar_funcionario(fid)
    return jsonify(res[0]), res[1]