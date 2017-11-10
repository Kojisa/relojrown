import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,List,ListItem,Divider} from 'material-ui';
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
        }

        this.db = new DBHandler();
        this.actualizar = this.actualizar.bind(this);
        this.pedirNombre = this.pedirNombre.bind(this);
        this.pedirHistorial = this.pedirHistorial.bind(this);
        this.cargarHistorial = this.cargarHistorial.bind(this);
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

    cargarHistorial(){

        let lista = this.state.horarios;

        return lista.map((elem,index)=>(
            <Linea entrada={elem[0]} salida={elem[1]} key={index}></Linea>
        ))
    }

    pedirHistorial(){
        this.db.pedir_historial_presentismo((datos)=>{
            console.log(datos);
            this.setState(
            {horarios:datos.attendance}
        )},{legajo:this.state.legajo,from_date:this.state.desde,to_date:this.state.hasta});
    }

    render(){

        return(
            <Paper style={{display:'inline-block'}} >
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


class VistaHorarios extends Component{

    constructor(props){
        super(props);
        this.state={
            
        }
    }
}