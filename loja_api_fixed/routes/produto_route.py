from flask import Blueprint, request, jsonify
from controllers.produto_controller import criar_produto, listar_produtos, get_produto
from extensions import db
from models.produto_model import Produto

produto_bp = Blueprint('produto_bp', __name__, url_prefix="/api/produtos") 

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
            'preco': p.preco_unit,              
            'quantidade_estoque': p.qtd_estoque 
        }), 201
    return jsonify(res[0]), res[1]


@produto_bp.route('', methods=['GET'])
def listar():
    """Descrição: Listar produtos"""
    produtos = listar_produtos()
    out = [{
        'id': p.id,
        'nome': p.nome,
        'descricao': p.descricao,
        'tamanho': p.tamanho,
        'preco': p.preco_unit,             
        'quantidade_estoque': p.qtd_estoque 
    } for p in produtos]
    return jsonify(out)


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
        'preco': p.preco_unit,             
        'quantidade_estoque': p.qtd_estoque 
    })



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
    
    try:
        if 'preco' in data:
            p.preco_unit = float(data['preco'])
        
        if 'quantidade_estoque' in data:
            p.qtd_estoque = int(data['quantidade_estoque'])
            
    except (ValueError, TypeError):
        return jsonify({'error': 'Os campos de preço e quantidade devem ser numéricos.'}), 400

    db.session.commit()
    
    return jsonify({
        'id': p.id,
        'nome': p.nome,
        'descricao': p.descricao,
        'tamanho': p.tamanho,
        'preco': p.preco_unit,
        'quantidade_estoque': p.qtd_estoque
    }), 200


@produto_bp.route('/<int:pid>', methods=['DELETE'])
def deletar(pid):
    """Descrição: Excluir produto"""
    p = Produto.query.get(pid)
    if not p:
        return jsonify({'error': 'Produto não encontrado'}), 404

    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Produto excluído com sucesso'}), 200