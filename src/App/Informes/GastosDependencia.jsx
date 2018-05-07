import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem,Tab,Tabs,SelectField,MenuItem,
    TableRow,TableBody,TableRowColumn,Table,TableHeader,TableHeaderColumn} from 'material-ui';
import DBHandler from '../DBHandler.js';
import {BarChart,Bar,XAxis,YAxis,Legend,Tooltip,CartesianGrid,
PieChart,Pie,Cell} from 'recharts';



export default class InformeGlobal extends Component{
    constructor(props){
        super(props);
        this.state = {
            consumos:{},
            dependencias:[],
            secretaria:props.dependencia,
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
        if(props.inicio && props.fin && props.inicio.length > 0 && props.fin.length > 0 && props.dependencia != ''){
            this.pedirDatos();
        }   
       
    }

    componentWillReceiveProps(props){
        this.setState ({
            consumos:{},
            dependencias:[],
            inicio:props.inicio,
            dependencia:props.dependencia,
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
        if(props.inicio && props.fin && props.inicio.length > 0 && props.fin.length > 0 && props.dependencia != ''){
            this.pedirDatos(props.inicio,props.fin,props.dependencia);
        }  
    }

    pedirDatos(inicio,fin,dependencia){
        console.log(dependencia);
        this.db.pedir_dependencias((depen)=>{
            let ref = {};
            depen.dependencies.map((elem,index)=>{
                if(elem[0] === dependencia){
                    ref[elem[0]]= elem[1];
                }
            });
            depen['sub-dependencies'].map((elem,index)=>{
                if(elem[2] === dependencia ){
                    ref[elem[0]] = elem[1];
                }
            });
            this.db.pedir_horas_extras_dependencias((datos)=>{
                let info = datos.overtimes;
                if(info.length === 0){
                    return;
                }
                let dic = [
                    {name:'100%',cantHoras:0,gasto:0},
                    {name:'50%',cantHoras:0,gasto:0},
                    {name:'50%N',cantHoras:0,gasto:0},
                    {name:'100%N',cantHoras:0,gasto:0}
                ];
                let gastos = {};
                console.log(info);
                let tipos = {'100%':0,'50%':1,'50%N':2,'100%N':3}
                for (let x = 0; x < info.length; x++){
                    
                    if(info[x].dependence_id in ref){
                        if(!(info[x].dependence_id in gastos)){
                            
                            gastos[info[x].dependence_id] = {gasto:0,cantHoras:0}
                        }
                        gastos[info[x].dependence_id].gasto += Math.round(info[x].result * 100) /100;
                        gastos[info[x].dependence_id].cantHoras += Math.round(info[x].acumulated_hours * 100) /100;
                        let pos = tipos[info[x].hour_type];
                        dic[pos].gasto += Math.round(info[x].result * 100) /100;
                        dic[pos].cantHoras += Math.round(info[x].acumulated_hours * 100) /100;
                    }
                    
                }
                this.db.pedir_horas_extras_empleados((datos)=>{
                    let empleados = {};
                    for (let x = 0; x < datos.overtimes.length; x++){
                        if(!(datos.overtimes[x].docket in empleados) && datos.overtimes[x].dependence in ref){
                            empleados[datos.overtimes[x].docket] = 1;
                        }
                    }
                    this.setState({cantEmpleados:Object.keys(empleados).length,
                        consumos:gastos,dependencias:ref,total:dic});
        
                },inicio,fin);
            },{desde:inicio,hasta:fin})
        },dependencia)

        

    }

    render(){
        let colores = ['#29B6F6','#EF5350','#AB47BC','#66BB6A']
        let grafico1 = <PieChart width={600} height={350} >
                            <Legend verticalAlign="top" height={36}/>
                            <Pie data={this.state.total} dataKey='gasto' 
                             label outerRadius={85}>
                             {this.state.total.map((entry,index)=> <Cell fill={[colores[index]]}/>)}
                            </Pie>
                        </PieChart>
        let grafico2 = <PieChart width={600} height={350} >
                            <Legend verticalAlign="top" height={36}/>
                            <Pie data={this.state.total} dataKey='cantHoras' 
                            outerRadius={85} label >
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
                                    <TopGastadores gastos={this.state.consumos} secretarias={this.state.dependencias}/>
                                </div>
                                <div style={{display:'inline-block'}}>
                                    <TopHoras horas={this.state.consumos} secretarias={this.state.dependencias} />
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
        console.log(listado);
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
                                        <TableHeaderColumn style={{width:'350px'}}>Dependencia/Sub-Dependencia</TableHeaderColumn>
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
            if(listado[x].secre in secre){
                lista.push( <TableRow>
                    <TableRowColumn style={{width:'350px'}}>
                        {secre[listado[x].secre]}
                    </TableRowColumn>
                    <TableRowColumn>
                        {Math.round(listado[x].cantHoras * 100)/100}
                    </TableRowColumn>
                    </TableRow>  )
            }
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
                                        <TableHeaderColumn style={{width:'350px'}}>Dependencia/Sub-Dependencia</TableHeaderColumn>
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