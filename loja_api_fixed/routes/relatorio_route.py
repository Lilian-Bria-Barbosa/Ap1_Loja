from flask import Blueprint, request, jsonify, make_response
import csv
from io import StringIO
from controllers.funcionario_controller import listar_funcionarios 

relatorio_bp = Blueprint('relatorio_bp', __name__, url_prefix="/api/relatorio")

@relatorio_bp.route('/csv', methods=['GET'])
def exportar_csv():
    """Descrição: Exporta a lista de funcionários para CSV."""
    
    fs = listar_funcionarios()
    
    si = StringIO()
    cw = csv.writer(si)
    
    cabecalho = ['ID', 'Nome', 'Cargo', 'CPF']
    cw.writerow(cabecalho)
    
    for f in fs:
        cw.writerow([f.id, f.nome, f.cargo, f.cpf]) 
        
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = "attachment; filename=relatorio_funcionarios.csv"
    output.headers["Content-type"] = "text/csv"
    return output

