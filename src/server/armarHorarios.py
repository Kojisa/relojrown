#coding=latin
import Conectar as CON
import openpyxl
import pypyodbc as SQL



ordenSQL = 'SELECT \
c.[CHECKTIME] \
,c.[SENSORID], \
u.[NAME], \
u.[BADGENUMBER] \
FROM [rafam_relojes].[dbo].[CHECKINOUT] c \
inner join [rafam_relojes].[dbo].[USERINFO] u \
on c.USERID = u.USERID \
order by u.BADGENUMBER,c.CHECKTIME'

ordenORA = "SELECT l.jurisdiccion, d.descripcion\
 from per_agentes_movimientos l \
 inner join dependencias d on l.dependencia_f = d.codigo \
 where l.legajo = %(legajo)s and vigente = 'S'"

def conectar():
    con = SQL.connect('Driver={SQL Server};'
    '')




def pedir_horarios():
