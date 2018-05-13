import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,SelectField,MenuItem,Checkbox} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';
import Fechas from './MenuFechas';
import Totales from './GastosTotales';
import GastosJurisdiccion from './GastosJurisdiccion';
import GastosDependencias from './GastosDependencia';

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

    HOST = "172.20.0.3";//"10.10.10.52";//"172.20.0.3";
    HOSTRAFAM = '172.22.20.241';//"10.10.10.52";//'172.22.20.241';


    constructor(props){
        super(props);
        this.state={
            tipos:[],
            periodo:true,
            inicio:'',
            fin:'',
            tipo:-1,
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
            secretarias:{},
            dependencias:{},
            secretaria:'',
            dependencia:'',
        }
        this.db = new DBHandler();
        this.db.pedir_limite_secretarias((datos)=>{
            let secretarias = []
            for (let x = 0; x < datos.budgets.length; x ++) {
                secretarias.push([datos.budgets[x][0],datos.budgets[x][1]]);
            }
            secretarias.sort((a,b)=> a[1].localeCompare(b[1]))
            this.setState({secretarias:secretarias})
        })
        this.db.pedir_dependencias((datos)=>{
            let ref = [];
            datos.dependencies.map((elem,index)=>{
                ref.push([elem[0],elem[1]]);
            });
            datos['sub-dependencies'].map((elem,index)=>{
                ref.push([elem[0],elem[1]]);
            });
            ref.sort((a,b)=> a[1].localeCompare(b[1]))
            this.setState({dependencias:ref})
        })
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

    generarOpciones(){
        let lista = ['Total','Secretaria','Dependencia'];
        return lista.map((elem,index)=> <MenuItem primaryText={elem} key={index} value={index} />)
    }

    render(){
        let informe = null;
        let segundoSelector = null;
        if(this.state.tipo === 0){
            informe = <Totales inicio={this.state.inicio} fin={this.state.fin} />
        }
        else if(this.state.tipo === 1){
            informe = <GastosJurisdiccion secretaria={this.state.secretaria} inicio={this.state.inicio} fin={this.state.fin} />
            segundoSelector =  <SelectField 
                                value={this.state.secretaria}
                                floatingLabelText="Secretaria"
                                floatingLabelFixed={true}
                                onChange={(e, i, value) => this.setState({ secretaria:value })}>
                                {this.state.secretarias.map((elem,index)=><MenuItem value={elem[0]} primaryText={elem[1]} key={index} />)}
            </SelectField>
        }

        else if( this.state.tipo === 2){
            informe = <GastosDependencias dependencia={this.state.dependencia} inicio={this.state.inicio} fin={this.state.fin}/>
            segundoSelector= <SelectField 
                                    value={this.state.dependencia}
                                    floatingLabelText="Dependencia"
                                    floatingLabelFixed={true}
                                    onChange={(e, i, value) => this.setState({ dependencia:value })}>
                                    {this.state.dependencias.map((elem,index)=><MenuItem value={elem[0]} primaryText={elem[1]} key={index} />)}
                        </SelectField>
        }
        let botonImprimir = null;
        if(this.state.tipo === 0){
            botonImprimir = <RaisedButton label='Imprimir' onClick={
                ()=>{
                    console.log('entra')
                    let datos = {initial_date:this.state.inicio,end_date:this.state.fin};
                    var request = new XMLHttpRequest();
                    request.onreadystatechange = function(){
                        if(this.readyState == 4 && this.status == 200){
                            console.log('entra2')
                            var blob = this.response;
                            console.log(blob)
                            var filename = 'informe.xlsx';
                            let a = document.createElement('a');
                            a.href = window.URL.createObjectURL(blob);
                            a.download = filename;
                            console.log(a.href)
                            a.click();

                        }
                    };
            
                    let host = this.HOST;
                    if (window.location.href.indexOf(this.HOST) < 0){
                        host = this.HOSTRAFAM;
                    }
                    
                    request.open('POST',"http://"+host+":" +3000+"/informe/excel",true);
                    request.setRequestHeader('Access-Control-Allow-Origin','*')
                    request.responseType = 'blob';
                    var datosFinales = {};
                    if (datos){
                        request.setRequestHeader('Content-type','application/json');
                        request.send(JSON.stringify(datos));
                        
                    }
            
                    else {request.send();}
                }
            }
            />
        }

        return(
            <div>
                <div style={{marginLeft:'5px'}}>
                    <SelectField
                        value={this.state.tipo}
                        floatingLabelText="Tipo de informe"
                        floatingLabelFixed={true}
                        onChange={(e, i, value) => this.setState({ tipo:value })}>
                        {this.generarOpciones()}
                    </SelectField>
                    {segundoSelector}
                    <br/>
                    <Fechas funActInicio={(valor)=>this.setState({inicio:valor})}
                    funActFin={(valor)=>this.setState({fin:valor})} />
                    {botonImprimir}
                </div>
                <div style={{marginTop:'10px'}}>
                    {informe}
                </div>
            </div>
        )
    }
}

