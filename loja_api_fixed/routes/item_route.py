from flask import Blueprint, jsonify
from controllers.item_controller import listar_itens, get_item

item_bp = Blueprint('item_bp', __name__)

@item_bp.route('/itens', methods=['GET'])
def listar():
    """Descrição: Listar itens"""
    itens = listar_itens()
    out = []
    for i in itens:
        out.append({
            'id': i.id,
            'produto_id': i.produto_id,
            'qtd': i.qtd,
            'preco_unit': i.preco_unit,
            'subtotal': i.subtotal,
            'entrada_id': i.entrada_id,
            'saida_id': i.saida_id
        })
    return jsonify(out)

@item_bp.route('/itens/<int:iid>', methods=['GET'])
def get_one(iid):
    """Descrição: get_one"""
    i = get_item(iid)
    if not i:
        return jsonify({'error':'Item não encontrado'}), 404
    return jsonify({
        'id': i.id,
        'produto_id': i.produto_id,
        'qtd': i.qtd,
        'preco_unit': i.preco_unit,
        'subtotal': i.subtotal,
        'entrada_id': i.entrada_id,
        'saida_id': i.saida_id
    })