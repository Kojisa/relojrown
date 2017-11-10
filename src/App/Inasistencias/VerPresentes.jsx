import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,Divider} from 'material-ui';
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
            trabajando:[],
        }

        this.db = new DBHandler();
        this.pedirAsistentes = this.pedirAsistentes.bind(this);
        this.recibirPresentes = this.recibirPresentes.bind(this);
        this.cargarPresentes = this.cargarPresentes.bind(this);
    }

    cargarPresentes(){
        let lista = this.state.trabajando;
        if(lista.length === 0){
            return null;
        }
        return lista.map((elem,index)=>{return <Linea key={index} legajo={elem[0]} nombre={elem[2]}
        apellido={elem[1]} horario={elem[3]} ></Linea> })
    }


    recibirPresentes(datos){
        console.log(datos);
        this.setState({
            trabajando:datos.working
        })
    }

    pedirAsistentes(){
        this.db.pedir_asistentes(this.recibirPresentes)
    }

    render(){

        return(
            <Paper style={{width:'400px'}} >
                <div style={{marginBottom:'10px'}} >
                    <RaisedButton label='Actualizar' onClick={this.pedirAsistentes} ></RaisedButton>  
                </div>
                {this.cargarPresentes()}
            </Paper>
        )
    }
}


class Linea extends Component{

    constructor(props){
        super(props);
        this.state={
            legajo:props.legajo,
            nombre:props.nombre,
            apellido:props.apellido,
            horario:props.horario,
        }

    }

    componentWillReceiveProps(props){
        
        this.setState={
            legajo:props.legajo,
            nombre:props.nombre,
            apellido:props.apellido,
            horario:props.horario,
        }
        this.armarFecha = this.armarFecha.bind(this);
    }

    armarFecha(){
        let fecha = this.state.horario.split('T')[0];
        let anio = fecha.substring(0,4);
        let mes = fecha.substring(5,7);
        let dia = fecha.substring(8,10);
        return dia + "/" + mes + "/" + anio;
    }

    render(){

        return(
            <div style={{marginBottom:'10px'}}>
                <label htmlFor="" style={{width:'50px',display:'inline-block'}} >{this.state.legajo} - </label>
                <label htmlFor=""  >{this.state.apellido},</label>
                <label htmlFor=""  >{'' + this.state.nombre}</label>
                <br/>
                <label htmlFor="">Ingreso </label>
                <label htmlFor="" style={{marginLeft:'5px'}}> Fecha:</label>
                <label htmlFor="">{this.armarFecha()}</label>
                <label htmlFor="" style={{marginLeft:'5px'}}> Hora:</label>
                <label htmlFor="">{this.state.horario.split('T')[1]}</label>
                <Divider></Divider>
            </div>
        )
    }
}