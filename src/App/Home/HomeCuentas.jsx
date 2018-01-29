import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem,Tab,Tabs} from 'material-ui';
import DBHandler from '../DBHandler.js';
import {BarChart,Bar,XAxis,YAxis,Legend,Tooltip,CartesianGrid} from 'recharts'

export default function main(){
    let root = document.getElementById('main');

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
        this.state = {
            consumos:[],
            peticiones:[],
            dependencias:[],
            dependenciasPrincipales:[],//esto lo relleno a mano.
            mesesMaximos:5,
            meses:['Nada','Enero','Febrero','Marzo','Abril',
            'Mayo','Junio','Julio','Agosto','Septiembre',
            'Octubre','Noviembre','Diciembre'],
        }
        this.db = new DBHandler();
        this.sumarValores = this.sumarValores.bind(this);
        this.calcularFecha = this.calcularFecha.bind(this);
        this.obtenerMes = this.obtenerMes.bind(this);
        this.cargarMeses = this.cargarMeses.bind(this);
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

    calcularFecha(indice){
        console.log(indice)
        let dia = new Date().getDate();
        let mes = new Date().getMonth() + 1;
        let anio = new Date().getFullYear();
        let diaFinal = '';
        let meses31=['01','03','05','07','08','10','12']
        let meses30=['04','06','09','11'];
        mes -= indice;
        if (mes <= 0){
            mes += 12;
            anio -= 1;
        }
        mes = mes.toString()
        if(mes.length === 1){
            mes = '0' + mes;
        }

        let diaInicial = anio + '-' + mes + '-' + '01';
        
        if (dia > 28 && mes === '02')
            dia = 28;
        else if(dia > 30 && meses30.indexOf(mes) != -1){
            dia = 30;
        }

        dia = dia.toString();
        if(dia.length === 1){
            dia = '0' + dia;
        }

        let fechaFinal = anio + '-' + mes + '-' + dia;
        return {desde:diaInicial,hasta:fechaFinal};

    }
    
    obtenerMes(indice){
        let mes = new Date().getMonth() + 1;
        mes -= indice;
        if (mes <= 0){
            mes += 12;
        }
        return this.state.meses[mes];
    }
    
    cargarMeses(datos,indice){
        let meses = this.state.consumos;
        let dic = this.sumarValores(datos.overtimes);
        dic.name = this.obtenerMes(indice);

        let lista = [dic].concat(meses);
        let terminar = false;
        let mes = new Date().getMonth() - indice; //para revisar el proximo mes a calcular;
        let anio = new Date().getFullYear();
        if (mes <= 0){
            mes += 12;
            anio -= 1;
        }
        if(mes < 11 && anio <= 2017){
            terminar = true;
        }

        let fechas = this.calcularFecha(indice + 1);

        if(indice > this.state.mesesMaximos || terminar){
            this.setState({
                consumos:lista,
            })
        }
        else{
            this.setState({
                consumos:lista,
            },this.db.pedir_horas_extras((datos)=>this.cargarMeses(datos,indice + 1),this.calcularFecha(indice + 1)))    
        }
    }

    componentDidMount(){
        this.db.pedir_horas_extras((datos)=>this.cargarMeses(datos,0),this.calcularFecha(0))
    }

    render(){
        let tam = window.innerHeight - 100;
        return(

            <div style={{textAlign:'center',width:'100%',height:tam,marginTop:'10%'}} >
                <span style={{fontSize:'30'}} > <b> Gasto de Horas Extras </b></span>
                <br/>
                <Principal consumos={this.state.consumos}/>
            </div>
        )
    }
}



class Principal extends Component{
    constructor(props){
        super(props);
        this.state={
            consumos:props.consumos,
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            consumos:props.consumos
        })
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