import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,AutoComplete,DatePicker} from 'material-ui';
import dbHandler from '../DBHandler.js';

export default function main(props){
    let root = document.getElementById('main');
    root.limpiar();
    
    document.getElementById('titulo').innerText = 'Actualización de inasistencias';

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
        let articulos = props.articulos;
        let codigos = props.codigos;
        if(!articulos){
            articulos = {}
        }
        if(!codigos){
            codigos = {}
        }
        this.state={
            legajo:'',
            persona:'',
            articulo:'',
            nombreArt:'',
            desde:'',
            hasta:'',
            restantes:'',
            articulos:articulos,
            codigos:codigos

        }
        this.pedirArticulos = this.pedirArticulos.bind(this);
        this.pedirRestantes = this.pedirRestantes.bind(this);
        this.actualizarInasistencias = this.actualizarInasistencias.bind(this);
        this.actualizarValores = this.actualizarValores.bind(this);
        this.armarListado = this.armarListado.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.pedirPersona = this.pedirPersona.bind(this);
    }

    pedirPersona(){

    }

    pedirArticulos(){
    
    }

    pedirRestantes(){

    }

    actualizarInasistencias(){
        
    }

    limpiar(){
        main({articulos:this.state.articulos,codigos:this.state.codigos});
    }

    actualizarValores(evento){
        let campo = evento.target.name;
        let valor = evento.target.valor;
        
        this.setState({[campo]:valor});
    }

    armarListado(dic){
        let keys =Object.keys(dic)
        if(keys.length > 0){
            keys.sort()
        }
        return keys;
    }

    render(){
        return(
            <div>
                <TextField value={this.articulo} onChange={this.actualizarValores} name='legajo' style={{width:'80px'}} floatingLabelText={<label>Legajo Nº</label>} />
                <TextField value={this.state.persona} name='persona' disabled floatingLabelText={<label>Nombre y Apellido</label>}/>
                <br/>
                <AutoComplete floatingLabelText={<label>Articulo</label>} name='articulo' type='text' onBlur={this.actualizarValores}
                onNewRequest={(elegido,indice)=>{
                    let evento = {target:{name:'articulo',value:elegido}};
                    this.actualizarValores(evento);
                }}
                style={{width:'80px'}} dataSource={this.armarListado(this.state.codigos)}
                />
                <AutoComplete floatingLabelText={<label>Nombre Articulo</label>} name='nombreArt' type='text' onBlur={this.actualizarValores}
                onNewRequest={(elegido,indice)=>{
                    let evento = {target:{name:'nombreArt',value:elegido}};
                    this.actualizarValores(evento);
                }}
                dataSource={this.armarListado(this.state.articulos)}
                    
                />
                <br/>
                <TextField floatingLabelText={<label>Desde</label>} floatingLabelFixed={true}
                name='desde' type='date' onChange={this.actualizarValores} style={{width:'140px'}} />
                <label style={{width:'30px',display:'inline-block'}}> </label>
                <TextField floatingLabelText={<label>Hasta</label>} floatingLabelFixed={true}
                name='hasta' type='date' onChange={this.actualizarValores} style={{width:'140px'}} />
                <br/>
                <label style={{marginTop:'15px'}} >Restantes: {this.state.restantes}</label>
                <br/>
                <div style={{marginTop:'15px'}}>
                    <RaisedButton label='Confirmar' primary={true} />
                    <RaisedButton label='Limpiar' backgroundColor='#00bfa5' labelColor='#ffffff' style={{marginLeft:'5px'}} onClick={this.limpiar}/>
                </div>
            </div>
        );
    }
}