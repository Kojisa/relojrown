#coding=latin
def conectarSQLServer():
    import pypyodbc as SQL
    con = SQL.connect('Driver={ODBC Driver 13 for SQL Server};'
    'SERVER=10.10.10.66;'
    'Database=rafam_relojes;'
    'uid=rafam_relojes;'
    'pwd=g9cwwS6w;')

    cur = con.cursor()
    return con,cur

def conectarMYSQL():
    import mysql.connector as CON
    HOST='192.168.4.2'
    USER='root'
    PASS='Naex*2012'
    DB='sabaccesscontrol_production'
    con = CON.connect(host=HOST,user=USER,password=PASS)
    con.database = DB
    return con,con.cursor()


def conectarORACLE():
    import cx_Oracle as ORA

    US = 'owner_rafam'
    PASS = 'ownerdba'
    HOST = '172.22.20.152'#'10.10.10.1' #'172.22.20.151:1521'
    DB = 'BDRAFAM'#'MSV'#MBROWN'

    con = ORA.connect(""+US + "/" + PASS + "@" + HOST + "/" + DB)
    cur = con.cursor()
    return con,cur
