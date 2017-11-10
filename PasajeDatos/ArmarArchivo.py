#coding=latin-1

import csv as CSV

LEGAJO = 0
PLANILLON = 1
REGISTRO = 2
TURNO = 3
LUNES = 4
MARTES = 5
MIERCOES = 6
JUEVES = 7
VIERNES = 8
SABADO = 9
DOMINGO = 10
FERIADOS = 11
CAMPOSDIAS = 8

LISTADO = {
    'Turno: 14 a 20                ':[840,1200,True,True,True,True,True,False,False,False],
    'Turno: 7 a 19 (12 X 24)       ':[420,1140,True,False,True,False,True,False,False,False],
    'Turno: Sab,Dom y Fer 8 a 14   ':[480,840,False,False,False,False,False,True,True,True],
    'Turno: 19 a 7                 ':[1140,1860,True,True,True,True,True,False,False,False],
    'Turno: 12 a 18                ':[720,1080,True,True,True,True,True,False,False,False],
    'Turno: 8 a 20                 ':[480,1200,True,True,True,True,True,False,False,False],
    'Turno: 08 a 14                ':[480,840,True,True,True,True,True,False,False,False],
    'Turno: 11 a 17                ':[660,1020,True,True,True,True,True,False,False,False],
    'Turno: 6:30 a 12:30           ':[390,750,True,True,True,True,True,False,False,False],
    'Turno: 8 a 12 (4 Horas)       ':[480,720,True,True,True,True,True,False,False,False],
    'Turno: 15 a 21                ':[900,1260,True,True,True,True,True,False,False,False],
    'Turno: 6 a 12                 ':[360,720,True,True,True,True,True,False,False,False],
    'Turno: Sab,Dom y Fer 20 a 8   ':[1200,1920,False,False,False,False,False,True,True,True],
    'Turno: 7 a 13                 ':[420,780,True,True,True,True,True,False,False,False],
    'Turno: 20 a 8 (12X36)         ':[1200,1920,True,False,True,False,True,False,False,False],
    'Turno: Sab,Dom y Fer 8 a 20   ':[480,1200,False,False,False,False,False,True,True,True],
    'Turno: 13 a 19                ':[780,1140,True,True,True,True,True,False,False,False],
    'Turno: 8:30 A 14:30           ':[510,870,True,True,True,True,True,False,False,False],
    'Turno: Sab,Dom y Fer 7 a 19   ':[420,1140,False,False,False,False,False,True,True,True],
    'Turno: 9 a 15                 ':[540,900,True,True,True,True,True,False,False,False],
    'Turno: 10 a 16                ':[600,960,True,True,True,True,True,False,False,False],
    
}

PLANILLONES={
    '000':1,'001':2,'002':3,'003':4,'004':5,'005':6,'006':7,'007':8,'008':9,
    '009':10,'010':11,'014':12,'017':13,'020':14,'021':15,'023':16,'024':17,
    '025':18,'026':19,'027':20,'028':21,'029':22,'030':23,'033':24,'036':25,
    '038':26,'041':27,'042':28,'043':29,'046':30,'047':31,'048':32,'049':33,
    '050':34,'052':35,'056':36,'057':37,'060':38,'063':39,'073':40,'074':41,
    '077':42,'080':43,'088':44,'089':45,'099':46,'100':47,'101':48,'102':49,
    '103':50,'104':51,'105':52,'106':53,'108':54,'110':55,'111':56,'112':57,
    '114':58,'115':59,'116':60,'117':61,'118':62,'119':63,'120':64,'121':65,
    '124':66,'125':67,'128':68,'130':69,'131':70,'132':71,'134':72,'136':73,
    '137':74,'138':75,'139':76,'140':77,'142':78,'143':79,'145':80,'146':81,
    '150':82,'151':83,'152':84,'154':85,'155':86,'157':87,'158':88,'159':89,
    '160':90,'161':91,'164':92,'165':93,'168':94,'169':95,
}


def abrirArchivo():
    arch = open('./plantilla.csv','r')
    csv = CSV.reader(arch)
    return csv


def crearArchivo():
    arch = open('./horarios.csv','w')
    return arch


def cargarDatos(input, output):

    for linea in input:

        planillon = PLANILLONES[linea[PLANILLON][0:3]]

        aEscribir = linea[LEGAJO] + ',' + str(planillon) + ','

        horarios = []
        if(LISTADO.has_key(linea[TURNO])):
            itinerario = LISTADO[linea[TURNO]]
            entrada = itinerario[0]
            salida = itinerario[1]
            for dia in itinerario[2:]:
                if(dia):
                    horarios.append([entrada,salida])
                    aEscribir += str(entrada) + ',' + str(salida) + ','
                else:
                    horarios.append(None)
                    aEscribir += str(None) + ',' + str(None) + ','
        else:
            print linea
            for x in range(CAMPOSDIAS):
                
                if(linea[LUNES + x][0:2] != '  '):
                    entrada = int(linea[LUNES + x][3:7])
                    salida = int(linea[LUNES + x][8:])
                    if(salida < entrada):
                        salida += 24
                    
                    entrada = entrada*60
                    salida = salida*60
                    horarios.append([entrada,salida])
                    aEscribir += str(entrada) + ',' + str(salida) + ','
                else:
                    horarios.append(None)
                    aEscribir += str(None) + ',' + str(None) + ','

        output.write(aEscribir + '\n')
        
    output.close()
                    





def main():

    entrada = abrirArchivo()
    salida = crearArchivo()
    cargarDatos(entrada,salida)

main()