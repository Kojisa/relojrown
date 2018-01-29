import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton} from 'material-ui';
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
            diaEntrada : '',
            diaSalida : '',
            horaEntrada : '',
            horaSalida : '',
        }
        this.actualizar = this.actualizar.bind(this);
        this.enviarHorario = this.enviarHorario.bind(this);
        this.cargarNombre = this.cargarNombre.bind(this);
        this.pedirNombre = this.pedirNombre.bind(this);
        this.db = new DBHandler();
    }
    
    actualizar(evento){
        this.setState({
                [evento.target.name]:evento.target.value
            })
    }

    cargarNombre(datos){
        this.setState({
            nombre:datos.name,
        })
    }

    pedirNombre(){
        this.db.pedir_nombre(this.cargarNombre,this.state.legajo)
    }

    enviarHorario(){
        let datos={
            check_in:this.state.diaEntrada + ' ' + this.state.horaEntrada,
            check_out:this.state.diaSalida + ' ' + this.state.horaSalida,
        }



        this.db.enviarPeticion(()=>{this.setState({diaEntrada : '',
        diaSalida : '',
        horaEntrada : '',
        horaSalida : '',})},'api/0.1/attendance/' + this.state.legajo +'/add','POST',
        datos,true,true)
    }


    render(){

        return(
            <Paper style={{width:'350px'}} >
                <div style={{margin:'5px'}}>
                    <TextField floatingLabelText={ <label htmlFor="">Nº Legajo</label> } value={this.state.legajo} onChange={this.actualizar}
                    name='legajo' onBlur={this.pedirNombre} />
                    <br/>
                    <TextField floatingLabelText={ <label htmlFor="">Nombre y Apellido</label> } value={this.state.nombre} name='nombre' 
                    floatingLabelFixed={true} disabled />
                    <br/>
                    Desde
                    <br/>
                    <TextField type='date' onChange={this.actualizar} name='diaEntrada' value={this.state.diaEntrada} style={{width:'140px'}} />
                    <TextField type='time' onChange={this.actualizar} name='horaEntrada' value={this.state.horaEntrada} style={{width:'100px'}} />
                    <br/>
                    Hasta
                    <br/>
                    <TextField type='date' onChange={this.actualizar} name='diaSalida' value={this.state.diaSalida} style={{width:'140px'}} />
                    <TextField type='time' onChange={this.actualizar} name='horaSalida' value={this.state.horaSalida} style={{width:'100px'}} />
                    <br/>

                    <RaisedButton label='Enviar' onClick={this.enviarHorario} primary={true} style={{float:'right'}}/>

                </div>
            </Paper>
        )
    }
}