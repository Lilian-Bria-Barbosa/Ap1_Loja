from flask import Blueprint, request, jsonify
from controllers.venda_controller import registrar_venda

venda_bp = Blueprint('venda_bp', __name__)

@venda_bp.route('/vendas', methods=['POST'])
def criar_venda():
    """Descrição: Criar venda"""
    data = request.get_json() or {}
    res = registrar_venda(data)
    if isinstance(res, tuple):
        return jsonify(res[0]), res[1]
    return jsonify(res)