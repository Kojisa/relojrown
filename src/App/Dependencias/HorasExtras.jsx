import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,List,ListItem,Divider,Tab,Tabs} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';

export default function main(){
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
            secretarias:[
                
            ],
            consumos:{

            },
            ref:{
                
            },
            elegido:'',//jurisdiccion elegida para ver detalles.
            desde:'',
            hasta:'',

        }

        this.db = new DBHandler();
        this.actualizar = this.actualizar.bind(this);
        this.pedirJurisdicciones = this.pedirJurisdicciones.bind(this);
        this.cargarHorasExtras = this.cargarHorasExtras.bind(this);
        this.pedirHorasExtras = this.pedirHorasExtras.bind(this);
        this.actualizarElegido = this.actualizarElegido.bind(this);

    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value,
        })
    }

    actualizarElegido(codigo){
        this.setState({
            elegido:codigo,
        })
    }

    cargarHorasExtras(datos){
        let secret = this.state.consumos;
        for(let x = 0; x < datos.overtimes.length; x++){
           
            if(datos.overtimes[x].secretariat_id in secret){
                if(datos.overtimes[x].hour_type === '50%'){
                    secret[datos.overtimes[x].secretariat_id ][0] = datos.overtimes[x].result.toFixed(2);
                }
                
                else if(datos.overtimes[x].hour_type === '100%'){
                    secret[datos.overtimes[x].secretariat_id][1] = datos.overtimes[x].result.toFixed(2);
                }

                else if(datos.overtimes[x].hour_type === '50%N'){
                    secret[datos.overtimes[x].secretariat_id ] [2] = datos.overtimes[x].result.toFixed(2);
                }
                else if(datos.overtimes[x].hour_type === '100%N'){
                    secret[datos.overtimes[x].secretariat_id ] [3] = datos.overtimes[x].result.toFixed(2);
                }
                   
            }
        }
        this.setState({
            consumos:secret,
        })


    }

    pedirHorasExtras(datos){
        let consumos = {};
        let ref = {};
        let secretarias = datos.budgets;
        secretarias.map((elem,index)=>{
            consumos[elem[0]] = [0,0,0,0]
            ref[elem[0]] = index;
            elem.push(0);
        })
    
        this.setState({
            ref:ref,
            secretarias:datos.budgets,
            consumos:consumos
        })
        this.db.pedir_horas_extras(this.cargarHorasExtras,{desde:this.state.desde,hasta:this.state.hasta})
    }

    pedirJurisdicciones(){
        this.db.pedir_limite_secretarias(this.pedirHorasExtras);
    }

    render()
    {
        let panel = null;
        if(this.state.elegido !== ''){
            console.log(this.state.elegido);
            let secre = this.state.secretarias[this.state.ref[this.state.elegido]];
            panel = <PanelInfo secretaria={secre[1]} codigo={secre[0]} 
            limite={secre[2]} gastos={this.state.consumos[secre[0]]} desde={this.state.desde}
            hasta={this.state.hasta} ></PanelInfo>
        }

        return(
            <Paper>
                <div style={{float:'top'}}>
                    <TextField value={this.state.desde} floatingLabelText={ <label htmlFor="">Desde</label> } 
                    onChange={this.actualizar} name='desde' type='date' floatingLabelFixed={true} ></TextField>
                    <TextField value={this.state.hasta} floatingLabelText={ <label htmlFor="">Hasta</label> }
                    onChange={this.actualizar} name='hasta' type='date' floatingLabelFixed={true}></TextField>
                    <br/>
                    <RaisedButton label='Pedir Datos' onClick={this.pedirJurisdicciones} ></RaisedButton>
                </div>
                <Tarjetas secretarias={this.state.secretarias} consumos={this.state.consumos} funAct={this.actualizarElegido}></Tarjetas>
                {panel}
            </Paper>
        )
    }
}


class PanelInfo extends Component{

    constructor(props){
        super(props);
        this.state={
            codigo:props.codigo,
            secretaria:props.secretaria,
            dependencias:[],
            limite:props.limite,
            gastos:props.gastos,
            desde:props.desde,
            hasta:props.hasta,
            ref:{}
        }

        this.db = new DBHandler();
        this.pedirDependenciasAsociadas = this.pedirDependenciasAsociadas.bind(this);
        this.cargarDependencias = this.cargarDependencias.bind(this);
        this.pedirLimitesDependencias = this.pedirLimitesDependencias.bind(this);
        this.cargarLimitesDependencias = this.cargarLimitesDependencias.bind(this);
        this.cargarGastosDependencias = this.cargarGastosDependencias.bind(this);
        this.pedirGastosDependencias = this.pedirGastosDependencias.bind(this);
        this.pedirDependenciasAsociadas();
        
    }

    cargarGastosDependencias(datos){
        console.log(datos)
        let depen = this.state.dependencias;
        let ref = this.state.ref;
        for (let x = 0; x < datos.overtimes.length; x++){
            if(datos.overtimes[x]['dependence_id'] in ref){
                let ind = ref[datos.overtimes[x]['dependence_id']];
                depen[ind][depen[ind].length - 1] = datos.overtimes[x]['result'].toFixed(2);
            }
        }
        console.log(depen);
        this.setState({
            dependencias:depen,
        })
    }

    pedirGastosDependencias(){

        this.db.pedir_gastos_dependencias(this.cargarGastosDependencias,this.state.desde,this.state.hasta);
    }


    cargarLimitesDependencias(datos){;
        let depen = this.state.dependencias;
        let ref = this.state.ref;
        for (let x = 0; x < datos.budgets.length; x++){
            if(datos.budgets[x][0] in ref){
                let ind = ref[datos.budgets[x][0]];
                depen[ind][depen[ind].length - 2] = datos.budgets[x][datos.budgets[x].length - 1];
            }
        }
        console.log(depen);
        this.setState({
            dependencias:depen,
        },this.pedirGastosDependencias());
    }

    pedirLimitesDependencias(){
        this.db.pedir_dependencias_limite(this.cargarLimitesDependencias);
    }

    cargarDependencias(datos){
        console.log(datos);
        let dependencias = [];
        let ref={};
        datos.dependencies.map((elem,index)=>{
            elem.push(0);
            elem.push(0);
            dependencias.push(elem);
            ref[elem[0]]= index;
        });
        datos['sub-dependencies'].map((elem,index)=>{
            elem.push(0);
            elem.push(0);
            dependencias.push(elem);
            ref[elem[0]]= index;
        });

        console.log(dependencias)
        this.setState({
            dependencias:dependencias,
            ref:ref,
        },()=>(this.pedirLimitesDependencias()));

        
    }

    pedirDependenciasAsociadas(){
        this.db.pedir_dependencias_jurisdiccion(this.cargarDependencias,this.state.codigo)
    }

    componentWillReceiveProps(props){
        let depen = this.state.dependencias;
        if (props.codigo !== this.state.codigo){
            depen = [];
        }

        this.setState({
            codigo:props.codigo,
            secretaria:props.secretaria,
            limite:props.limite,
            gastos:props.gastos,
            dependencias:depen,
            desde:props.desde,
            hasta:props.hasta,
        },()=>(this.pedirDependenciasAsociadas()))
        

    }

    listarDependencias(){
        if(this.state.dependencias.length === 0 ){
            return null;
        }

        return this.state.dependencias.map((elem,index)=>(
            <TarjetaDepen limite={elem[elem.length - 2]} gastado={elem[elem.length - 1]} descripcion={elem[1]} ></TarjetaDepen>
        ))
    }

    render(){

        let gastoTotal = 0;
        this.state.gastos.map((elem)=>(gastoTotal += parseFloat(elem)));

        return(
            <Paper style={{float:'left',display:'inline-block',width:'400px',margin:'5px',height:'600px'}} >
                <div style={{margin:'5px'}} >
                    <div style={{textAlign:'center'}}>
                        <label style={{fontSize:'22px'}} >{this.state.secretaria}</label>
                    </div>
                    <br/>
                    <Tabs>
                        <Tab label='Secretaria' >
                            <label >Gastos del periodo Seleccionado : </label>
                            <label htmlFor=""> {gastoTotal}</label>

                        </Tab>
                        <Tab label='Dependencias'>
                            <div style={{width:'100%',height:'490px',overflowY:'auto',flexDirection:'column'}} >
                            {this.listarDependencias()}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                
            </Paper>
        )
    }
}




class Tarjetas extends Component{

    constructor(props){
        super(props);
        this.state={
            secretarias:props.secretarias,
            consumos:props.consumos
        }

        this.actualizarActual = props.funAct;

    }


    componentWillReceiveProps(props){
        this.setState({
            secretarias:props.secretarias,
            consumos:props.consumos,
        })
    }

    generarTarjetas(){

        let lista = this.state.secretarias;
        if(lista.lenght === 0 ){
            return []
        }

        return lista.map((elem,index)=>{
            let gastos = 0
            if(elem[0] in this.state.consumos){
                gastos = this.state.consumos[elem[0]].reduce((a,b)=>(parseFloat(a) + parseFloat(b)),0);
            }
            return <Tarjeta codigo={elem[0]} nombre={elem[1]} limite={elem[2]} 
            gastado={gastos} funAct={this.actualizarActual} ></Tarjeta>
        })
    }


    render(){

        return(
            <div style={{minWidth:'300px',maxWidth:'700px',float:'left'}} >
                {this.generarTarjetas()}
            </div>
        )
    }
}


class Tarjeta extends Component{
    
    constructor(props){
        super(props);

        this.state={
            codigo:props.codigo,
            nombre:props.nombre,
            limite:props.limite,
            gastado:props.gastado,
        }

        this.seleccionar = props.funAct;
        this.marcarActual = this.marcarActual.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            codigo:props.codigo,
            nombre:props.nombre,
            limite:props.limite,
            gastado:props.gastado,
        })
    }

    marcarActual(evento){
        this.seleccionar(this.state.codigo);
    }

    render(){

        return( 
            <Paper style={{display:'inline-block',width:'300px',margin:'10px',height:'90px'}} onClick={this.marcarActual} >
                <div style={{margin:'5px'}}>
                    <label htmlFor="">{this.state.nombre}</label>
                    <br/>
                    <label htmlFor="">Gastado:</label>
                    <label htmlFor="">${this.state.gastado}</label>
                    <label htmlFor="" style={{marginLeft:'5px'}} > De </label>
                    <label htmlFor="">${this.state.limite}</label>
                </div>
            </Paper>
        )
    }
}


class TarjetaDepen extends Component{

    constructor(props){
        super(props);

        this.state ={
            descripcion:props.descripcion,
            limite:props.limite,
            gastado:props.gastado
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            descripcion:props.descripcion,
            limite:props.limite,
            gastado:props.gastado
        })
    }

    render(){

        return(
            <Paper style={{width:'360px',height:'70px',display:'block'}} >
                <div style={{margin:'5px'}} >
                    <label htmlFor="">{this.state.descripcion}</label>
                    <br/>
                    <label style={{width:'70px', display:'inline-block'}} >Gastado: </label>
                    <label htmlFor="">${this.state.gastado}</label>
                    <label style={{width:'30px',display:'inline-block',marginLeft:'5px'}}> de </label>
                    <label htmlFor="">${this.state.limite}</label>         
                </div>
                <br/>
            </Paper>
        )
    }
}