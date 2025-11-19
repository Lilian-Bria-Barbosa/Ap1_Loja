from flask import Blueprint, request, jsonify
from controllers.categoria_controller import criar_categoria, listar_categorias

categoria_bp = Blueprint('categoria_bp', __name__)

@categoria_bp.route('', methods=['POST'])
def criar():
    """Descrição: Criar categoria"""
    data = request.get_json() or {}
    res = criar_categoria(data)
    if isinstance(res, tuple) and hasattr(res[0], '__class__') and res[1]==201:
        c = res[0]
        return jsonify({'id':c.id, 'nome':c.nome}), 201
    return jsonify(res[0]), res[1]

@categoria_bp.route('', methods=['GET'])
def listar():
    """Descrição: Listar categorias"""
    cats = listar_categorias()
    return jsonify([{'id':c.id, 'nome':c.nome} for c in cats])