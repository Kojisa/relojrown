import jwt from 'jsrsasign';
import PermisosUsuario from './PermisosUsuario.js';
import DatosBasicos from './GestionPersonal/DatosBasicos.js';
import ActualizacionInasistencias from './Inasistencias/ActualizacionInasistencias.js'
import DepuracionLicenciasAnuales from './Licencias/DepuracionLicenciasAnuales.js'
import CreacionConceptos from './Conceptos/CreacionConceptos.js';
import limitePresu from './Dependencias/LimitePresupuestario.js';
import bloquearDepend from './Dependencias/BloquearDependencias.jsx';
import React from "react";
import db from './DBHandler';
import injectTapPlugin from 'react-tap-event-plugin';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,AppBar,Drawer,List,ListItem} from 'material-ui';
import listadoConceptos from './Conceptos/ListadoConceptos';
import AgregarHorarioManual from './GestionPersonal/CargaManualPresentismo';
import DepurarHorarios from './GestionPersonal/DepurarHorarios';
import Planillones from './GestionPersonal/Planillones';
import VerPresentes from './Inasistencias/VerPresentes';
import AsistenciaPorLegajo from './Inasistencias/AsistenciaPorLegajo';
import HorasExtras from './Dependencias/HorasExtras';
import informes from './Informes/PrincipalInformes';
import Home from './Home/HomeCuentas';
import Usuarios from './Usuarios';
import InformePresentes from './Informes/Asistencias';
import HOME from 'homedir';
    
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
            this.cambiarEstado = this.cambiarEstado.bind(this);
        }
    
        crearLista(){
            //let permisos = new PermisosUsuario();
            let lista = [
                {'nombre':'Principal',
                funcion:Home},
                {'nombre':'Datos Basicos',
                'funcion':DatosBasicos},
                //{'nombre':'Actualización de Inasistencias',
                //'funcion':ActualizacionInasistencias},
                //{'nombre':'Depuración de Licencias Anuales',
                //'funcion':DepuracionLicenciasAnuales},
                //{'nombre':'Limite Presupuestario',
                //'funcion':limitePresu},
                //{'nombre':'Bloquear Dependencias',
                //'funcion':bloquearDepend},
                {'nombre':'Conceptos',
                'funcion':listadoConceptos},
                {'nombre':'Carga Manual de Presentismo',
                'funcion':AgregarHorarioManual},
                //{'nombre':'Depuracion de Presentimos',
                //'funcion':DepurarHorarios},
                //{'nombre':'Planillones',
                //'funcion':Planillones},
                //{'nombre':'Presentes',
                //'funcion':VerPresentes},
                {'nombre':'Presentismo Por Legajo',
                'funcion':AsistenciaPorLegajo},
                //{'nombre':'Horas Extras',
                //'funcion':HorasExtras},
                {'nombre':'Informes',
                'funcion':informes},
                {'nombre':'Asistencias',
                'funcion':InformePresentes},
                {'nombre':'Usuarios',
                'funcion':Usuarios},
                

                
            ];
    
            return lista;
    
        }
    
        cambiarEstado(){
            this.setState((prev)=>{return {abierto:!prev.abierto}});
        }

        componentDidMount(){
            this.setState({titulo:'Principal'},Home());
        }
    
        componentWillReceiveProps(props){
            if(props.render && props.render !== this.state.render){
                this.setState({render:props.render,
                titulo:'Principal'},Home());
            }
            
        }
    
        generarListado(){
            let lista = [];
            if(this.state.render){
                lista = this.crearLista();
            }
            return lista.map((opcion,index) => (<ListItem className="mdc-list-item" 
            onClick={()=>{this.setState({titulo:opcion.nombre}); opcion.funcion(); this.cambiarEstado()}}
            key={index.toString()}>{opcion.nombre}</ListItem>));
        }
    
        devolverNav(){
            return this.nav;
        }
    
        render(){
            return (
                <MUICont>
                    <div>
                        <AppBar title={this.state.titulo} onLeftIconButtonTouchTap={this.cambiarEstado} style={{width:'100%',position:'fixed',top:'0px'}} />
                        <Drawer docked={false} width={300} open={this.state.abierto} onRequestChange={this.cambiarEstado} >
                            <List>
                                {this.generarListado()}
                            </List>
                        </Drawer>
                    </div>
                </MUICont>
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
            this.enviar_login = this.enviar_login.bind(this);
            this.cargar_usuario = this.cargar_usuario.bind(this);
            this.actualizarDatos = this.actualizarDatos.bind(this);
            this.funcionEnter = this.funcionEnter.bind(this);
        }
    
        enviar_login(){
            this.db.pedir_usuario(this.cargar_usuario,this.state.us,this.state.pas);
        }
        cargar_usuario(datos){
            if('error' in datos){
                return;
            }
            
            let dic = {
                a:'2',
                b:'3',
            }
            document.cookie = "auth_token="+datos["auth_token"];
            document.cookie =  'username='+this.state.us;
            this.state.onLogin(this.state.us,datos['auth_token'])
        }
        
        funcionEnter(ev){
            if(ev.key==='Enter'){
                if(this.state.us.length > 0 && this.state.pas.length > 0){
                    this.enviar_login();
                    ev.preventDefault();
                }
            }
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
                            <TextField floatingLabelText={<label>Usuario</label>} name='us' onChange={this.actualizarDatos}
                            onKeyPress={this.funcionEnter}/>
                            <br/>
                            <TextField floatingLabelText={<label>Contraseña</label>} name='pas' onChange={this.actualizarDatos}
                             type='password' onKeyPress={this.funcionEnter}/>
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
                usuario:'',
                token:'',
            }
            this.logueado = this.logueado.bind(this);
            this.cambiarEstadoNav = this.cambiarEstadoNav.bind(this);
            injectTapPlugin();
        }
    
    
        ver_cookie(datos){
            document.cookie = "auth="+datos["auth_token"] + ";";
            this.setState({render:true});
        }
        cambiarEstadoNav(){
            this.setState((prev)=>({estadoNav:!this.state.estadoNav}))
        }
    
        logueado(us,token){
            this.setState({loged:true,
                render:true,
                usuario:us,
                token:token});
            //this.mainCont.limpiar = limpiarCont;
        }
    
        
    
        render(){
            
            if(this.state.loged === false){
                return(<Login onLogin={this.logueado} />)
            }
    
            return (
                <div >
                    <Nav  render={this.state.render} ref={(elem)=>{this.nav = elem}} abierto={this.state.estadoNav}/>
                    <div ref={(elem)=>{this.mainCont=elem;if(elem)elem.limpiar=limpiarCont}} id="main" 
                    style={{display:"inline-block",overflowY:"auto",height:"100%",width:"100%",marginTop:'60px'}} >
                    
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