import cx_Oracle as ORA

US = 'owner_rafam'
PASS = 'ownerdba'
HOST = '172.22.20.151:1521'
DB = 'MBROWN'


def conectar():
    con = ORA.connect(""+US + "/" + PASS + "@" + HOST + "/" + DB)
    cur = con.cursor()
    return con,cur