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
                ['codigo1','nombre1','budget1','consumo1'],
                ['codigo2','nombre2','budget2','consumo2'],
                ['codigo3','nombre3','budget3','consumo3'],
                
            ],
            ref:{
                'codigo1':0,
                'codigo2':1,
                'codigo3':2,
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
        console.log(codigo);
        this.setState({
            elegido:codigo,
        })
    }

    cargarHorasExtras(datos){
        console.log(datos);
        let secret = this.state.secretarias;
        for(let x = 0; x < datos.overtimes.lenght; x++){

           
            if(datos.overtimes[x][0] in this.state.ref){
                secret[this.state.ref[ datos.overtimes[x][0] ] ] [3] = datos.overtimes[x][2];
                   
            }
        }
        this.setState({
            secretarias:secret,
        })


    }

    pedirHorasExtras(datos){
        
        let refs = {};
        let secretarias = datos.budgets;
        for (let x = 0 ; x < datos.budgets.lenght; x++){
            refs[datos.budgets[x][0]] = x;
            secretarias.push(0);
        }
        

        this.setState({
            secretarias:datos.budgets,
            ref:refs, //guardo las referencais 
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
            limite={secre[2]} gastos={secre[3]} ></PanelInfo>
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
                <Tarjetas secretarias={this.state.secretarias} funAct={this.actualizarElegido}></Tarjetas>
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
        }

        this.db = new DBHandler();
        this
    }

    cargarDependencias(datos){
        this.setState({
            dependencias:datos.budget,
        })
    }

    pedirDependenciasAsociadas(){
        this.db.pedir_dependnecias_horas_extras()
    }


    render(){

        return(
            <Paper style={{float:'left',display:'inline-block',width:'400px',margin:'5px',height:'600px'}} >
                <div style={{margin:'5px'}} >
                    <div style={{textAlign:'center'}}>
                        <label style={{fontSize:'22px'}} >{this.state.secretaria}</label>
                    </div>
                    <br/>
                    <Tabs>
                        <Tab label='Secretaria' >
                            <label >Gastos del mes Actual : </label>
                            <label htmlFor=""> {this.state.gastos}</label>

                        </Tab>
                        <Tab label='Dependencias' >

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
        }

        this.actualizarActual = props.funAct;

    }


    componentWillReceiveProps(props){
        this.setState({
            secretarias:props.secretarias,
        })
    }

    generarTarjetas(){

        let lista = this.state.secretarias;
        if(lista.lenght === 0 ){
            return []
        }

        return lista.map((elem,index)=>(
            <Tarjeta codigo={elem[0]} nombre={elem[1]} limite={elem[2]} 
            gastado={elem[3]} funAct={this.actualizarActual} ></Tarjeta>
        ))
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
            <Paper style={{display:'inline-block',width:'300',margin:'10px',height:'60px'}} onClick={this.marcarActual} >
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