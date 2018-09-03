
export default class DBHandler{
    
    PORT = "";// ":8000";
    HOST = "relojesadmin.sanvicente.gob.ar"//"relojesadmin.sanvicente.gob.ar";//'10.10.10.52';"172.20.0.3";
    HOSTRAFAM = '10.10.10.52:3000'//'relojesadmin.sanvicente.gob.ar'//'172.22.20.241';//"10.10.10.52";//'172.22.20.241';
    RUTABASICA = 'api/0.1/';


    devolverHost(){
        let host = this.HOST;
        if (window.location.href.indexOf(this.HOST) < 0){
            host = this.HOSTRAFAM;
        }
        return host
    }

    actualizar_limite(fun,datos,tipo){

        let fecha = new Date();
        let anio = fecha.getFullYear();
        let mes = fecha.getMonth()+ 1;
        mes = mes + (1 * datos.repeticion);
        if(mes > 12){
            mes = mes - 12;
            anio += 1;
        }
        let armarDatos = {
            'amount':datos.nuevo,
            'year': anio,
            'month':mes,
        }
        let extra;
        if(tipo === 'dependencias'){
            extra = 'dependencies';
            armarDatos['dependence_id']=datos.codigo;
        }
        else{
            extra ='secretariat'
            armarDatos['secretariat_id'] = datos.codigo;
        }
        
        if(datos.repeticion == 12){
            this.enviarPeticion(fun,'api/0.1/budget/'+extra,'POST',armarDatos,true);
        }
        
        else{
            datos['repeticion'] += 1;
            this.enviarPeticion(()=>{this.actualizar_limite(fun,datos,tipo)},'api/0.1/budget/'+extra,'POST',armarDatos,true);
        }
    }


    pedir_categorias(fun){
        this.enviarPeticion(fun,'api/0.1/categories','GET',null,true);
    }

    pedir_presentismo_general(fun,desde,hasta,categoria,agrupamiento,secretaria){
        let datos = {
            from_date:desde, 
            to_date:hasta,
            secretariat:secretaria,
            category:categoria,
            group:agrupamiento,
        }
        console.log(datos)
        this.enviarPeticion(fun,'api/0.1/attendance/presentism','POST',datos,true);
    }

    pedir_presentismo_general_excel(fun,desde,hasta,categoria,agrupamiento,secretaria){
        let datos = {
            from_date:desde, 
            to_date:hasta,
            secretariat:secretaria,
            category:categoria,
            group:agrupamiento,
        }
        console.log(datos)
        this.enviarPeticion(fun,'api/0.1/attendance/presentism/excel','POST',datos,true);
    }

    pedir_datos_usuario(fun,usuario){
        this.enviarPeticion(fun,'api/0.1/user/levels/'+usuario,'GET',null)
    }

    crear_usuario(fun,usuario,contra){
        this.enviarPeticion(fun,'api/0.1/users','POST',{username:usuario,password:contra})
    }

    pedir_usuarios(fun){
        this.enviarPeticion(fun,'api/0.1/users','GET',null,true)
    }

    eliminar_permiso_usuario(fun,usuario,permiso){
        this.enviarPeticion(fun,'api/0.1/user/levels/delete','POST',{level:permiso,user_id:usuario},true,true)
    }

    agregar_permiso_usuario(fun,usuario,permiso){
        this.enviarPeticion(fun,'api/0.1/user/levels/add','POST',{level:permiso,user_id:usuario},true,true)
    }

    pedir_horas_extras_empleados(fun,inicio,fin){
        this.enviarPeticion(fun,'api/0.1/overtime/list/dependencies','POST',{initial_date:inicio,end_date:fin},true);
    }

    pedir_horas_extras_dependencias(fun,datos){
        this.enviarPeticion(fun,'api/0.1/overtime/dependencies','POST',{
            initial_date:datos.desde,
            end_date:datos.hasta},true);
    }

    pedir_dependencias_jurisdiccion(fun,juri){
        this.enviarPeticion(fun,'api/0.1/dependencies/'+juri,'GET',null,false)
    }

    pedir_limite_secretarias(fun){
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();
        this.enviarPeticion(fun,'api/0.1/budget/secretariat/'+anio+'/'+mes,'GET',null,true);
    }

    pedir_horas_extras(fun,datos){
        this.enviarPeticion(fun,'api/0.1/overtime/jurisdiction','POST',{
            initial_date:datos.desde,
            end_date:datos.hasta},true);
    }
    

    actualizar_presencia(fun,datos){
        let dic = {old_check_in:datos.original[0],
        old_check_out:datos.original[1],
        check_in:datos.registro[0],
        check_out:datos.registro[1]};
        this.enviarPeticion(fun,'api/0.1/attendance/'+ datos.legajo + '/update','POST',dic,true);
    }

    borrar_presencia(fun,datos){
        let dic = {check_in:datos.original[0].replace('T',' '),
        check_out:datos.original[1].replace('T',' ')};
        console.log(dic);
        this.enviarPeticion(fun,'api/0.1/attendance/'+ datos.legajo + '/delete','POST',dic,true);
    }

    pedir_horas_extras_empleado(fun,datos){
        this.enviarPeticion(fun,'api/0.1/overtime/employee/'+datos.legajo,'POST',{
            initial_date:datos.desde,
            end_date:datos.hasta},true);
    }

    pedir_historial_presentismo(fun,datos){
        this.enviarPeticion(fun,'api/0.1/attendance/'+datos.legajo,'POST',{from_date:datos.from_date,to_date:datos.to_date},true);
    }

    pedir_asistentes(fun){
        this.enviarPeticion(fun,'api/0.1/attendance/working','GET',null,true);
    }

    pedir_planillones(fun){
        this.enviarPeticion(fun,'api/0.1/buildings','GET',null,true);
    }

    guardar_planillon(fun,id,descripcion){
        this.enviarPeticion(fun,'api/0.1/buildings','PUT',{building_id:id,description:descripcion})
    }

    guardar_horario(fun,datos,legajo){
        this.enviarPeticion(fun,'api/0.1/schedule/'+legajo,'POST',datos,true);
    }

    borrar_horario(fun,legajo,edificio,validoDesde){
        this.enviarPeticion(fun,'api/0.1/schedule/'+legajo+'/'+edificio+'?valid_from=\''+encodeURIComponent(validoDesde.split('T')[0]+'\''),'DELETE')
    }

    pedir_horarios_persona(fun,legajo){
        this.enviarPeticion(fun,'api/0.1/schedule/'+legajo,'GET',null,true);
    }

    actualizar_articulo(fun,datos){
        this.enviarPeticion(fun,'api/0.1/articles/'+datos.code,'PUT',datos,true);
    }

    pedir_planillones(fun){
        this.enviarPeticion(fun,'api/0.1/buildings','GET',null,true);
    }

    pedir_articulo(fun,articulo){
        this.enviarPeticion(fun,'api/0.1/articles/'+articulo,'GET',null,true);
    }

    pedir_articulos(fun){
        this.enviarPeticion(fun,'api/0.1/articles','GET',null,false);
    }

    pedir_nombre(fun,legajo){
        this.enviarPeticion(fun,'api/0.1/employee/'+legajo+'/name','GET',null,true);
    }

    pedir_gastos_dependencias(fun,desde,hasta){
        this.enviarPeticion(fun,'api/0.1/overtime/dependencies','POST',{initial_date:desde,end_date:hasta},true);
    }

    pedir_dependencias_limite(fun){
        //this.enviarPeticion((datos)=>(console.log(datos)),'api/0.1/dependencies','GET');
        //this.enviarPeticion((datos)=>(console.log(datos)),'api/0.1/overtime','GET',{'initial_date':'20071009','end_date':'20081019'},true);
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();
        this.enviarPeticion(fun,'api/0.1/budget/dependencies/'+anio+'/'+mes,'GET',null,true);
    }

    pedir_gasto_dependencia(fun,dependencia,inicio,final){
        this.enviarPeticion(fun,'api/0.1/overtime/dependencies/' + dependencia,'POST',
        {initial_date:inicio,end_date:final},true,true);
    }

    pedir_gasto_secretaria(fun,secretaria,inicio,final){
        this.enviarPeticion(fun,'api/0.1/overtime/jurisdiction/' + secretaria,'POST',
        {initial_date:inicio,end_date:final},true,true);
    }

    pedir_dependencias(fun){
        this.enviarPeticion(fun,'api/0.1/dependencies/all','GET');
    }

    bloquear_dependencia(fun,codigo){
        this.enviarPeticion(fun,'api/0.1/dependencies/blacklist','POST',{'blacklist':[codigo]})
    }
    desbloquear_dependencia(fun,codigo){
        this.enviarPeticion(fun,'api/0.1/dependencies/unblacklist','POST',{'blacklist':[codigo]})
    }

    pedir_todas_las_dependencias(fun){
        this.enviarPeticion(fun,'api/0.1/dependencies/all','GET');
    }

    pedir_dependencias_bloqueadas(fun){
        this.enviarPeticion(fun,'api/0.1/dependencies/blacklisted','GET');
    }

    crear_articulo(fun,datos){
        this.enviarPeticion(fun,'api/0.1/articles','POST',datos);
    }

    pedir_usuario(fun,us,pas){
        this.enviarPeticion(fun,'api/0.1/login','POST',{'username':us,'password':pas},true,false)
    }

    enviarPeticion(fun,url,metodo,datos,asinc=true,credenciales=true){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                
                if (fun != null){
                    if (this.responseText.length > 0){
                        fun(JSON.parse(this.responseText));
                    }

                    else{
                        fun();
                    }
                }
            }
            if(this.status == 400){
                console.log(this.responseText);
            }
            if(this.status == 401){
                console.log(this.responseText);
            }
            if(this.status === 404){
                console.log(this.responseText)
            }
        };

        let host = this.HOST;
        if (window.location.href.indexOf(this.HOST) < 0){
            host = this.HOSTRAFAM;
        }


        request.open(metodo,"http://"+host+this.PORT+"/"+url,asinc);
        var datosFinales = {};
        if(credenciales){
            let cont = document.getElementById('main');
            request.setRequestHeader('auth_token',document.cookie.split(';')[0].substring(11));
            request.setRequestHeader('username',document.cookie.split(';')[1].split('=')[1]);
        }
        
        if (datos){
            request.setRequestHeader('Content-type','application/json');
            request.send(JSON.stringify(datos));
            
        }

        else {request.send();}
    }
}