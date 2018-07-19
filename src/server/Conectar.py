import cx_Oracle as ORA

US = 'owner_rafam'
PASS = 'ownerdba'
HOST = '10.10.10.1'#'172.22.20.151:1521'
DB = 'MSV'#MBROWN'


def conectar():
    con = ORA.connect(""+US + "/" + PASS + "@" + HOST + "/" + DB)
    cur = con.cursor()
    return con,cur