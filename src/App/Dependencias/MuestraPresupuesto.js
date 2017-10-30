import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem,Divider} from 'material-ui';
import dbHandler from '../DBHandler.js';



export default function main(props){
    let root = document.getElementById('main');
    root.limpiar();


    ReactDOM.render(
        <div style={{margin:"30px",height:'100%'}}>
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
            dependencias:[],
            dicDepen:{},
            dicSubDepen:{},
            filtro:'',
            seleccion:'',
        }
        this.pedirDependencias = this.pedirDependencias.bind(this);
        this.cargarDependencias = this.cargarDependencias.bind(this);
        this.actualizar = this.actualizar.bind(this);
        this.pedirDependencias();
    }

    actualizar(valor,campo){
        this.setState({[campo]:valor});
    }

    

    cargarDependencias(datos){
        let total = datos['dependencies_status'];
        let dicDepen = {}
        let dicSubDepen = {}
        let depen = [];
        let totalDepen = 0;

        for( let x = 0; x < total.length; x++){
            if(!total[x][2]){
                dicDepen[total[x][0]] = total[x];
                total[x].push(totalDepen);
                depen.push(total[x]);
                totalDepen += 1;
            }
            else{
                if ( !(total[x][2] in dicSubDepen) ){
                    dicSubDepen[total[x][2]] = [];
                }
                dicSubDepen[total[x][2]].push(total[x]);
            }
        }
        this.setState({dependencias:depen,dicDepen:dicDepen,dicSubDepen:dicSubDepen});
    }

    pedirDependencias(){
        let db = new dbHandler();
        //db.pedir_dependencias_estado(this.cargarEstados);
        db.pedir_dependencias(this.cargarDependencias)

    }


    render(){
        let elegido = this.state.seleccion
        let vista = null;
        if(elegido && elegido.length > 0){
            vista = <Vista 
                dependencia={this.state.dicDepen[ elegido ]}
                subDepen={this.state.dicSubDepen[ elegido ]}
                />}
        return(
            <div>
                <div style={{width:'100%',height:'200px'}}>
                    <label htmlFor="" style={{textDecoration:'underline',fontSize:'20px'}} >Gastos totales del municipio del mes actual</label>
                    <br/>
                    <label htmlFor="">Gastos de Presupuesto Mensual: $0</label>
                    <br/>
                    <label htmlFor="">Limite Presupuestado : $0</label>
                </div>
                <div style={{display:'inline-block',margin:'10px'}} >
                    <BarraFiltrado funAct={this.actualizar}/>
                    <Listado dependencias={this.state.dependencias} funAct={this.actualizar} filtro={this.state.filtro}/>
                </div>
                <div style={{display:'inline-block',verticalAlign:'top',margin:'10px',marginTop:'30px'}} > 
                    {vista}
                </div>
            </div>
        )

    }
    
    
}

class Vista extends Component{
    constructor(props){
        super(props);
        this.state={
            dependencia:props.dependencia,
            subDepen:props.subDepen,
        }
    }

    cargarSubSecretarias(){
        let titulo =[<label style={{ textDecoration:'underline', fontSize:'18px' }}> Sub-Secretarias </label>]
        if(!this.state.subDepen){
            return []
        }
        return titulo.concat(this.state.subDepen.map((elem,ind)=>(
            <div>
                <ListItem disabled >
                    <label style={{width:'200px'}} >{elem[1]}</label>
                    <br/>
                    <label style={{width:'120px',display:'inline-blocks'}}>Gastado:</label>
                    <label style={{width:'120px',marginLeft:'10px'}}>${elem[3]}</label>
                    <br/>
                </ListItem>
                <Divider inset={true}/>
            </div>
            )   )
        )
    }

    componentWillReceiveProps(props){
        this.setState({
            dependencia:props.dependencia,
            subDepen:props.subDepen,
        })
    }

    render(){
        return(
            <Paper style={{width:'500px',top:'20px',minHeight:'400px'}} >
                <div style={{margin:'5px'}}>
                    <label style={{ textDecoration:'underline', fontSize:'20px',paddingBottom:'15px' }}>{this.state.dependencia[1]}</label>
                    <br/>
                    <label>Gastos de Presupuesto Mensual: 0</label>
                    <br/>
                    <label>Limite Presupuestado: {this.state.dependencia[4]}</label>
                    <br/>

                    {this.cargarSubSecretarias()}

                </div>
            </Paper>
        )
    }

}

class Listado extends Component{

    constructor(props){
        super(props);
        this.state={
            dependencias:props.dependencias,
            filtro:props.filtro
        }
        this.actualizarDependencia = this.actualizarDependencia.bind(this);
        this.seleccionarDependencia = props.funAct;
    }

    componentWillReceiveProps(props){
        this.setState({
            dependencias:props.dependencias,
            filtro:props.filtro
        })
    }

    actualizarDependencia(dependencia){
        this.seleccionarDependencia(dependencia,'seleccion');

    }


    armarListado(){

        let final = []; //listado final a mostrar
        let listado = this.state.dependencias;
        for(let x = 0; x < listado.length; x++){
            if(listado[x][1].toLowerCase().includes(this.state.filtro.toLowerCase())){
                final.push(
                    <Tarjeta nombre={listado[x][1]} codigo={listado[x][0]} limite={listado[x][2]} monto={listado[x][3]} 
                    funAct={this.actualizarDependencia} actualizando={listado[x][4]}/>
                )
            }
        }
        return final;
    }

    render(){
        
        return(
            <Paper style={{width:'350px',height:'100%'}} >
                <List>
                    {this.armarListado()}
                </List>
            </Paper>
        )
    }

}


class Tarjeta extends Component{

    constructor(props){
        super(props)
        this.state={
            nombre:props.nombre,
            codigo:props.codigo,
            orden:props.orden,
            limite:props.limite,
            monto:props.monto//dinero gastado
        }
        this.actualizarDependencia = props.funAct;
        this.cargarDependencia = this.cargarDependencia.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            nombre:props.nombre,
            codigo:props.codigo,
            orden:props.orden,
            limite:props.limite,
            monto:props.monto//dinero gastado
        })
    }

    cargarDependencia(){
        console.log('toca')
        this.actualizarDependencia(this.state.codigo);
    }

    render(){
        
        return(
            <ListItem onClick={this.cargarDependencia}>
                <label style={{width:'120px',fontSize:'14px'}}>{this.state.nombre}</label>
                <br/>
                <label style={{width:'90px'}}>Gastado: ${this.state.monto}</label>
                <br/>
                <label style={{width:'90px'}}>Presupuesto: ${this.state.limite}</label>
            </ListItem>
        )
    }
}

class BarraFiltrado extends Component{
    
        constructor(props){
            super(props);
            this.actualizarPadre = props.funAct;
        }
    
        render(){
    
    
            return(
                <div>
                    <TextField onChange={(evento)=>{this.actualizarPadre(evento.target.value,'filtro')}}
                        floatingLabelText={<label>Filtrar por Nombre</label>}/>
                </div>
            )
        }
    
    
    
    }
    