from Conectar import conectar


ordenCargaHorario = 'insert into schedules(docket_id,building_id,\
from_date,to_date,\
monday_in,monday_out,\
tuesday_in,tuesday_out,\
wednesday_in,wednesday_out,\
thursday_in,thursday_out,\
friday_in,friday_out\
{})\
values(\
{},1,SYSDATE,add_months(SYSDATE,12),\
480,{},\
480,{},\
480,{},\
480,{},\
480,{}\
{})'

ordenObtenerHorario = "select legajo,modulo_horario \
from per_agentes_movimientos where vigencia = 'S'"


def obtenerLegajos():

    con,cur = conectar()
    cur.execute(ordenObtenerHorario)
    res = cur.fetchall()
    con.close()
    return res

def cargarHorarios():
    legajos = obtenerLegajos()

    con,cur = conectar()
    for legajo in legajos:

        numero = legajo[0]
        modulo = legajo[1]

        dic = {'legajo':numero}
        if(modulo == 1):
            dic['salida'] = 840
        elif(modulo == 2):
            dic['salida'] = 840 #hasta sabado
        elif(modulo == 3):
            dic['salida'] = 960 #hasta sabado
        elif(modulo == 4):
            dic['salida'] = 720 #hasta sabado
        elif(modulo == 5):
            dic['salida'] = 960
        elif(modulo == 6):
            dic['salida'] = 720
        if('salida' not in dic):
            continue
        
        if(modulo in [2,3,4]):
            valor = ', 480, ' + str(dic['salida'])
            cur.execute(ordenCargaHorario.format(', saturday_in, saturday_out '
            ,numero,dic['salida'],dic['salida'],dic['salida'],dic['salida'],dic['salida'],
            valor))

        else:
            cur.execute(ordenCargaHorario.format(' ',numero,dic['salida']
            ,dic['salida'],dic['salida'],dic['salida'],dic['salida'],''))
    
        con.commit()

cargarHorarios()
