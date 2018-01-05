import openpyxl
import Conectar

ARCHIVO='ORGANIGRAMA CON DEPENDENCIAS CODIFICADAS.xlsx'
SALIDA='Errores'


def obtenerSolapas(archivo):
    return archivo.get_sheet_names()



def devolverSolapa(archivo,indice):
    return archivo[obtenerSolapas(archivo)[indice]]

def abrirArchivo():
    arch = openpyxl.load_workbook(ARCHIVO)
    return arch

def abrirSalida():
    arch = open(SALIDA,'w')
    return arch

def main():
    archivo = abrirArchivo()
    salida = abrirSalida()
    orden = "Select * from dependencias where codigo = '{}' and jurisdiccion = '{}'"

    con,cur = Conectar.conectar()
    for x in range( len( obtenerSolapas(archivo) ) ):
        tab = devolverSolapa(archivo,x)
        jurisdiccion = tab['C1'].value
        
        for y in range(1,tab.max_row + 1):
            
            depen = tab['B'+str(y)].value
            nombre = tab['A'+str(y)].value
            
            if( depen == None or len( depen ) == 0):
                salida.write("La dependencias " + nombre + " no tiene codigo declarado. Jurisdiccion deseada: " + jurisdiccion + "\n")

            cur.execute(orden.format(depen,jurisdiccion))
            res = cur.fetchall()
            if( len(res) == 0):
                salida.write("La dependencia " + nombre + " no pertenece a la jurisdiccion informada: " + jurisdiccion + "\n")
    salida.close()

main()