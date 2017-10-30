import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,AutoComplete,DatePicker} from 'material-ui';
import dbHandler from '../DBHandler.js';


export default function main(props){
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
            anio:'',
            legajo:'',
            persona:'',
            cant:'',
            nota:'',
            motivo:''
        }

        this.pedirPersona = this.pedirPersona.bind(this);
        this.depurar = this.depurar.bind(this);
        this.actualizarValor = this.actualizarValor.bind(this);
        this.limpiar = this.limpiar.bind(this);


    }

    pedirPersona(){

    }

    depurar(){

    }

    actualizarValor(evento){
        let campo = evento.target.name;
        let valor = evento.target.value;
        this.setState({[campo]:valor});
    }

    limpiar(){
        main();
    }

    
    render(){

        return(
            <div style={{width:'350px'}}>
                <TextField floatingLabelText={<label>Corresponde al Año</label>} type='number' name='anio' onChange={this.actualizarValor} />
                <br/>
                <TextField floatingLabelText={<label>Legajo Nº</label>} name='legajo' onChange={this.actualizarValor} style={{width:'80px'}}/>
                <TextField floatingLabelText={<label>Nombre y Apellido</label> } value={this.state.persona} />
                <br/>
                <TextField onChange={this.actualizarValor} floatingLabelText={<label>Cantidad Generada</label>} type='number' name='cant'/>
                <br/>
                <TextField onChange={this.actualizarValor} floatingLabelText={<label>Nota</label>} name='nota'  />
                <br/>
                <TextField onChange={this.actualizarValor} floatingLabelText={<label>Motivo</label>} name='motivo' />
                <div style={{marginTop:'20px'}}>
                    <RaisedButton label='Limpiar' onClick={this.limpiar} backgroundColor='#00bfa5' labelColor='#ffffff'/>
                    <RaisedButton label='Modificar' style={{float:'right'}} primary={true} />
                </div>
            </div>
        )

    }



}