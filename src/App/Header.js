import {drawer} from "material-components-web/dist/material-components-web.js";
import React from "react";
import db from './DBHandler.js';
import jwt from 'jsrsasign';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,AppBar,Drawer} from 'material-ui';
import PermisosUsuario from './PermisosUsuario.js';
import injectTapPlugin from 'react-tap-event-plugin';
import DatosBasicos from './GestionPersonal/DatosBasicos.js';
import ActualizacionInasistencias from './Inasistencias/ActualizacionInasistencias.js'
import DepuracionLicenciasAnuales from './Licencias/DepuracionLicenciasAnuales.js'
import CreacionConceptos from './Conceptos/CreacionConceptos.js';
import limitePresu from './Dependencias/LimitePresupuestario.js';
import muestraPresu from './Dependencias/MuestraPresupuesto.js';
import bloquearDepend from './Dependencias/BloquearDependencias.js';




class Header extends React.Component{

    constructor(props){
        super(props);
        this.cambiarEstado = props.cambiarEstado;
    }


    funcionOnClick(fun){
        this.boton.onclick =fun; 
    }


    render(){
        return (
            <header className="mdc-toolbar mdc-elevation--z4" >
                    <div className="mdc-toolbar__row">
                        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
                            <button ref={(elem) => {this.boton = elem}} style={{background:"none",boxSizing:"border-box"}}
                                className="material-icons mdc-toolbar__icon--menu" onClick={this.cambiarEstado}>menu</button>
                            <span ref ={(elem) => {this.titulo = elem;}} id="titulo" className="mdc-toolbar__title catalog-title">Home</span>
                        </section>
                    </div>
            </header>)
    }
}





class Nav extends React.Component{
    lista = [ //futuro formato [nombre,icono,funcion]
        ];  

    controlNav;

    constructor(props){
        super(props);
        this.state = {
            render:props.render,
            abierto:false,
            titulo:''
        }
    }

    crearLista(){
        //let permisos = new PermisosUsuario();
        let lista = [
            {'nombre':'Datos Basicos',
            'funcion':DatosBasicos},
            {'nombre':'Actualización de Inasistencias',
            'funcion':ActualizacionInasistencias},
            {'nombre':'Depuración de Licencias Anuales',
            'funcion':DepuracionLicenciasAnuales},
            {'nombre':'Creacion de Conceptos',
            'funcion':CreacionConceptos},
            {'nombre':'Limite Presupuestario',
            'funcion':limitePresu},
            {'nombre':'Muestra de Gastos',
            'funcion':muestraPresu},
            {'nombre':'Bloquear Dependencias',
            'funcion':bloquearDepend},


        ];

        return lista;

    }

    componentDidMount(){
        let nav = this.devolverNav();
        let activador = drawer.MDCPersistentDrawer;
        this.controlNav = new activador(nav);
        this.controlNav.open = false;
    }

    cambiarEstado(){
        this.controlNav.open = !this.controlNav.open;
    }

    componentWillReceiveProps(props){
        if(props.render){
            this.setState({render:props.render});
        }
        if(props.abierto != null){
            this.controlNav.open = props.abierto;
        }
    }

    generarListado(){
        let lista = [];
        if(this.state.render){
            lista = this.crearLista();
        }
        return lista.map((opcion,index) => (<a className="mdc-list-item" 
        ref={(elem)=>{if(elem)elem.addEventListener("click",opcion.funcion)}}
        key={index.toString()}>{opcion.nombre}</a>));
    }

    devolverNav(){
        return this.nav;
    }

    render(){
        return (
            <aside ref={(elem) =>{this.nav = elem}} className="mdc-persistent-drawer mdc-typography">
                <nav  className="mdc-persistent-drawer__drawer" style={{height:'100%'}} >
                    <div className="mdc-persistent-drawer__toolbar-spacer"/>
                    <div className="mdc-list-group"/>
                    <nav className="mdc-list">
                        {this.generarListado()}                        
                    </nav>
                </nav>
            </aside>
            )
        
    }

}

class Login extends React.Component{

    constructor(props){
        super(props);
        this.db = new db();
        this.state={
            us:'',
            pas:'',
            onLogin:props.onLogin,
        }
        this.enviar_login = this.enviar_login.bind(this)
        this.cargar_usuario = this.cargar_usuario.bind(this)
        this.actualizarDatos = this.actualizarDatos.bind(this)
    }

    enviar_login(){
        this.db.pedir_usuario(this.cargar_usuario,this.state.us,this.state.pas);
    }
    cargar_usuario(datos){
        let token = datos['auth_token']
        if(token == null) {
            return;
        }
        document.cookie ='auth_token='+token;
        document.cookie= ' username='+this.state.us;
        this.state.onLogin()
    }

    actualizarDatos(evento,texto){
        let campo = evento.target.name;
        this.setState({[campo]:texto});

    }

    render(){
        return(
            <div style={{width:'100%',height:'100%',backgroundColor:'rgba(255,255,255,0.4)'}}>   
                <MUICont>
                    <Paper style={{width:'400dp',height:'300dp',marginLeft:'40%',marginRight:'60%'}} zDepth={1}>
                        <TextField floatingLabelText={<label>Usuario</label>} name='us' onChange={this.actualizarDatos}/>
                        <br/>
                        <TextField floatingLabelText={<label>Contraseña</label>} name='pas' onChange={this.actualizarDatos} type='password'/>
                        <br/>
                        <RaisedButton label='Ingresar' primary={true} onClick={this.enviar_login} style={{marginLeft:'50%'}}/>
                    </Paper>
                </MUICont>
            </div>
        )
    }


}



export default class main extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            render:false,
            loged:false,
            estadoNav:false,
        }
        this.logueado = this.logueado.bind(this);
        this.cambiarEstadoNav = this.cambiarEstadoNav.bind(this);
        injectTapPlugin();
    }

    componentDidMount(){
        this.db = new db();

    }

    ver_cookie(datos){
        document.cookie = "auth="+datos["token"] + ";";
        this.setState({render:true});
    }
    cambiarEstadoNav(){
        this.setState((prev)=>({estadoNav:!this.state.estadoNav}))
    }

    logueado(){
        this.setState({loged:true,render:true});
        //this.mainCont.limpiar = limpiarCont;
    }



    render(){
        
        if(this.state.loged === false){
            return(<Login onLogin={this.logueado}/>)
        }

        return (
            <div style={{display:"flex",flexDirection:"row",padding:'0',margin:'0',
                boxSizing:'border-box',height:'100%',width:'100%'}}>
                <Nav  render={this.state.render} ref={(elem)=>{this.nav = elem}} abierto={this.state.estadoNav}/>
                <div style={{display:"block",flexDirection:"column",flexGrow:"1",height:"100%",boxSizing:"border-box"}}>
                    <Header  ref={(elem)=>{this.header = elem}} cambiarEstado={this.cambiarEstadoNav}/>
                    <div ref={(elem)=>{this.mainCont=elem;if(elem)elem.limpiar=limpiarCont}} id="main" style={{display:"inline",overflowY:"auto",height:"100%",width:"90%"}} >
                </div>
                </div>
            </div>)
    }



}


function limpiarCont(){
    let cont = document.getElementById("main");
    let cant = cont.childNodes.length;
    for(let x = 0; x< cant; x++){
        cont.removeChild(cont.childNodes[0]);
    }

}