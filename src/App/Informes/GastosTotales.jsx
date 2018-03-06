import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem,Tab,Tabs} from 'material-ui';
import DBHandler from '../DBHandler.js';
import {BarChart,Bar,XAxis,YAxis,Legend,Tooltip,CartesianGrid,
PieChart,Pie,Cell} from 'recharts';



export default class InformeGlobal extends Component{
    constructor(props){
        super(props);
        this.state = {
            consumos:{},
            dependencias:[],
            inicio:props.inicio,
            fin:props.inicio,
            total:[
                {nombre:'100%',cantHoras:0,gasto:0},
                {nombre:'50%',cantHoras:0,gasto:0},
                {nombre:'50%N',cantHoras:0,gasto:0},
                {nombre:'100%N',cantHoras:0,gasto:0}],
            secretarias:{},

        }
        this.db = new DBHandler();
        this.db.pedir_horas_extras((datos)=>{
            let info = datos.overtimes;
            let dic = [
                {name:'100%',cantHoras:0,gasto:0},
                {name:'50%',cantHoras:0,gasto:0},
                {name:'50%N',cantHoras:0,gasto:0},
                {name:'100%N',cantHoras:0,gasto:0}]
            
            let tipos = {'100%':0,'50%':1,'50%N':2,'100%N':3}
            for (let x = 0; x < info.length; x++){
                let pos = tipos[info[x].hour_type];
                dic[pos].gasto += info[x].result;
                dic[pos].cantHoras += info[x].acumulated_hours;
            }
            for (let x = 0; x < dic.length; x++){
                dic[x].gasto = Math.round(dic[x].gasto * 100) /100
                dic[x].cantHoras = Math.round(dic[x].cantHoras * 100) /100
            }
            this.setState({total:dic})
        },{desde:'2018-01-01',hasta:'2018-01-30'});
        this.db.pedir_limite_secretarias((datos)=>{
            let secretarias = {}
            for (let lista in datos.budget) {
                secretarias[lista[0]] = lista[1];
            }
            this.setState({secretarias:secretarias})
        })
    }

    render(){
        let colores = ['#8884d8','#8310ba','#001319','#82ca9d']
        let grafico1 = <PieChart width={500} height={350} >
                            <Pie data={this.state.total} dataKey='gasto' 
                             label>
                             {this.state.total.map((entry,index)=> <Cell fill={[colores[index]]}/>)}
                            </Pie>
                        </PieChart>
        let grafico2 = <PieChart width={500} height={350} >
                            <Pie data={this.state.total} dataKey='cantHoras' 
                            outerRadius={50} >
                                {this.state.total.map((entry,index)=> <Cell fill={[colores[index]]}/>)}
                            </Pie>
                        </PieChart>
        let total = 0
        this.state.total.map((elem)=>{total += elem.gasto})
        return(
            <div>
                <span>Total del Gasto de horas Extras: ${Math.round(total * 100) /100} </span>
                <br/>
                <div>
                <span>
                    Division del Gasto de horas Extras:
                </span>
                {grafico1}
                </div>
                <div>
                    <span>
                        Division de las Horas por tipo:
                    </span>
                    {grafico2}
                </div>
            </div>
        )
    }

} 