import openpyxl
import Conectar

ARCHIVO='ORGANIGRAMA CON DEPENDENCIAS CODIFICADAS.xlsx'
SALIDA=''


def obtenerSolapas(archivo):
    return archivo.get_sheet_names()



def devolverSolapa(archivo,indice):
    return archivo[obtenerSolapas(archivo)[indice]]

def abrirArchivo():
    arch = openpyxl.load_workbook(ARCHIVO)
    return arch


def main():
    archivo = abrirArchivo()

    orden = "Select * from dependencias where codigo = '{}' and jurisdiccion = '{}'"

    con,cur = Conectar.conectar()
    for x in range( len( obtenerSolapas(archivo) ) ):
        tab = devolverSolapa(archivo,x)
        jurisdiccion = tab['C1'].value
        for y in range(tab.max_row):
            print tab['B'+str(y)]
            cur.execute(orden.format(tab['B'+str(y)].value,jurisdiccion))
            res = cur.fetchall()
            if( len(res) == 0):
                print ("La dependencia " + tab['A'+str(y)].value + " no pertenece a la jurisdiccion informada: " + jurisdiccion)


main()