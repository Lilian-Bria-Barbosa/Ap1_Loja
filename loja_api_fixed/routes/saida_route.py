from flask import Blueprint, request, jsonify
from controllers.saida_controller import registrar_saida

saida_bp = Blueprint('saida_bp', __name__)

@saida_bp.route('/saida', methods=['POST'])
def saida():
    """Descrição: Criar saída de estoque"""
    data = request.get_json() or {}
    res = registrar_saida(data)
    if isinstance(res, tuple):
        return jsonify(res[0]), res[1]
    return jsonify(res)