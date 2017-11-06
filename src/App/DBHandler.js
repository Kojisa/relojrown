export default class DBHandler{
    
    PORT = ":8000";// ":8000";
    HOST = 'localhost'//"172.20.0.3";

    RUTABASICA = 'api/0.1/'

    actualizar_limite(fun,datos){

        let fecha = new Date();
        let anio = fecha.getFullYear();
        let mes = fecha.getMonth()+ 1;
        mes = mes + (1 * datos.repeticion);
        if(mes > 12){
            mes = mes - 12;
            anio += 1;
        }
        let armarDatos = {
            'dependence_id':datos.codigo,
            'amount':datos.nuevo,
            'year': anio,
            'month':mes,
        }
        if(datos.repeticion == 12){
            this.enviarPeticion(fun,'api/0.1/budget','POST',armarDatos,true);
        }
        
        else{
            datos['repeticion'] += 1;
            this.enviarPeticion(()=>{this.actualizar_limite(fun,datos)},'api/0.1/budget','POST',armarDatos,true);
        }
    }

    pedir_planillones(fun){
        this.enviarPeticion(fun,'api/0.1/buildings','GET',null,true);
    }

    guardar_planillon(fun,id,descripcion){
        this.enviarPeticion(fun,'/api/0.1/buildings','PUT',{building_id:id,description:descripcion})
    }

    guardar_horario(datos,legajo){
        this.enviarPeticion((datos)=>(console.log(datos)),'api/0.1/schedule/'+legajo,'POST',datos,true);
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

    pedir_dependencias_limite(fun){
        //this.enviarPeticion((datos)=>(console.log(datos)),'api/0.1/dependencies','GET');
        //this.enviarPeticion((datos)=>(console.log(datos)),'api/0.1/overtime','GET',{'initial_date':'20071009','end_date':'20081019'},true);
        let fecha = new Date();
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();
        this.enviarPeticion(fun,'api/0.1/budget/'+anio+'/'+mes,'GET',null,true);
    }

    pedir_dependencias(fun){
        this.enviarPeticion(fun,'api/0.1/budget/dep_status/'+2017+'/'+9,'GET');
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
        };
        request.open(metodo,"http://"+this.HOST+this.PORT+"/"+url,asinc);
        var datosFinales = {};
        if(credenciales){
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