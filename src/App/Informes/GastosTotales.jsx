import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem,Tab,Tabs,
    TableRow,TableBody,TableRowColumn,Table,TableHeader,TableHeaderColumn} from 'material-ui';
import DBHandler from '../DBHandler.js';
import {BarChart,Bar,XAxis,YAxis,Legend,Tooltip,CartesianGrid,
PieChart,Pie,Cell} from 'recharts';


const RADIAN = Math.PI / 180;


export default class InformeGlobal extends Component{
    constructor(props){
        super(props);
        this.state = {
            consumos:{},
            dependencias:[],
            inicio:props.inicio,
            fin:props.fin,
            total:[
                {nombre:'100%',cantHoras:0,gasto:0},
                {nombre:'50%',cantHoras:0,gasto:0},
                {nombre:'50%N',cantHoras:0,gasto:0},
                {nombre:'100%N',cantHoras:0,gasto:0}],
            secretarias:{},
            dependencias:{},
            cantEmpleados:0,

        }
        this.db = new DBHandler();
        this.pedirDatos = this.pedirDatos.bind(this);
        if(props.inicio && props.fin && props.inicio.length > 0 && props.fin.length > 0){
            this.pedirDatos();
        }   
       
    }

    componentWillReceiveProps(props){
        this.setState ({
            consumos:{},
            dependencias:[],
            inicio:props.inicio,
            fin:props.fin,
            total:[
                {nombre:'100%',cantHoras:0,gasto:0},
                {nombre:'50%',cantHoras:0,gasto:0},
                {nombre:'50%N',cantHoras:0,gasto:0},
                {nombre:'100%N',cantHoras:0,gasto:0}],
            secretarias:{},
            dependencias:{},
            cantEmpleados:0,
        })
        if(props.inicio && props.fin && props.inicio.length > 0 && props.fin.length > 0){
            this.pedirDatos(props.inicio,props.fin);
        }  
    }

    pedirDatos(inicio,fin){
        this.db.pedir_horas_extras((datos)=>{
            let info = datos.overtimes;
            if(info.length == 0){
                return;
            }
            let dic = [
                {name:'100%',cantHoras:0,gasto:0},
                {name:'50%',cantHoras:0,gasto:0},
                {name:'50%N',cantHoras:0,gasto:0},
                {name:'100%N',cantHoras:0,gasto:0}]
            let secretarias = {};
            let tipos = {'100%':0,'50%':1,'50%N':2,'100%N':3}
            for (let x = 0; x < info.length; x++){
                if(!(info[x][0] in secretarias )){
                    secretarias[info[x].secretariat_id] = {gasto:0,cantHoras:0};
                }

                let pos = tipos[info[x].hour_type];
                secretarias[info[x].secretariat_id].gasto += info[x].result;
                secretarias[info[x].secretariat_id].cantHoras += info[x].acumulated_hours;
                dic[pos].gasto += info[x].result;
                dic[pos].cantHoras += info[x].acumulated_hours;
            }
            for (let x = 0; x < dic.length; x++){
                dic[x].gasto = Math.round(dic[x].gasto * 100) /100
                dic[x].cantHoras = Math.round(dic[x].cantHoras * 100) /100
                
                secretarias[info[x].secretariat_id].gasto = Math.round(secretarias[info[x].secretariat_id].gasto * 100) /100
                secretarias[info[x].secretariat_id].cantHoras = Math.round(secretarias[info[x].secretariat_id].cantHoras * 100) /100
            }
            console.log(secretarias);
            this.setState({total:dic,consumos:secretarias })
        },{desde:inicio,hasta:fin});


        this.db.pedir_horas_extras_empleados((datos)=>{
            let empleados = {};
            for (let x = 0; x < datos.overtimes.length; x++){
                if(!(datos.overtimes[x].docket in empleados)){
                    empleados[datos.overtimes[x].docket] = 1;
                }
            }
            this.setState({cantEmpleados:Object.keys(empleados).length});

        },inicio,fin);


        this.db.pedir_limite_secretarias((datos)=>{
            let secretarias = {}
            for (let x = 0; x < datos.budgets.length; x ++) {
                secretarias[datos.budgets[x][0]] = datos.budgets[x][1];
            }
            this.setState({secretarias:secretarias})
        })

        this.db.pedir_dependencias((datos)=>{
            let ref = {};
            datos.dependencies.map((elem,index)=>{
                ref[elem[0]]= elem[1];
            });
            datos['sub-dependencies'].map((elem,index)=>{
                ref[elem[0]] = elem[1];
            });
            this.setState({dependencias:ref})
        })
    }

    render(){

        

        let texto = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
         const x  = cx + radius * Math.cos(-midAngle * RADIAN);
         const y = cy  + radius * Math.sin(-midAngle * RADIAN);
        
         return (
           <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
               {`${(percent * 100).toFixed(0)}%`}
           </text>
         );
       };




        let colores = ['#29B6F6','#EF5350','#AB47BC','#66BB6A']
        let grafico1 = <PieChart width={600} height={350} >
                            <Tooltip/>
                            <Legend verticalAlign="top" height={36}/>
                            <Pie data={this.state.total} dataKey='gasto' 
                             label={texto} outerRadius={95}>
                             {this.state.total.map((entry,index)=> <Cell fill={[colores[index]]}/>)}
                            </Pie>
                        </PieChart>
        let grafico2 = <PieChart width={600} height={350} >
        
                            <Tooltip/>
                            <Legend verticalAlign="top" height={36}/>
                            <Pie data={this.state.total} dataKey='cantHoras' 
                            outerRadius={85} label={texto}>
                                {this.state.total.map((entry,index)=> <Cell fill={[colores[index]]}/>)}
                            </Pie>
                        </PieChart>
        let total = 0;
        this.state.total.map((elem)=>{total += elem.gasto})
        let horasExtras = 0;
        this.state.total.map((elem)=>{horasExtras += elem.cantHoras})

        let interfaz = null;
        if(Object.keys(this.state.consumos).length > 0){
            interfaz = <div>
                            <span> <b> Total del Gasto de horas Extras:</b> ${Math.round(total * 100) /100} </span>
                            <br/>
                            <span> <b> Total de Horas Extras generadas:</b> {horasExtras}</span>
                            <br/>
                            <span> <b>Total de Agentes que registraron Horas Extras: </b> {this.state.cantEmpleados}</span>
                            <div>
                                <div style={{display:'inline-block'}}>
                                    <span>
                                        Division del Gasto de horas Extras:
                                    </span>
                                    {grafico1}
                                </div>
                                <div style={{display:'inline-block'}}>
                                    <span>
                                        Division de las Horas por tipo:
                                    </span>
                                    {grafico2}
                                </div>
                            </div>
                            <div>
                                <div style={{display:'inline-block'}}>
                                    <TopGastadores gastos={this.state.consumos} secretarias={this.state.secretarias}/>
                                </div>
                                <div style={{display:'inline-block'}}>
                                    <TopHoras horas={this.state.consumos} secretarias={this.state.secretarias} />
                                </div>
                            </div>
                        </div>
        }
        return(
            <div>
                {interfaz}
            </div>
        )
    }

} 



class TopGastadores extends Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            gastadores:props.gastos,
            secretarias:props.secretarias,
        }
    }

    cargarGastadores(){
        if(!this.state.secretarias || !this.state.gastadores || 
            Object.keys(this.state.secretarias).length === 0 || 
            Object.keys(this.state.gastadores).length === 0){
                return [];
            }
        let gasta = this.state.gastadores;
        let listado = [];
        for (let key in gasta){
            listado.push({secre:key,gasto:gasta[key].gasto})
        }
        let secre = this.state.secretarias;
        listado.sort((a,b)=>{return b.gasto - a.gasto})
        let lista = []
        let maximo = 10;
        if (listado.length < maximo){
            maximo = listado.length;
        }
        for (let x = 0; x < maximo; x++){
            lista.push( <TableRow>
                <TableRowColumn style={{width:'350px'}}>
                    {secre[listado[x].secre]}
                </TableRowColumn>
                <TableRowColumn>
                    ${Math.round(listado[x].gasto * 100)/100}
                </TableRowColumn>
                </TableRow>  )
        }
        return lista
    }

    componentWillReceiveProps(props){
        
        this.setState( {
            gastadores:props.gastos,
            secretarias:props.secretarias,
        })
    }

    render(){

        let interfaz = null;
        if(this.state.gastadores.length === 0 || this.state.secretarias === 0){
            interfaz = null;
        }
        else{
            interfaz = <div >
                            <span> <b>Mayores Gastadores (10)</b></span>
                            <Table height={300} fixedHeader={true} selectable={false} >
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn style={{width:'350px'}}>Secretaria</TableHeaderColumn>
                                        <TableHeaderColumn>Gasto ($)</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false} stripedRows={true}>
                                    {this.cargarGastadores()}
                                </TableBody>
                            </Table>
                        </div>
        }
        return(
            <div style={{width:'600px'}}>
                {interfaz}
            </div>
        )
    }

}


class TopHoras extends Component{
    constructor(props){
        super(props);
        this.state = {
            gastadores:props.horas,
            secretarias:props.secretarias,
        }
    }

    cargarGastadores(){
        if(!this.state.secretarias || !this.state.gastadores || 
            Object.keys(this.state.secretarias).length === 0 || 
            Object.keys(this.state.gastadores).length === 0){
                return [];
            }
        let gasta = this.state.gastadores;
        let listado = [];
        for (let key in gasta){
            listado.push({secre:key,cantHoras:gasta[key].cantHoras})
        }
        let secre = this.state.secretarias;
        listado.sort((a,b)=>{return b.cantHoras - a.cantHoras})
        let lista = []
        let maximo = 10;
        if (listado.length < maximo){
            maximo = listado.length;
        }
        for (let x = 0; x < maximo; x++){
            lista.push( <TableRow>
                <TableRowColumn style={{width:'350px'}}>
                    {secre[listado[x].secre]}
                </TableRowColumn>
                <TableRowColumn>
                    {Math.round(listado[x].cantHoras * 100)/100}
                </TableRowColumn>
                </TableRow>  )
        }
        return lista
    }

    componentWillReceiveProps(props){
        
        this.setState( {
            gastadores:props.horas,
            secretarias:props.secretarias,
        })
    }

    render(){
        let interfaz = null;
        if(this.state.gastadores.length === 0 || this.state.secretarias === 0){
            interfaz = null;
        }
        else{
            interfaz = <div >
                            <span> <b>Mayor Cantidad de horas Extras (10)</b></span>
                            <Table height={300} fixedHeader={true} selectable={false} >
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn style={{width:'350px'}}>Secretaria</TableHeaderColumn>
                                        <TableHeaderColumn>Horas Extras</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false} stripedRows={true}>
                                    {this.cargarGastadores()}
                                </TableBody>
                            </Table>
                        </div>
        }


        return(
            <div style={{width:'600px',marginLeft:'5px'}}>
                {interfaz}
            </div>
        )
    }
}