import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem} from 'material-ui';
import dbHandler from '../DBHandler.js';



export default function main(props){
    let root = document.getElementById('main');
    root.limpiar();

    document.getElementById('titulo').innerText = 'Bloqueo de Dependencias';

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
            dependencias:[],
            dic:{},
            filtro:'',
        }
        this.pedirDependencias = this.pedirDependencias.bind(this);
        this.cargarDependencias = this.cargarDependencias.bind(this);
        this.actualizar = this.actualizar.bind(this);
        this.ajustarDependencias = this.ajustarDependencias.bind(this);
        this.pedirDependencias();
    }

    actualizar(valor,campo){
        this.setState({[campo]:valor});
    }

    ajustarDependencias(datos){
        let depen = datos['dependencies'].concat(datos['sub-dependencies']);
        for (let x = 0; x < depen.length; x++){
            this.state.dic[depen[0]][3] = true;
        }

    }

    cargarDependencias(datos){
        let todas = [];
        console.log(datos)
        let depen = datos.dependencies;
        let subDep = datos['sub-dependencies'];
        todas = depen.concat(subDep);
        todas.map((elem)=>{if(elem.length == 2){elem.push(null);}elem.push(false);elem.push(false)});
        todas.sort((a,b)=>{return a[1].localeCompare(b[1])});
        let dic = {};
        todas.map((elem)=>(dic[elem[0]]=elem));
        this.setState({dependencias:todas,dic:dic});
        let db = new dbHandler();
        db.pedir_dependencias_bloqueadas(this.ajustarDependencias);

    }

    pedirDependencias(){
        let db = new dbHandler();
        db.pedir_todas_las_dependencias(this.cargarDependencias);

    }


    render(){

        return(
            <div>
                
                <BarraFiltrado funAct={this.actualizar}/>
                <Listado lista={this.state.dependencias} funAct={this.actualizar} filtrado={this.state.filtro}/>
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
    }
    this.cargarListado = this.cargarListado.bind(this);
    this.actualizarPadre = props.funAct;
  }


  componentWillReceiveProps(props){

    this.setState({lista:props.lista,filtrado:props.filtrado});
  }

  actualizarDependencia(monto,codigo){

  }


  cargarListado(){

    let final = []; //listado final a mostrar
    let listado = this.state.lista;
    for(let x = 0; x < listado.length; x++){
        if(listado[x][1].toLowerCase().includes(this.state.filtrado.toLowerCase())){
            final.push(
                <Linea nombre={listado[x][1]} codigo={listado[x][0]}  bloqueado={listado[x][3]}
                funAct={this.actualizarDependencia} actualizando={listado[x][4]} key={x}/>
            )
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
            bloqueado:props.bloqueado,
            actualizando:props.actualizando
        }
        this.bloquear = this.bloquear.bind(this);
        this.desbloquear = this.desbloquear.bind(this);
    }
    
    actualizarMonto(evento){
        this.setState({nuevo:evento.target.value});
    }

    desbloquear(){
        let db = new dbHandler();
        db.desbloquear_dependencia(()=>(this.setState({actualizando:false,bloqueado:true})),this.state.codigo)
    }


    bloquear(){
        let db = new dbHandler();
        db.bloquear_dependencia(()=>(this.setState({actualizando:false,bloqueado:true})),this.state.codigo);
    }


    componentWillReceiveProps(props){
        this.setState({
            nombre:props.nombre,
            codigo:props.codigo,
            bloqueado:props.bloqueado,
            actualizando:props.actualizando
        })
    }

    render(){

        let boton = <RaisedButton label='Bloquear' secondary={true} onClick={this.bloquear}/>
        if(this.state.actualizando){
            boton = <RaisedButton label='Desbloquear'  onClick={this.desbloquear}/>
        }

        return(
            <ListItem disabled>
                <label style={{width:'200px',display:'inline-block'}} >{this.state.nombre}</label>
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