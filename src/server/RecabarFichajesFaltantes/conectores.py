def conectarSQLServer():
    import pypyodbc as SQL
    con = SQL.connect('Driver={ODBC Driver 13 for SQL Server};'
    'SERVER=10.10.10.66;'
    'Database=rafam_relojes;'
    'uid=rafam_relojes;'
    'pwd=g9cwwS6w;')

    cur = con.cursor()
    return con,cur


US = 'owner_rafam'
PASS = 'ownerdba'
HOST = '10.10.10.1' #'172.22.20.151:1521'
DB = 'MSV'#MBROWN'

def conectarORACLE():
    import cx_Oracle as ORA

    US = 'owner_rafam'
    PASS = 'ownerdba'
    HOST = '10.10.10.1'
    DB = 'MSV'

    con = ORA.connect(""+US + "/" + PASS + "@" + HOST + "/" + DB)
    cur = con.cursor()
    return con,cur
