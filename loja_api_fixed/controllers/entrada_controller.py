from extensions import db
from models.entrada_model import EntradaEstoque
from models.item_model import ItemMovimento
from models.produto_model import Produto

def registrar_entrada(data):
    itens = data.get('itens')
    if not itens or not isinstance(itens, list):
        return ({"error":"itens obrigatórios"}, 400)
    entrada = EntradaEstoque(fornecedor=data.get('fornecedor'))
    db.session.add(entrada)
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
        preco_unit = float(it.get('preco_unit', produto.preco_unit or 0.0))
        subtotal = qtd * preco_unit
        item = ItemMovimento(produto_id=produto.id, qtd=qtd, preco_unit=preco_unit, subtotal=subtotal, entrada_id=entrada.id)
        db.session.add(item)
        produto.qtd_estoque = (produto.qtd_estoque or 0) + qtd
    db.session.commit()
    return ({"id": entrada.id, "data": entrada.data.isoformat()}, 201)