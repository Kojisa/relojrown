import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,SelectField,
    MenuItem,Checkbox,RadioButton,RadioButtonGroup,
    Tab,Tabs,AutoComplete} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';

export default function main(){
    let root = document.getElementById('main');
    root.limpiar();

    ReactDOM.render(
        <div style={{margin:"30px"}}>
            <MUICont>
                <Contenedor/>
            </MUICont>
        </div>,
        root
    )
} 



class Contenedor extends Component{

    constructor(props){
        super(props);

        this.state ={
            legajo:'',
            persona:'',//nombre asociado al legajo
            tipoAsistencia:null,
            anios25:false,
            premio:null,
            dependencia:'',
            horarios:[],
            planillones:[],
            cambioAnios:false,
            cambioTipoAsist:false,
            cambioPremio:false,
            cambioHorarios:false,
            cambiodependencia:false,


        }
        this.actualizarDatos = this.actualizarDatos.bind(this);
        this.actualizarHorarios = this.actualizarHorarios.bind(this);
        this.cargarPlanillones = this.cargarPlanillones.bind(this);
        this.cargarHorarios = this.cargarHorarios.bind(this);
        this.pedirDatos = this.pedirDatos.bind(this);
        this.agregarPlanillon = this.agregarPlanillon.bind(this);
        this.enviarDatos = this.enviarDatos.bind(this);

        this.db = new DBHandler();
        
        this.db.pedir_planillones(this.cargarPlanillones);
    }

    agregarPlanillon(planillon){
        let horarios = this.state.horarios;
        horarios.push({
            schedule:{},
            valid_to:'',
            valid_from:'',
            building:planillon,
            nuevo:true,
            modificado:true,

        })
        this.setState({horarios:horarios,cambioHorarios:true});
    }

    cargarHorarios(datos){
        console.log(datos);
        for (let  x = 0; x < datos.schedules.length; x++){
            datos.schedules[x]['nuevo'] = false;
            datos.schedules[x]['modificado'] = false;
            datos.schedules[x].valid_to = datos.schedules[x].to_date;
            datos.schedules[x].valid_from = datos.schedules[x].from_date;
            
        }  
        this.setState({horarios:datos.schedules,
        cambioHorarios:false});
    }

    cargarPlanillones(datos){
        this.setState({planillones:datos.buildings});
    }

    actualizarDatos(dato,campo){
        if(campo == 'legajo'){
            this.setState({
                legajo:dato,
                persona:'',//nombre asociado al legajo
                tipoAsistencia:null,
                anios25:false,
                premio:null,
                dependencia:'',
                horarios:[],
                planillones:[],
                cambioAnios:false,
                cambioTipoAsist:false,
                cambioPremio:false,
                cambioHorarios:false,
                cambiodependencia:false,
            })
        }
        else{
            this.setState({[campo]:dato});
        }
    }

    pedirDatos(){
        if(this.state.legajo != ''){
            this.db.pedir_horarios_persona(this.cargarHorarios,this.state.legajo);
            this.db.pedir_nombre((dato)=>(this.setState({persona:dato.name})),this.state.legajo)
        }
    }

    actualizarHorarios(pos,info){
        let horarios = this.state.horarios;
        horarios[pos] = info;
        this.setState({
            horarios:horarios,
            cambioHorarios:true
        });
    }

    enviarDatos(){
        if(this.state.cambioHorarios){
            let horarios = this.state.horarios;
            for(let x = 0; x < horarios.length; x++){
                if(horarios[x]['nuevo']){
                    let dic={
                        building:horarios[x].building,
                        schedule:horarios[x].schedule,
                        valid_from:horarios[x].valid_from,
                        valid_to:horarios[x].valid_to,
                    }
                    this.db.guardar_horario(dic,this.state.legajo);

                }
            }
        }
    }

    render(){
        let horarios = null;
        
        horarios = <Horarios horarios={this.state.horarios} planillones={this.state.planillones}
        funAct={this.actualizarHorarios} funAgregar={this.agregarPlanillon}/>
        
        

        return (
            <div >
                <div style={{display:'inline-block',margin:'5px'}}>
                    <DatosBasicos funAct={this.actualizarDatos} 
                    pedirDatos={this.pedirDatos}
                    persona={this.state.persona}
                    tipoAsistencia={this.state.tipoAsistencia}
                    anios25={this.state.anios25}
                    premio={this.state.premio}
                    legajo={this.state.legajo}
                    dependencia={this.state.dependencia}
                    />
                </div>
                <div style={{display:'inline-block',margin:'5px',verticalAlign:'top'}}>
                    {horarios}
                </div>
                <div style={{float:'bottom',margin:'5px'}}>
                <RaisedButton label={<label>Actualizar Perfil</label>} primary={true} onClick={this.enviarDatos}/>
                </div>
            </div>
        )
    }
}



class DatosBasicos extends Component{

    constructor(props){
        super(props);
        this.state = {
            legajo:props.legajo,
            persona:props.persona,
            tipoAsistencia:props.tipoAsistencia,
            anios25:props.anios25,
            premio:props.premio,
            dependencia:props.dependencia,
            dependencias:[],
            dependenciasCodigo:{},
            codigoDependencias:{},
        }
        this.actualizarPadre = props.funAct;
        this.pedirDatos = props.pedirDatos;
        this.cargarDependencias = this.cargarDependencias.bind(this);
        this.actualizarDatos = this.actualizarDatos.bind(this);
        this.actualizarTipoAsist = this.actualizarTipoAsist.bind(this);
        this.actualizarCheck = this.actualizarCheck.bind(this);
        this.actualizarPremio = this.actualizarPremio.bind(this);
        this.buscarNombre = this.buscarNombre.bind(this);
        this.db = new DBHandler();

        this.db.pedir_todas_las_dependencias(this.cargarDependencias)
    }

    componentWillReceiveProps(props){
        this.setState({persona:props.persona,
            tipoAsistencia:props.tipoAsistencia,
            anios25:props.anios25,
            premio:props.premio,
            dependencia:props.dependencia})
    }

    cargarDependencias(datos){
        let listaFinal = [];
        let dependenciasCodigo = {};
        let codigoDependencias = {};
        for (let x = 0; x < datos.dependencies.length; x++){
            listaFinal.push(datos['dependencies'][x][1]);
            dependenciasCodigo[datos['dependencies'][x][1]] = datos['dependencies'][x][0]; //para tener la referencia de que rependencia es.
            codigoDependencias[datos['dependencies'][x][0]] = datos['dependencies'][x][1];
        }
        this.setState({dependencias:listaFinal,dependenciasCodigo:dependenciasCodigo,codigoDependencias:codigoDependencias});
    }


    actualizarDatos(evento){

        let campo = evento.target.name;
        let dato = evento.target.value;
        this.actualizarPadre(dato,campo);
    }

    generarTiposAsistencia(){
        let tipos = ['S','N','B'];

        return tipos.map((elem,index)=>(<MenuItem value={elem} primaryText={elem} key={elem}/>))
    }

    buscarNombre(){
        this.pedirDatos();
        //let db = new DBHandler();
        //db.pedir_nombre((dato)=>(this.setState({persona:dato.name})),this.state.legajo)
    }

    actualizarTipoAsist(evento,key,valor){
        this.actualizarPadre(valor,'tipoAsistencia');
    }

    actualizarCheck(evento, checked){
        this.actualizarPadre(checked,'anios25');

    }

    actualizarPremio(valor){
        this.actualizarPadre({'premio':valor});
    }

    render(){

        let dependencia = null;
        if(this.state.dependencias.length != 0){
            dependencia = <AutoComplete floatingLabelText={ <label htmlFor="">Dependencia(Horas Extras)</label> } 
            searchText={this.state.dependencia} dataSource={this.state.dependencias} filter={AutoComplete.caseInsensitiveFilter} 
            />
        }

        return(
            <div style={{width:'350px',display:'inline-block'}} >
                <div style={{marginLeft:'15px'}}>
                    <TextField floatingLabelText={<label>Legajo Nº</label>} onBlur={this.buscarNombre} onChange={this.actualizarDatos} name='legajo' type='number' style={{width:'150px'}} />
                    <TextField value={this.state.persona} floatingLabelText={<label>Nombre y Apellido</label>} disabled />
                    <br/>
                    <SelectField value={this.state.tipoAsistencia} floatingLabelText={<label>Registra Asistencia</label>} onChange={this.actualizarTipoAsist} >
                        {this.generarTiposAsistencia()}
                    </SelectField>
                    <br/>
                    <Checkbox label={<label>25 Años de servicio: </label>} checked={this.state.anios25} onCheck={this.actualizarCheck}
                     labelPosition='left' style={{paddingTop:'10px'}} />
                    <br/>
                    {dependencia}
                    <Premio funAct={this.actualizarPremio} premio={this.state.premio} />
                </div>
            </div>
        )
    }
}


class Premio extends Component{

    constructor(props){
        super(props);
        this.state={
            elegido:props.premio
        }
        
    }

    componentWillReceiveProps(props){
        this.setState({'elegido':props.premio})
    }

    render(){

        return(
            <div>
                <label >Estado De Premio </label>
                <RadioButtonGroup name='premio' labelPosition='left' style={{marginTop:'15px'}} valueSelected={this.state.elegido}>
                    <RadioButton value='a' label='Premio A'/>
                    <RadioButton value='b' label='Premio B'/>
                    <RadioButton value='no' label='No cobra premio'/>
                    <RadioButton value='excento' label='Excento de premio'/>
                    <RadioButton value='descuento' label='Descuento'/>
                    <RadioButton value='sinliq' label='Sin liquidacion'/>
                </RadioButtonGroup>
            </div>
        )
    }

}


class Horarios extends Component{
    
    constructor(props){
        super(props);
        this.state={
            horarios:props.horarios, //formato clave = dependencia, lista de horarios
            planillones:props.planillones,
            
        }
        this.actualizarHorario = props.funAct;
        this.habilitarPlanillones = props.habilitarPlanillones;
        this.funAgregar = props.funAgregar;
    }
    

    agregarPlanillon(){
    }

    cargarPlanillones(){
        let lista = [];
        for (let x = 0; x < this.state.horarios.length; x++){
            let tab = (<Tab label={this.state.horarios[x].building} key={x} value={this.state.horarios[x].building}> 
                <HorarioSemanal funAct={this.actualizarHorario} semana={this.state.horarios[x].schedule} desde={this.state.horarios[x].valid_from}
                hasta={this.state.horarios[x].valid_to} orden={x} dependencia={this.state.horarios[x].building}
                nuevo={this.state.horarios[x].nuevo} modificado={this.state.horarios[x].modificado} />
                <br/>
                <RaisedButton label={<label>Eliminar Planillon</label>} secondary={true} style={{float:'right'}} />
            </Tab>);
            lista.push(tab);
        }
        lista.push(<Tab onActive={this.agregarPlanillon} label={<lable>+</lable>} key='+'  > <AgregarPlanillon funAgregar={this.funAgregar}/> </Tab>);
        return lista;

    }

    componentWillReceiveProps(props){
        this.setState({horarios:props.horarios});
    }

    render(){
        return(
            <div style={{width:'350px'}}>
                <Tabs>
                    {this.cargarPlanillones()};
                </Tabs>
            </div>
        );
    }

}


class HorarioSemanal extends Component{
    constructor(props){
        super(props);
        this.state={
            semana:props.semana,
            dependencia:props.dependencia,
            desde:props.desde.split('T')[0],
            hasta:props.hasta.split('T')[0],
            orden:props.orden,
            modificado:props.modificado,
            nuevo:props.nuevo
        }
        this.actualizarHorario = props.funAct;
        this.cambiarIngreso = this.cambiarIngreso.bind(this);
        this.cambiarSalida = this.cambiarSalida.bind(this);
        this.actualizarFechas = this.actualizarFechas.bind(this);
        this.actualizarPadre = this.actualizarPadre.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            semana:props.semana,
            dependencia:props.dependencia,
            desde:props.desde.split('T')[0],
            hasta:props.hasta.split('T')[0],
            orden:props.orden,
            modificado:props.modificado,
            nuevo:props.nuevo
            
        })
    }

    actualizarPadre(estado){
        let dic = {
            schedule:estado.semana,
            valid_to:estado.hasta,
            valid_from:estado.desde,
            building:estado.dependencia,
            modificado:true,
            nuevo:estado.nuevo,
        }
        this.actualizarHorario(this.state.orden,dic);
    }

    pasarHoraNumero(string){
        let hora = parseInt(string[0]+string[1]);
        let minutos = parseInt(string[3]+string[4]);
        minutos = (minutos/60)
        let final = hora + minutos;
        final = final.toFixed(2);
        return final;
    }


    actualizarFechas(evento){
        let estado = this.state;
        estado[evento.target.name]=evento.target.value;
        this.actualizarPadre(estado);
    }

    cambiarIngreso(evento){
        let dato = evento.target.value;
        let indice = evento.target.name;

        let horarios = this.state.semana;
        if(! (indice in horarios) ){
            horarios[indice]=[,];
        }
        
        horarios[indice][0] = this.pasarHoraNumero(dato);
        let estado = this.state;
        estado.semana = horarios;
        this.actualizarPadre(estado);


    }
    cambiarSalida(evento){
        let dato = evento.target.value;
        let indice = evento.target.name;

        let horarios = this.state.semana;
        if(! (indice in horarios) ){
            horarios[indice]=[,];
        }
        horarios[indice][1] = this.pasarHoraNumero(dato);
        let estado = this.state;
        estado.semana = horarios;
        this.actualizarPadre(estado);

    }

    transformarHora(numero){
        if(!numero){return ''}
        let horaFinal = '';
        let hora = numero.toString().split('.');
        
        if(hora[0].length == 1){
            horaFinal ='0' + hora[0];
        }
        else if(hora[0].length == 2){
            horaFinal = hora[0]
        }
        if(hora.length === 1){
            horaFinal += ':00';
        }
        else{
            let minutos = parseFloat('0.'+hora[1]);
            minutos = (60*(minutos)).toFixed(0).toString();
            if(minutos.length == 1){
                minutos = '0'+minutos;
            }
            horaFinal += ':' + minutos;
        }
        return horaFinal;


    }

    generarSemana(){
        let datos = this.state.semana;
        let dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo','Feriados']
        if(!datos) return;
        let lista = dias.map((elem,index)=>{
            let entrada = '';
            let salida = '';
           
            if(elem.toLocaleLowerCase() in datos){
                
                entrada = this.transformarHora(datos[elem.toLocaleLowerCase()][0]);
                salida = this.transformarHora(datos[elem.toLocaleLowerCase()][1]);
                
            }
            return(<div style={{width:'350px', marginLeft:'5px'}} key={index.toString()} >
                <span style={{width:'100px',display:'inline-block'}} >{dias[index]} :</span>
                <TextField value={entrada} onChange={this.cambiarIngreso} name={elem.toLowerCase()} type='time' style={{width:'80px'}}/>
                <label htmlFor="" style={{width:40,display:'inline-block'}}>-</label>
                <TextField value={salida} onChange={this.cambiarSalida} name={elem.toLowerCase()} type='time' style={{width:'80px'}}/>
            </div>)   
        }
    )
        return lista;
    }


    render(){
        return(
            <div>
                <label htmlFor="">Valido: </label>
                <TextField floatingLabelText={ <label htmlFor="">Desde</label> } value={this.state.desde}
                onChange={this.actualizarFechas} name='desde' type='date' style={{width:145}} />
                <TextField floatingLabelText={ <label htmlFor="">Hasta</label> } value={this.state.hasta}
                onChange={this.actualizarFechas} name='hasta' type='date'  style={{width:145}} />
                <br/>
                {this.generarSemana()}
            </div>
        )

    }
}

class AgregarPlanillon extends Component{

    constructor(props){
        super(props);

        this.state={
            planillones:{},
            codigos:{},
            codigo:'',
            nombre:'',
        }

        this.agregarPlanillon = props.funAgregar;
        this.actualizarVariables = this.actualizarVariables.bind(this);
        this.db = new DBHandler();
        this.cargarPlanillones = this.cargarPlanillones.bind(this);
        this.generarPlanillon = this.generarPlanillon.bind(this);
        this.db.pedir_planillones(this.cargarPlanillones)
    }

    cargarPlanillones(datos){
        let planillones =datos.buildings;
        let nombres = {};
        let codigos = {};
        for (let x = 0; x < planillones.length; x++ ){
            nombres[planillones[x][1]]= planillones[x][0];
            codigos[planillones[x][0]] = planillones[x][1];
        }
        this.setState({
            planillones:nombres,
            codigos:codigos
        })
    }


    generarPlanillon(){
        this.agregarPlanillon(this.state.codigo);
    }

    actualizarVariables(evento){
        let campo = evento.target.name;
        let valor = evento.target.value;

        if(campo == 'codigo'){
            if(valor in this.state.codigos){
                this.setState({
                    codigo:valor,
                    nombre:this.state.codigos[valor]
                })
            }
            else{
                this.setState({
                    codigo:valor
                })
            }
        }
        else if(campo == 'nombre'){
            if(valor in this.state.planillones){
                this.setState({
                    codigo:this.state.planillones[valor],
                    nombre:valor
                })
            }
            else{
                this.setState({
                    nombre:valor,
                })
            }
        }

    }

    render(){
        return(
            <div style={{marginLeft:'5px',display:'inline-block'}}>
                <AutoComplete floatingLabelText={<label>Codigo Planillon</label>} searchText={this.state.codigo} name='codigo' type='text'
                onBlur={this.actualizarVariables} onNewRequest={(elegido,indice)=>{
                    let evento = {target:{name:'codigo',value:elegido}};
                    this.actualizarVariables(evento);
                }} dataSource={Object.keys(this.state.codigos).sort()}/>
                <AutoComplete floatingLabelText={<label>Planillon</label>} searchText={this.state.nombre} name='nombre' type='text'
                onBlur={this.actualizarVariables} onNewRequest={(elegido,indice)=>{
                    console.log(elegido);
                    console.log(indice);
                    let evento = {target:{name:'nombre',value:elegido}};
                    this.actualizarVariables(evento);
                }} dataSource={Object.keys(this.state.planillones).sort()}/>
                <br/>
                <RaisedButton label='Elegir' style={{float:'right'}} onClick={this.generarPlanillon}/>
            </div>
        )
    }

}