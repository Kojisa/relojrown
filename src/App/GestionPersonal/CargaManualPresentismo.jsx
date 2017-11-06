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
    }
    
    actualizar(evento){
        this.setState({
                [evento.target.name]:evento.target.value
            })
    }

    enviarHorario(){

    }


    render(){

        return(
            <Paper style={{width:'350px'}} >
                <div style={{margin:'5px'}}>
                    <TextField floatingLabelText={ <label htmlFor="">Nº Legajo</label> } value={this.state.legajo} onChange={this.actualizar}
                    name='legajo'/>
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