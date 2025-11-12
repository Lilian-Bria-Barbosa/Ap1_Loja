from flask import Blueprint, request, jsonify
from controllers.produto_controller import criar_produto, listar_produtos, get_produto
from extensions import db
from models.produto_model import Produto

produto_bp = Blueprint('produto_bp', __name__)

# ------------------ CRIAR PRODUTO ------------------
@produto_bp.route('', methods=['POST'])
def criar():
    """Descrição: Criar produto"""
    data = request.get_json() or {}
    res = criar_produto(data)
    if isinstance(res, tuple) and res[1] == 201:
        p = res[0]
        return jsonify({
            'id': p.id,
            'nome': p.nome,
            'descricao': p.descricao,
            'tamanho': p.tamanho,
            'preco_unit': p.preco_unit,
            'qtd_estoque': p.qtd_estoque
        }), 201
    return jsonify(res[0]), res[1]


# ------------------ LISTAR PRODUTOS ------------------
@produto_bp.route('', methods=['GET'])
def listar():
    """Descrição: Listar produtos"""
    produtos = listar_produtos()
    out = [{
        'id': p.id,
        'nome': p.nome,
        'descricao': p.descricao,
        'tamanho': p.tamanho,        
        'preco_unit': p.preco_unit,
        'qtd_estoque': p.qtd_estoque
    } for p in produtos]
    return jsonify(out)


# ------------------ OBTÉM UM PRODUTO ------------------
@produto_bp.route('/<int:pid>', methods=['GET'])
def get_one(pid):
    """Descrição: get_one"""
    p = get_produto(pid)
    if not p:
        return jsonify({'error': 'não encontrado'}), 404
    return jsonify({
        'id': p.id,
        'nome': p.nome,
        'descricao': p.descricao,
        'tamanho': p.tamanho,        
        'preco_unit': p.preco_unit,
        'qtd_estoque': p.qtd_estoque
    })


# ------------------ ATUALIZAR PRODUTO ------------------
@produto_bp.route('/<int:pid>', methods=['PUT'])
def atualizar(pid):
    """Descrição: Atualizar produto existente"""
    p = Produto.query.get(pid)
    if not p:
        return jsonify({'error': 'Produto não encontrado'}), 404

    data = request.get_json() or {}
    p.nome = data.get('nome', p.nome)
    p.descricao = data.get('descricao', p.descricao)
    p.tamanho = data.get('tamanho', p.tamanho)
    p.preco_unit = float(data.get('preco_unit', p.preco_unit))
    p.qtd_estoque = int(data.get('qtd_estoque', p.qtd_estoque))

    db.session.commit()
    return jsonify({'message': 'Produto atualizado com sucesso'}), 200


# ------------------ DELETAR PRODUTO ------------------
@produto_bp.route('/<int:pid>', methods=['DELETE'])
def deletar(pid):
    """Descrição: Excluir produto"""
    p = Produto.query.get(pid)
    if not p:
        return jsonify({'error': 'Produto não encontrado'}), 404

    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Produto excluído com sucesso'}), 200
