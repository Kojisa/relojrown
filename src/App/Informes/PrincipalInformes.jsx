import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,SelectField,MenuItem,Checkbox} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';
import Fechas from './MenuFechas';
import Totales from './GastosTotales';

//funciones a importar para cada seccion


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
            tipos:[],
            periodo:true,
            inicio:'',
            fin:'',
            tipo:0,
            funciones:[],//aca van a ir todos los objetos.
            mes:'',
            anio:'',
            meses:[
                <MenuItem value={'01'} primaryText='Enero' />,
                <MenuItem value={'02'} primaryText='Febrero'/>,
                <MenuItem value={'03'} primaryText='Marzo'/>,
                <MenuItem value={'04'} primaryText='Abril'/>,
                <MenuItem value={'05'} primaryText='Mayo'/>,
                <MenuItem value={'06'} primaryText='Junio'/>,
                <MenuItem value={'07'} primaryText='Julio'/>,
                <MenuItem value={'08'} primaryText='Agosto'/>,
                <MenuItem value={'09'} primaryText='Septiembre'/>,
                <MenuItem value={'10'} primaryText='Octubre'/>,
                <MenuItem value={'11'} primaryText='Noviembre'/>,
                <MenuItem value={'12'} primaryText='Diciembre'/>,
            ],
        }
    }

    generarAnios(){
        let inicial = 2017;
        let final = new Date().getFullYear();
        let actual = inicial;
        let lista = [];
        while (actual > final){
            lista.push( <MenuItem value={actual.toString()} primaryText={actual.toString()}/>)
            actual += 1;
        }
        return lista;

    }

    render(){

        /*let fechas = <div>
                    <TextField value={this.state.inicio} floatingLabelText={ <label htmlFor="">Desde</label> } 
                    onChange={(ev)=>{this.setState({inicio:ev.target.value})}} name='inicio' type='date' floatingLabelFixed={true} ></TextField>
                    <TextField value={this.state.fin} floatingLabelText={ <label htmlFor="">Hasta</label> }
                    onChange={(ev)=>{this.setState({fin:ev.target.value})}} name='fin' type='date' floatingLabelFixed={true}></TextField>
                </div>
        if(this.state.periodo){
            fechas = <div>
                        <SelectField
                            value={this.state.mes}
                            floatingLabelText="Mes"
                            floatingLabelFixed={true}
                            onChange={(e, i, value) => this.setState({ mes:value })}>
                            {this.state.meses}
                        </SelectField>
                        <SelectField
                            value={this.state.anio}
                            floatingLabelText="Año"
                            floatingLabelFixed={true}
                            onChange={(e, i, value) => this.setState({ anio:value })}>
                            {this.generarAnios()}
                        </SelectField>
                    </div>
        }*/

        return(
            <div>
                <div style={{marginLeft:'5px'}}>
                    <SelectField
                        value={this.state.tipo}
                        floatingLabelText="Tipo de informe"
                        floatingLabelFixed={true}
                        onChange={(e, i, value) => this.setState({ tipo:value })}>
                    </SelectField>
                    <br/>
                    <Fechas funActInicio={(valor)=>this.setState({inicio:valor})}
                    funActFin={(valor)=>this.setState({fin:valor})} />
                    <RaisedButton
                    primary={true}
                    style={{display:'inline-block',marginLeft:'10px'}}
                    label="Buscar"
                    onTouchTap={()=>{
                        console.log(this.state.inicio);
                        console.log(this.state.fin);
                    }} />
                </div>
                <Totales/>
            </div>
        )
    }
}

