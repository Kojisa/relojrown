from conectores import conectarSQLServer,conectarMYSQL
import datetime

QUERY = "SELECT CAST([BADGENUMBER] AS INT),[CHECKTIME]\
  FROM [rafam_relojes].[dbo].[CHECKINOUT] c\
  INNER JOIN [rafam_relojes].[dbo].[USERINFO] u\
  ON u.USERID = c.USERID\
  where CHECKTIME >= '2019-05-05'\
  group by BADGENUMBER,CHECKTIME\
  order by CAST(BADGENUMBER AS INT),CHECKTIME"
QUERYBROWN = "select p.DocumentNr,a.accessDate from taccesslog a \
inner join tperson p on p.idtx = a.idtx \
where a.accessDate >= '20181201' and a.accessDate < '20190201'"
MAX_DIF = datetime.timedelta(hours=13)
MIN_DIF = datetime.timedelta(seconds=360)

def obtenerInfo():

    con,cur = conectarSQLServer()
    cur.execute(QUERY)
    datos = cur.fetchall()

    legajos = {}
    
    for fichada in datos:

        if(not (fichada[0] in legajos ) ):

            legajos[fichada[0]] = []
        
        legajos[fichada[0]].append(fichada[1])
    
    con.close()

    return legajos


def ordenarHorarios():
    fichadas = obtenerInfo()
    fichadasCerradas = {}
    
    for legajo in fichadas.keys():

        horarios = fichadas[legajo]
        ultimoHorario = None
        ultimoUsado = False
        pares = []
        for horario in horarios:
            if ultimoHorario == None:
                ultimoHorario = horario
            
            elif (horario - ultimoHorario > MAX_DIF):
                if ultimoUsado == False:
                    pares.append((ultimoHorario,ultimoHorario))
                ultimoHorario = horario
                ultimoUsado = False

            elif (horario - ultimoHorario < MIN_DIF):
                ultimoHorario = horario
            
            else:
                if(ultimoUsado == False):
                    pares.append((ultimoHorario,horario))
                    ultimoUsado = True
            
                ultimoHorario = horario
                
        fichadasCerradas[legajo] = pares
    return fichadasCerradas


            
            