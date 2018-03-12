import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,SelectField,MenuItem,Checkbox} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';



 export default class Fechas extends Component{
    constructor(props){
        super(props);
        this.state={
            mes:'',
            anio:'',
            periodo:'',
            actualizoPadre:false,
            meses:[
                <MenuItem value={'01'} primaryText='Enero'  key={1}/>,
                <MenuItem value={'02'} primaryText='Febrero' key={2}/>,
                <MenuItem value={'03'} primaryText='Marzo' key={3}/>,
                <MenuItem value={'04'} primaryText='Abril' key={4}/>,
                <MenuItem value={'05'} primaryText='Mayo' key={5}/>,
                <MenuItem value={'06'} primaryText='Junio' key={6}/>,
                <MenuItem value={'07'} primaryText='Julio' key={7}/>,
                <MenuItem value={'08'} primaryText='Agosto' key={8}/>,
                <MenuItem value={'09'} primaryText='Septiembre' key={9}/>,
                <MenuItem value={'10'} primaryText='Octubre' key={10}/>,
                <MenuItem value={'11'} primaryText='Noviembre' key={11}/>,
                <MenuItem value={'12'} primaryText='Diciembre' key={12}/>,
            ],
            inicio:'',
            fin:'',
        }

        this.actualizarInicio = props.funActInicio;
        this.actualizarFin = props.funActFin;
        this.crearFechas = this.crearFechas.bind(this);
    }

    generarAnios(){
        let inicial = 2017;
        let final = new Date().getFullYear();
        let actual = inicial;
        let lista = [];
        while (actual <= final){
            lista.push( <MenuItem value={actual.toString()} primaryText={actual.toString()}/>)
            actual += 1;
        }
        return lista;

    }

    crearFechas(){

        if(this.state.anio == '' || this.state.anio == null || this.state.mes == '' || this.state.mes == null){
            return;
        }
        let diaFinal = '';
        let meses31=['01','03','05','07','08','10','12']
        let meses30=['04','06','09','11'];

        if(meses31.indexOf(this.state.mes) != -1){
            diaFinal = '31';
        }
        else if(meses30.indexOf(this.state.mes) != -1){
            diaFinal = '30'
        }
        else{
            diaFinal = '28'
        }
        
        let desde = "" + this.state.anio + '-' + this.state.mes + '-' + '01';
        let hasta = "" + this.state.anio + '-' + this.state.mes + '-' + diaFinal;
        this.actualizarInicio(desde);
        this.actualizarFin(hasta);
        this.setState({actualizoPadre:true})
    }

    componentDidUpdate(){
        if(this.state.mes != '' && this.state.anio != '' && this.state.periodo == true && this.state.actualizoPadre == false){
            this.crearFechas();
        }
    }


    render(){
        let fechas = <div>
                    <TextField value={this.state.inicio} floatingLabelText={ <label htmlFor="">Desde</label> } 
                    onChange={(ev)=>{this.setState({inicio:ev.target.value});
                        this.actualizarInicio(ev.target.value)}} 

                    name='inicio' type='date' floatingLabelFixed={true} ></TextField>

                    <TextField value={this.state.fin} floatingLabelText={ <label htmlFor="">Hasta</label> }
                    onChange={(ev)=>{this.setState({fin:ev.target.value});
                    this.actualizarFin(ev.target.value)}} 
                    
                    name='fin' type='date' floatingLabelFixed={true}></TextField>
                </div>

        if(this.state.periodo){
            fechas = <div>
                        <SelectField
                            value={this.state.mes}
                            floatingLabelText="Mes"
                            floatingLabelFixed={true}
                            onChange={(e, i, value) => {this.setState({ mes:value,actualizoPadre:false })}
                            }>
                            {this.state.meses}
                        </SelectField>
                        <SelectField
                            value={this.state.anio}
                            floatingLabelText="Año"
                            floatingLabelFixed={true}
                            onChange={(e, i, value) => {this.setState({ anio:value,actualizoPadre:false})}
                            }>
                            {this.generarAnios()}
                        </SelectField>
                    </div>
        }

        return(
            <div style={{display:'inline-block'}}>
                <div style={{marginLeft:'5px'}}>
                    <Checkbox
                        labelPosition='left'
                        checked={this.state.periodo}
                        label="Consultar por Periodo: "
                        onCheck={(e, checked) => {
                            this.setState({ periodo:checked,inicio:'',fin:'',mes:'',anio:'' });
                            this.actualizarFin(''); 
                            this.actualizarInicio('');
                            }
                        }/>
                    <br/>
                    {fechas}
                </div>

            </div>
        )
    }
}