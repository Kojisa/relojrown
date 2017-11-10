import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem,Tab,Tabs} from 'material-ui';
import dbHandler from '../DBHandler.js';



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


    constructor(props){
        super(props);
        this.state={
            secretarias:[],
            dependencias:[],
            filtro:'',
        }
        this.pedirSecretarias = this.pedirSecretarias.bind(this);
        this.pedirDependencias = this.pedirDependencias.bind(this);
        this.cargarDependencias = this.cargarDependencias.bind(this);
        this.actualizarDependencia = this.actualizarDependencia.bind(this);
        this.actualizar = this.actualizar.bind(this); 
        this.cargarSecretarias = this.cargarSecretarias.bind(this);

        this.db = new dbHandler();
        this.pedirDependencias();
        this.pedirSecretarias();
    }

    actualizar(valor,campo){
        this.setState({[campo]:valor});
    }

    actualizarDependencia(monto,codigo){

        
    }

    cargarSecretarias(datos){
        let lista = datos.budgets;
        lista.map((elem)=>{elem.push(0);elem.push(false)});
        lista.sort((a,b)=>{return a[1].localeCompare(b[1])})
        this.setState({secretarias:lista});
    }

    pedirSecretarias(){
        this.db.pedir_limite_secretarias(this.cargarSecretarias)
    }

    cargarDependencias(datos){
        let lista = datos.budgets;
        lista.map((elem)=>{elem.push(0);elem.push(false)});
        lista.sort((a,b)=>{return a[1].localeCompare(b[1])})
        this.setState({dependencias:lista});
    }

    pedirDependencias(){
        this.db.pedir_dependencias_limite(this.cargarDependencias);

    }


    render(){

        return(
            <div>
                
                <BarraFiltrado funAct={this.actualizar}/>
                <Tabs>
                    <Tab label='Secretarias'>
                        <Listado tipo='secretarias' lista={this.state.secretarias} funAct={this.actualizar} filtrado={this.state.filtro}></Listado>
                    </Tab>
                    <Tab label='Dependencias' >
                        <Listado tipo='dependencias' lista={this.state.dependencias} funAct={this.actualizar} filtrado={this.state.filtro}/>
                    </Tab>
                </Tabs>
                
            </div>
        )

    }


}


class Listado extends Component {
  constructor(props) {
    super(props);
    this.state={
      lista:props.lista,
      filtrado:props.filtrado,
      tipo:props.tipo
    }
    this.cargarListado = this.cargarListado.bind(this);
    this.actualizarPadre = props.funAct;
  }


  componentWillReceiveProps(props){

    this.setState({lista:props.lista,filtrado:props.filtrado,tipo:props.tipo});
  }


  cargarListado(){

    let final = []; //listado final a mostrar
    let listado = this.state.lista;
    let maximo = 30;
    
    for(let x = 0; x < listado.length; x++){
        if(listado[x][1].toLowerCase().includes(this.state.filtrado.toLowerCase())){
            final.push(
                <Linea nombre={listado[x][1]} codigo={listado[x][0]} monto={listado[x][2]} nuevoLimite={listado[x][3]} 
                funAct={this.actualizarDependencia} actualizando={listado[x][4]} 
                tipo={this.state.tipo} key={x}/>
            )
            if(final.length === maximo){
                break;
            }
        }    
        
    }
    return final;
  }

  render(){

    return(
      <List>
          {this.cargarListado()}
      </List>
    )
  }


}


class Linea extends Component{
    constructor(props){
        super(props);
        this.state={
            nombre:props.nombre,
            codigo:props.codigo,
            monto:props.monto,
            nuevo:props.nuevoLimite,
            actualizando:props.actualizando,
            tipo:props.tipo
        }
        this.actualizarMonto = this.actualizarMonto.bind(this);
        this.actualizarLimite = this.actualizarLimite.bind(this);
    }
    
    actualizarMonto(evento){
        this.setState({nuevo:evento.target.value});
    }

    
    
    actualizarLimite(){
        let db = new dbHandler();
        
        let datos = this.state;
        datos['repeticion'] = 0;
        this.setState({actualizando:true});
        db.actualizar_limite(()=>(this.setState({actualizando:false})),datos,this.state.tipo);
        
    }

    componentWillReceiveProps(props){
        this.setState({
            nombre:props.nombre,
            codigo:props.codigo,
            monto:props.monto,
            nuevo:props.nuevoLimite,
            actualizando:props.actualizando
        })
    }

    render(){

        let boton = <RaisedButton label='Actualizar' onClick={this.actualizarLimite}/>
        if(this.state.actualizando){
            boton = <RaisedButton label='Actualizando' onClick={this.actualizarLimite} disabled/>
        }

        return(
            <ListItem disabled>
                <label style={{width:'190px',display:'inline-block'}} >{this.state.nombre}</label>
                <label style={{width:'250px',display:'inline-block',marginLeft:'10px'}} >Presupuesto Actual: ${this.state.monto}  </label>
                <TextField value={this.state.nuevo} onChange={this.actualizarMonto} style={{width:'120px'}} type='number'
                floatingLabelText={ <label htmlFor="">Nuevo Monto</label> } />
                {boton}
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
