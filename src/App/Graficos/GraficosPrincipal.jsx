import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,SelectField,
    MenuItem,Checkbox,RadioButton,RadioButtonGroup,
    Tab,Tabs,AutoComplete,FloatingActionButton} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';
import {BarChart,Bar,XAxis,YAxis,Legend,Tooltip,CartesianGrid} from 'recharts';
import ContentMinus from 'material-ui/svg-icons/content/clear';

export default function main(props){
    let root = document.getElementById('main');
    root.limpiar();

    let tam = window.innerHeight - 100;
    ReactDOM.render(
        <div style={{margin:"10px",height:tam}}>
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
            graficos:[],
            tipos:[
                {numero:0,descripcion:'Comparativa a meses pasados'},
                {numero:1,descripcion:'Comparativa diaria'},
                {numero:2,descripcion:'Desglose de Gastos'},
                {numero:3,descripcion:'Mayores Consumidores'},
            ],
            objetivos:[
                {numero:0,descripcion:'Total'},
                {numero:1,descripcion:'Secretaria'},
                {numero:2,descripcion:'Dependencia'},
            ],
            tipo:-1,
            objetivo:-1,

            secretarias:[],
            dependencias:[],
            seleccion:'' //variable usada en caso de seleccionar una dependencia o secretaria.
            
        }

        this.db = new DBHandler();

        this.armarListadoTipos = this.armarListadoTipos.bind(this);
    }

    armarListadoTipos(){
        let tipos = this.state.tipos;
        return tipos.map((elem,index)=>(
            <MenuItem value={elem.numero} primaryText={elem.descripcion} key={index}/>
          ))
    }

    armarGraficoComparativaMeses(){
        if(this.state.objetivo == 0){
            this.db.pedir_horas_extras()
        }
    }


    render(){

        return(
            <div>
                <Paper>
                    <div style={{margin:'5px'}} >
                        <SelectField >
                            {this.armarListadoTipos()}
                        </SelectField>
                    </div>
                </Paper>
            </div>
        )
    }



}

class GraficoComparativa extends Component{
    constructor(props){
        super(props);



        this.state={
            consumos:props.datos,

        }
    }

    sumarValores(datos){
        let dic = {};
        for (let x = 0; x < datos.length; x++){
            if(!(datos[x].hour_type in dic)){
                dic[datos[x].hour_type] = 0;
            }
            dic[datos[x].hour_type] += datos[x].result;
        }
        for (let key in dic){
            dic[key] = Math.round(dic[key] * 100) /100
        }
        return dic;
    }

    render(){

        let largo = 200 + this.state.consumos.length*80;
        return(
            <div style={{display:'inline-block'}}>
                <span>Comparativa Mensual (Todos los meses al dia de la fecha)</span>
                <BarChart width={largo} height={300} data={this.state.consumos} >
                    <XAxis dataKey='name'/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <YAxis width={100} />
                    <Legend />
                    <Tooltip />
                    <Bar dataKey='100%' stackId='a' fill='#8884d8' name='Horas al 100%' />
                    <Bar dataKey='100%N' stackId='a' fill='#82ca9d' name='Nocturnidad al 100%' />
                    <Bar dataKey='50%' stackId='a' fill='#8310ba' name='Horas al 50%' />
                    <Bar dataKey='50%N' stackId='a' fill='#001319' name='Nocturnidad al 50%' />
                </BarChart>
            </div>
        )
    }
}


class ContenedorGrafico extends Component{
    constructor(props){
        super(props);
        this.state={
            grafico:props.grafico,
            orden:props.orden,
        }

        this.borrarGrafico = props.funBor;
    }

    componentWillReceiveProps(props){
        this.setState({
            grafico:props.grafico,
            orden:props.orden
        })
    }

    render(){

        return(
            <Paper style={{display:'inline-block'}} >
                <FloatingActionButton mini={true} onClick={()=>this.borrarGrafico(this.state.orden)}>
                    <ContentMinus/>
                </FloatingActionButton>
                <div style={{margin:'5px'}} >
                    {this.state.grafico}
                </div>
            </Paper>
        )
    }


}


class Grafico extends Component{
    constructor(props){
        super(props);


    }
}