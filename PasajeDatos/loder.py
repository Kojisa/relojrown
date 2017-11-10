import csv
import datetime

from handler_schedules import ScheduleHandler

with open("horarios.csv") as _f:
    reader = csv.reader(_f)

    for line in reader:

        docket = int(line[0])
        dep = int(line[1])

        schedule = {}
        if line[2] != "None":
            schedule["lunes"] = (line[2], line[3])
        if line[4] != "None":
            schedule["martes"] = (line[4], line[5])
        if line[6] != "None":
            schedule["miercoles"] = (line[6], line[7])
        if line[8] != "None":
            schedule["jueves"] = (line[8], line[9])
        if line[10] != "None":
            schedule["viernes"] = (line[10], line[11])
        if line[12] != "None":
            schedule["sabado"] = (line[12], line[13])
        if line[14] != "None":
            schedule["domingo"] = (line[14], line[15])
        if line[16] != "None":
            schedule["feriado"] = (line[16], line[17])

        with ScheduleHandler() as handler:
            handler.add_schedule(docket_id=docket,
                                 building_id=dep,
                                 valid_from=str(datetime.datetime.today()).split(".")[0],
                                 valid_to=str(datetime.datetime.today() + datetime.timedelta(365)).split(".")[0],
                                 schedule=schedule)
