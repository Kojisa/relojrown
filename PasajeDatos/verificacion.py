#coding=latin-1
import csv as CSV



def abrirArchivo():

    arch = open('plantilla.csv','r')
    csv = CSV.reader(arch)
    return csv




def main():

    entrada = abrirArchivo()
    dic = {}
    for linea in entrada:
        if(not dic.has_key(linea[1])):
            dic[linea[1]]=linea[1]
    
    lista = dic.keys()
    lista.sort()
    a = 0
    for x in lista:
        a += 1
        nombre = x[4:]
        for i in range(len(nombre)-1,0,-1):
            if(nombre[i] != ' '):
                nombre = nombre[:i+1]
                break
        print '\''+x[0:3]+'\':\''+ nombre + '\','

main()



listado = {
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
