from extensions import db
from models.saida_model import SaidaEstoque
from models.item_model import ItemMovimento
from models.produto_model import Produto

def registrar_saida(data):
    itens = data.get('itens')
    if not itens or not isinstance(itens, list):
        return ({"error":"itens obrigatórios"}, 400)
    saida = SaidaEstoque(tipo=data.get('tipo'))
    db.session.add(saida)
    db.session.flush()
    for it in itens:
        pid = it.get('produto_id')
        qtd = it.get('qtd')
        if pid is None or qtd is None:
            db.session.rollback()
            return ({"error":"cada item precisa de produto_id e qtd"}, 400)
        produto = Produto.query.get(pid)
        if not produto:
            db.session.rollback()
            return ({"error":f"produto {pid} não encontrado"}, 404)
        try:
            qtd = int(qtd)
        except:
            db.session.rollback()
            return ({"error":f"qtd inválida para produto {pid}"}, 400)
        if qtd <= 0:
            db.session.rollback()
            return ({"error":"qtd deve ser > 0"}, 400)
        if produto.qtd_estoque is None or produto.qtd_estoque < qtd:
            db.session.rollback()
            return ({"error":f"estoque insuficiente para produto {produto.id} (tem {produto.qtd_estoque})"}, 400)
        preco_unit = float(it.get('preco_unit', produto.preco_unit or 0.0))
        subtotal = qtd * preco_unit
        item = ItemMovimento(produto_id=produto.id, qtd=qtd, preco_unit=preco_unit, subtotal=subtotal, saida_id=saida.id)
        db.session.add(item)
        produto.qtd_estoque = produto.qtd_estoque - qtd
    db.session.commit()
    return ({"id": saida.id, "data": saida.data.isoformat()}, 201)