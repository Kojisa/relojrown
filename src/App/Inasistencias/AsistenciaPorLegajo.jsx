import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,List,ListItem,Divider,Tabs,Tab} from 'material-ui';
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
        this.state={
            legajo:'',
            nombre:'',
            desde:'',
            hasta:'',
            horarios:[],
            planilloness:[],
            itinerario:[],
            horasExtras:[],
        }

        this.db = new DBHandler();
        this.actualizar = this.actualizar.bind(this);
        this.pedirNombre = this.pedirNombre.bind(this);
        this.pedirHistorial = this.pedirHistorial.bind(this);
        this.cargarHistorial = this.cargarHistorial.bind(this);
        this.pedirHorarios = this.pedirHorarios.bind(this);
        this.cargarHorarios = this.cargarHorarios.bind(this);
    }

    componentDidMount(){
        this.db.pedir_planillones((datos)=>{this.setState({planillones:datos.buildings})})
    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value,
        })
    }

    pedirNombre(){
        this.db.pedir_nombre((datos)=>{this.setState({
            nombre:datos.name
        })},this.state.legajo);
    }

    pedirHorasExtras(){
        this.db.pedir_horas_extras_empleado((datos)=>(this.setState({horasExtras:datos.overtimes})),{
            desde:this.state.desde,
            hasta:this.state.hasta,
            legajo:this.state.legajo,
        })
    }

    pedirHorarios(){
        this.db.pedir_horarios_persona(this.cargarHorarios,this.state.legajo)
    }

    cargarHorarios(datos){
        for (let  x = 0; x < datos.schedules.length; x++){
            datos.schedules[x]['nuevo'] = false;
            datos.schedules[x]['modificado'] = false;
            datos.schedules[x].valid_to = datos.schedules[x].to_date;
            datos.schedules[x].valid_from = datos.schedules[x].from_date;
            
        }  
        this.setState({itinerario:datos.schedules},this.pedirHorasExtras);
    }

    cargarHistorial(){

        let lista = this.state.horarios;
        return lista.map((elem,index)=>(
            <Linea entrada={elem[0]} salida={elem[1]} key={index}></Linea>
        ))
    }

    pedirHistorial(){
        this.db.pedir_historial_presentismo((datos)=>{
            this.setState(
            {horarios:datos.attendance},this.pedirHorarios
        )},{legajo:this.state.legajo,from_date:this.state.desde,to_date:this.state.hasta});
    }

    render(){
        let horarios = null;
        if(this.state.horarios.length > 0){
            horarios = <Horarios  horarios={this.state.itinerario} planillones={this.state.planillones}/>
        }
        let extras = null;
        if(this.state.horasExtras.length > 0){
            extras = <HorasExtras extras={this.state.horasExtras}/>
        }

        return(
            <div>
                <Paper style={{display:'inline-block',verticalAlign:'top'}} >
                    <div style={{margin:'5px',marginBottom:'10px'}} >
                        <TextField floatingLabelText={ <label htmlFor="">Legajo</label> } value={this.state.legajo} 
                        name='legajo' onChange={this.actualizar} onBlur={this.pedirNombre}></TextField>
                        <TextField floatingLabelText={ <label htmlFor="">Nombre</label> } disabled 
                        name='nombre' value={this.state.nombre} ></TextField>
                        <br/>
                        <TextField value={this.state.desde} floatingLabelText={ <label htmlFor="">Desde</label> } 
                        onChange={this.actualizar} name='desde' type='date' floatingLabelFixed={true} ></TextField>
                        <TextField value={this.state.hasta} floatingLabelText={ <label htmlFor="">Hasta</label> }
                        onChange={this.actualizar} name='hasta' type='date' floatingLabelFixed={true}></TextField>
                        <br/>
                        <RaisedButton label='Pedir Datos' onClick={this.pedirHistorial} ></RaisedButton>
                    </div>
                    {this.cargarHistorial()}
                    
                </Paper>
                <Paper style={{display:'inline-block',marginLeft:'10px',verticalAlign:'top'}} >
                    {horarios}
                </Paper>    
                <Paper style={{display:'inline-block',marginLeft:'10px',verticalAlign:'top'}} >
                    {extras}
                </Paper> 
            </div>
        )
    }
}


class Linea extends Component{

    constructor(props){
        super(props);

        this.state={
            entrada:props.entrada,
            salida:props.salida,
        }

        this.armarFecha = this.armarFecha.bind(this);

    }

    componentWillReceiveProps(props){
        this.setState({
            entrada:props.entrada,
            salida:props.salida,
        })
    }

    armarFecha(horario){
        let fecha = horario.split('T')[0];
        let anio = fecha.substring(0,4);
        let mes = fecha.substring(5,7);
        let dia = fecha.substring(8,10);
        return dia + "/" + mes + "/" + anio;
    }

    render(){

        return(
            <div style={{marginBottom:'10px'}}>
                
                <label htmlFor="">Entrada:</label>
                <label htmlFor="">{this.armarFecha(this.state.entrada)}</label>
                <label htmlFor="" style={{marginLeft:'5px'}} >Horario:</label>
                <label htmlFor="">{this.state.entrada.split('T')[1]}</label>
                <br/>
                <label htmlFor="">Salida:</label>
                <label htmlFor="">{this.armarFecha(this.state.salida)}</label>
                <label htmlFor="" style={{marginLeft:'5px'}} >Horario:</label>
                <label htmlFor="">{this.state.salida.split('T')[1]}</label>
                <br/>
                <Divider></Divider>
            </div>
        )
    }
}

class Horarios extends Component{
    
    constructor(props){
        super(props);

        let planillones = props.planillones;
        if(planillones){
            planillones = planillones.sort((a,b)=>(a[0]-b[0]));
        }
        this.state={
            horarios:props.horarios, //formato clave = dependencia, lista de horarios
            planillones:planillones,
            
        }
        this.actualizarHorario = props.funAct;
        this.habilitarPlanillones = props.habilitarPlanillones;
        this.funAgregar = props.funAgregar;
    }
    

    cargarPlanillones(){
        let lista = [];
        for (let x = 0; x < this.state.horarios.length; x++){
            let tab = (<Tab label={this.state.planillones[parseInt(this.state.horarios[x].building) -1 ][1]} key={x} value={this.state.horarios[x].building}> 
                <HorarioSemanal funAct={this.actualizarHorario} semana={this.state.horarios[x].schedule} desde={this.state.horarios[x].valid_from}
                hasta={this.state.horarios[x].valid_to} orden={x} dependencia={this.state.horarios[x].building}
                nuevo={this.state.horarios[x].nuevo} modificado={this.state.horarios[x].modificado} />
            </Tab>);
            lista.push(tab);
        }
        return lista;

    }

    componentWillReceiveProps(props){
        
        let planillones = props.planillones;
        if(planillones){
            planillones = planillones.sort((a,b)=>(a[0]-b[0]));
        }
        this.setState({horarios:props.horarios,planillones:props.planillones});
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

class HorasExtras extends Component{
    constructor(props){
        super(props);
        this.state={
            extras:props.extras
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            extras:props.extras
        })
    }

    cargarHorasExtras(){
        let horas = this.state.extras;
        let lineas = []
        for (let x = 0; x < horas.length; x++){
            
            let texto = '';
            if(horas[x].hour_type === '50%'){
                texto = 'Horas al 50%: ';
            }
            
            if(horas[x].hour_type === '50%N'){
                texto = 'Nocturnidad al 50%: ';
            }

            if(horas[x].hour_type === '100%'){
                texto = 'Horas al 100%: ';
            }
            
            if(horas[x].hour_type === '100%N'){
                texto = 'Nocturnidad al 1000%: ';
            }

            let linea = <span>{texto} {horas[x].acumulated_hours}</span>
            lineas.push(linea);
            lineas.push(<br/>);
        }
        return lineas;
    }

    render(){

        return(
            <Paper style={{width:'300px'}}>
                <span style={{fontSize:'18px'}}> <b>Horas Extras del periodo seleccionado</b> </span>
                <span>(En horas)</span>
                <br/>
                {this.cargarHorasExtras()}
            </Paper>
        )
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
        let hora = parseInt(string[0]+string[1]) * 60;
        let minutos = parseInt(string[3]+string[4]);
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
        if(numero >= 1440){
            numero = numero - 1440;
        }
        let hora = (numero/60).toString().split('.');
        
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
        let dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo','Feriado']
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
                <TextField value={entrada}  name={elem.toLowerCase()} type='time' style={{width:'80px'}}/>
                <label htmlFor="" style={{width:40,display:'inline-block'}}>-</label>
                <TextField value={salida}  name={elem.toLowerCase()} type='time' style={{width:'80px'}}/>
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
                 name='desde' type='date' style={{width:145}} />
                <TextField floatingLabelText={ <label htmlFor="">Hasta</label> } value={this.state.hasta}
                 name='hasta' type='date'  style={{width:145}} />
                <br/>
                {this.generarSemana()}
            </div>
        )

    }
}






class VistaHorarios extends Component{

    constructor(props){
        super(props);
        this.state={
            
        }
    }
}