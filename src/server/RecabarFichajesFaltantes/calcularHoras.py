from recabarInfo import ordenarHorarios
from conectores import conectarORACLE
import datetime

SEGUNDOSFRACCION = 1800
FRACCIONMENOR = datetime.timedelta(seconds=SEGUNDOSFRACCION)


SQLEXISTE = 'SELECT LEGAJO FROM LEGAJOS WHERE LEGAJO = {}'
SQLHORARIOS = "SELECT MONDAY_IN,MONDAY_OUT,TUESDAY_IN,TUESDAY_OUT,WEDNESDAY_IN,WEDNESDAY_OUT,THURSDAY_IN,THURSDAY_OUT,\
FRIDAY_IN,FRIDAY_OUT,SATURDAY_IN,SATURDAY_OUT,SUNDAY_IN,SUNDAY_OUT from SCHEDULES \
 WHERE DOCKET_ID = {} AND FROM_DATE < TO_DATE('{}','DD/MM/YYYY') AND TO_DATE > TO_DATE('{}','DD/MM/YYYY') ORDER BY FROM_DATE DESC"
SQLVALORHORA = "SELECT valor FROM per_liq_var_h WHERE legajo = {} AND mes = {} \
AND anio = {} AND variable = 'MH' AND TIPO_LIQ = 'N'" #'RCA_ART' brown 'MH' sv

#black thread
#scarlet hide
#manufacturerd wood
#scarlet orb
#twilight stone
#cursed sphere
#glory bug
#blessing needle
#dark ore
#tranquil stone
#silver chunk
#rusted lump
#black pearl
#meteor light
#sealed box
#crimson wing


SQLINSERTHORAS = "INSERT INTO ATTENDANCE (DOCKET_ID,CHECK_IN,CHECKOUT) VALUES({},'{}','{}');"
SQLINSERTEXTRAS = "INSERT INTO OVERTIMES (O_DATE,DEPENDENCE_ID,HOUR_VALUE,AMOUNT,MOD,DOCKET_ID) VALUES('{}','{}',{},{},{},{});"

def ajustarISO(horario):
    fecha,hora = horario.split('T')

    anio = fecha[0:4]
    mes = fecha[5:7]
    dia = fecha[8:]

    fechaFinal = dia + '/' + mes + '/' + anio + ' ' + hora
    return fechaFinal

def legajoExiste(legajo,cur):

    cur.execute(SQLEXISTE.format(legajo))
    res = cur.fetchall()
    if(len(res) > 0):
        return True
    else:
        return False
    


def generarArchivoHoras():
    legajos = ordenarHorarios()
    con,cur = conectarORACLE()
    archivo = open('./fichadas.sql','w')
    for legajo in legajos.keys():

        if(not legajoExiste(legajo,cur)):
            continue

        horarios = legajos[legajo]
        for horario in horarios:

            fichada = SQLINSERTHORAS.format(legajo,
            ajustarISO(horario[0].isoformat()),
            ajustarISO(horario[1].isoformat())) + '\n'


            archivo.write(fichada)
    con.close()
    archivo.close()

def obtenerEntradaSalida(legajo,entrada,db):
    fecha = ajustarISO(entrada.isoformat()).split(' ')[0]
    db.execute(SQLHORARIOS.format(legajo,fecha,fecha))
    diaSemana = entrada.weekday()
    datos = db.fetchall()
    if(len(datos) == 0):
        return None,None
    
    return datos[0][0 + (2*diaSemana)],datos[0][1 + (2*diaSemana)]

def obtenerSegundos(horario,legajo,cur):
    entrada,salida = horario
    
    entradaIti,salidaIti = obtenerEntradaSalida(legajo,entrada,cur) #obtengo los horarios de entrada y salida estipulados

    if(entradaIti != None):
        horaBase = datetime.datetime.min.time()
        entradaIti = datetime.datetime.combine(entrada.date(),horaBase) + datetime.timedelta(minutes=entradaIti)
        salidaIti = datetime.datetime.combine(entrada.date(),horaBase) + datetime.timedelta(minutes=salidaIti)

    dif = 0

    if(entradaIti == None):
        
        dif = (salida - entrada).seconds
    
    elif ((entradaIti - salida) >  FRACCIONMENOR ):

        dif = (salida - entrada).seconds
    
    elif ((entrada - salidaIti) > FRACCIONMENOR ):

        dif = (salida - entrada).seconds
    
    elif(( entradaIti  - entrada) > FRACCIONMENOR ):

        dif = (entradaIti - entrada).seconds
    
    elif((salida - salidaIti) > FRACCIONMENOR ):

        dif = (salida - salidaIti).seconds
    
    dif -= dif%SEGUNDOSFRACCION #Redondeo hacia abajo


    mod = 0
    if(entradaIti == None):
        mod = 2
    else:
        mod = 1.5
    
    if(entrada.hour >= 20 or entrada.hour < 2):
        mod *= 8


    return dif/60,mod


def obtenerValorHora(legajo,anio,mes,cur):
    cur.execute(SQLVALORHORA.format(legajo,mes,anio))
    res = cur.fetchall()
    if(len(res) == 0):
        return 0
    else:
        return res[0][0]

def calcularHorasExtras():
    legajos = ordenarHorarios()
    con,cur = conectarORACLE()

    archivo = open('./hsExtras.sql','w')
    a = 0
    for legajo in legajos.keys():

        if(not legajoExiste(legajo,cur)):
            continue #si el legajo no existe no se tiene en cuenta

        horarios = legajos[legajo]
        
        for horario in horarios:
            a += 1
            print 'Linea ', a
            cant,mod = obtenerSegundos(horario,legajo,cur)

            if(cant == 0):
                continue
            
            entrada = horario[0]

            cur.execute("select dependencia_f from per_agentes_movimientos"
             " where legajo = {} and vigencia = 'S' ".format(legajo))


            dependencia = cur.fetchall()[0][0]

            valor_hora = obtenerValorHora(legajo,entrada.year,entrada.month,cur)
            
            texto = SQLINSERTEXTRAS.format(ajustarISO(entrada.isoformat()),dependencia,valor_hora,cant,mod,legajo)
            archivo.write(texto + '\n')
        
    
    con.close()
    archivo.close()



            
