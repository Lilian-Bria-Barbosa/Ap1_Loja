from flask import Blueprint, request, jsonify
from controllers.entrada_controller import registrar_entrada

entrada_bp = Blueprint('entrada_bp', __name__)

@entrada_bp.route('/entrada', methods=['POST'])
def entrada():
    """Descrição: Criar entrada de estoque"""
    data = request.get_json() or {}
    res = registrar_entrada(data)
    if isinstance(res, tuple):
        return jsonify(res[0]), res[1]
    return jsonify(res)