import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem,SelectField,MenuItem,
    TableRow,TableBody,TableRowColumn,Table,TableHeader,TableHeaderColumn,
    Checkbox} from 'material-ui';
import DBHandler from './DBHandler.js';
import {codificarPermiso,DecodificarPermisos,codificarPermisos} from './Permisos';


export default function main(){
    let root = document.getElementById('main');
    root.limpiar();

    ReactDOM.render(
        <div style={{margin:"30px"}}>
            <MUICont>
                <Usuarios/>
            </MUICont>
        </div>,
        root
    )
} 


class Usuarios extends Component{

    constructor(props){
        super(props);

        this.state={
            dependencias:[],
            secretarias:[],
            usuarios:[],
            elegido:null,
        }
        this.db = new DBHandler();
        this.pedirUsuarios = this.pedirUsuarios.bind(this)
        this.cargarUsuarios = this.cargarUsuarios.bind(this);
        this.pedirUsuarios();
    }

    cargarUsuarios(usuarios){
        console.log(usuarios);
        let lista = [];
        lista = usuarios['users'].map((valor,indice) => {
            return <ListItem value={valor} primaryText={valor} key={indice}
            onClick={()=>{
                this.setState({elegido:valor[0]})}
            } ></ListItem>
        })
        this.setState({usuarios:lista})
    }

    pedirUsuarios(){
        this.db.pedir_usuarios(this.cargarUsuarios)
    }


    render(){

        let edicion = null
        if(this.state.elegido != null){
            edicion = <DatosUsuario usuario={this.state.elegido}
            renovarUsuarios={this.pedirUsuarios}/>
        }


        return(
            <div style={{height:'100%'}}>
                <Paper style={{width:'200px',height:'80%',overflowY:'auto',display:'inline-block',margin:'5px'}}>
                    <RaisedButton
                        primary={true}
                        label="Nuevo"
                        onClick={()=>this.setState({elegido:''})}
                        />
                    <ListaUsuarios usuarios={this.state.usuarios}/>
                </Paper>
                <Paper style={{display:'inline-block',verticalAlign:'top',marginLeft:'10px'}} >
                    {edicion}
                </Paper>
            </div>
        )
    }
}



class ListaUsuarios extends Component{
    constructor(props){
        super(props);
        this.state={
            usuarios:props.usuarios
        }

    }

    componentWillReceiveProps(props){
        this.setState({usuarios:props.usuarios})
    }

    render(){
        return(
            <div>
                <List>
                    {this.state.usuarios}
                </List>
            </div>
        )
    }
}






class DatosUsuario extends Component{
    constructor(props){
        super(props);
        let usuarioFijo = true;
        if(props.usuario == ''){
            usuarioFijo = false
        }

        this.state={
            usuario:props.usuario,
            contra:'',
            dependencia:'',
            secretaria:'',
            dependencias:[],
            secretarias:[],
            informePrincipal:'',
            datosBasicos:false,
            actualizarInasistencias:false,
            depurarLicenciasAnuales:false,
            limitePresupuestario:false,
            bloquearDependencias:false,
            conceptos:false,
            cargaManualPresentismo:false,
            depuracionPresentismo:false,
            planillones:false,
            presentes:false,
            presentismoPorLegajo:'',
            informes:'',
            creacionUsuarios:false,
            originales:{},
            usuarioFijo:usuarioFijo,
        }
        this.renovarUsuarios = props.renovarUsuarios;
        this.db = new DBHandler();
        this.actualizarUsuario = this.actualizarUsuario.bind(this);
        this.cargarUsuario = this.cargarUsuario.bind(this);
        if(props.usuario != ''){
            this.db.pedir_datos_usuario(this.cargarUsuario)
        }
    }

    componentWillReceiveProps(props){

        if (this.state.usuario === props.usuario){
            return;
        }

        let usuarioFijo = true;
        if(props.usuario == ''){
            usuarioFijo = false
        }

        this.setState({
            usuario:props.usuario,
            contra:'',
            dependencia:'',
            secretaria:'',
            dependencias:[],
            secretarias:[],
            informePrincipal:'',
            datosBasicos:false,
            actualizarInasistencias:false,
            depurarLicenciasAnuales:false,
            limitePresupuestario:false,
            bloquearDependencias:false,
            conceptos:false,
            cargaManualPresentismo:false,
            depuracionPresentismo:false,
            planillones:false,
            presentes:false,
            presentismoPorLegajo:'',
            informes:'',
            creacionUsuarios:false,
            originales:{},
            usuarioFijo:usuarioFijo,
        })

        if(props.usuario != ''){
            this.db.pedir_datos_usuario(this.cargarUsuario)
        }
    }


    cargarUsuario(datos){
        let permisos = datos['levels']
        permisos = DecodificarPermisos(permisos);

        
    }

    usuarioCreado(respuesta){

        this.setState({usuarioFijo:true})
        this.renovarUsuarios();
    
    }

    actualizarUsuario(){

        if(!this.state.usuarioFijo){
            this.db.crear_usuario(this.usuarioCreado,this.state.usuario,this.state.contra)
        }



        let datos ={
            informePrincipal: this.state.informePrincipal,
            datosBasicos: this.state.datosBasicos,
            actualizarInasistencias:this.state.actualizarInasistencias,
            depurarLicenciasAnuales: this.state.depurarLicenciasAnuales,
            limitePresupuestario : this.state.limitePresupuestario,
            bloquearDependencias : this.state.bloquearDependencias,
            conceptos: this.state.conceptos,
            cargaManualPresentismo: this.state.cargaManualPresentismo,
            depuracionPresentismo: this.state.depuracionPresentismo,
            planillones: this.state.planillones,
            presentes: this.state.presentes,
            presentismoPorLegajo: this.state. presentismoPorLegajo,
            informes: this.state.informes,
            creacionUsuarios: this.state.creacionUsuarios,
        }

        if(this.state.originales.length > 0){

        }
    }

    render(){

        let habilitar = false;
        if(this.state.usuario != '' && this.state.contra != ''){
            habilitar = true;
        }

        let textoBoton = 'Actualizar';
        if(!this.state.usuarioFijo){
            textoBoton = 'Guardar';
        }

        let boton = <RaisedButton
            primary={true}
            label={textoBoton}
            onClick={this.actualizarUsuario} 
            disabled={!habilitar}/>

        let campos = null;
        if(this.state.usuarioFijo){
            campos = <div>
                <SelectField
                        value={this.state.informePrincipal}
                        floatingLabelText="Informe Principal"
                        floatingLabelFixed={true}
                        onChange={(e, i, value) => this.setState({ informePrincipal:value })} >
                        <ListItem primaryText="Total" value='informePrincipalTotal' />
                        <ListItem primaryText="Secretaria" value='informePrincipalSecretaria' />
                        <ListItem primaryText="Dependencia" value='informePrincipalDependencia' />
                        <ListItem primaryText="No" value='' />
                    </SelectField>
                    <Checkbox
                        checked={this.state.datosBasicos}
                        label="Datos Basicos y Cronogramas"
                        labelPosition='left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({datosBasicos:'datosBasicos' })
                            } 
                            else{
                                this.setState({datosBasicos:false})
                            }}
                        }/>
                    <Checkbox
                        checked={this.state.actualizarInasistencias}
                        label="Actualizar inasistencias"
                        labelPosition = 'left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({actualizarInasistencias:'actualizarInasistencias' })
                            } 
                            else{
                                this.setState({actualizarInasistencias:false})
                            }}
                        }/>
                    <br/>
                    <Checkbox
                        checked={this.state.depurarLicenciasAnuales}
                        label="Depuracion de licencias anuales"
                        labelPosition = 'left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({depurarLicenciasAnuales:'depurarLicenciasAnuales' })
                            } 
                            else{
                                this.setState({depurarLicenciasAnuales:false})
                            }}
                        }/>
                    <Checkbox
                        checked={this.state.limitePresupuestario}
                        label="Limite Presupuestario"
                        labelPosition ='left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({limitePresupuestario:'limitePresupuestario' })
                            } 
                            else{
                                this.setState({limitePresupuestario:false})
                            }}
                        }/>
                    <br/>
                    <Checkbox
                        checked={this.state.bloquearDependencias}
                        label="Bloqueo de dependencias"
                        labelPosition = 'left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({bloquearDependencias:'bloquearDependencias' })
                            } 
                            else{
                                this.setState({bloquearDependencias:false})
                            }}
                        }/>
                    
                    <Checkbox
                        checked={this.state.conceptos}
                        label="Ver y modificar Conceptos"
                        labelPosition = 'left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({conceptos:'verConceptos' })
                            } 
                            else{
                                this.setState({conceptos:false})
                            }}
                        }/>
                    <br/>
                    <Checkbox
                        checked={this.state.cargaManualPresentismo}
                        label="Carga Manual de Presentismo"
                        labelPosition = 'left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({cargaManualPresentismo:'cargaManualPresentismo' })
                            } 
                            else{
                                this.setState({cargaManualPresentismo:false})
                            }}
                        }/>
                    <Checkbox
                        checked={this.state.depuracionPresentismo}
                        label="Depuracion de presentismos"
                        labelPosition='left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({depuracionPresentismo:'depuracionPresentismos' })
                            } 
                            else{
                                this.setState({depuracionPresentismo:false})
                            }}
                        }/>
                    <br/>
                    <Checkbox
                        checked={this.state.planillones}
                        label="Planillones"
                        labelPosition = 'left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({planillones:'planillones' })
                            } 
                            else{
                                this.setState({planillones:false})
                            }}
                        }/>
                    <Checkbox
                        checked={this.state.presentes}
                        label="Ver Presentes"
                        labelPosition = 'left'
                        onCheck={(e, checked) => {
                            if(checked){
                                this.setState({presentes:'presentes' })
                            } 
                            else{
                                this.setState({presentes:false})
                            }}
                        }/>
                    <br/>
                    <SelectField
                        value={this.state.presentismoPorLegajo}
                        floatingLabelText="Presentismo por legajo"
                        floatingLabelFixed={true}
                        onChange={(e, i, value) => this.setState({ presentismoPorLegajo:value })}>
                        <ListItem primaryText="No" value='' />
                        <ListItem primaryText="Todos" value='presentismoPorLegajoTodos' />                    
                    </SelectField>
                    <br/>
                    <SelectField
                        value={this.state.informes}
                        floatingLabelText="Informes"
                        floatingLabelFixed={true}
                        onChange={(e, i, value) => this.setState({ informes:value })}>
                        <ListItem primaryText="No" value='' />
                        <ListItem primaryText="Total" value='InformesTotal'/>
                    </SelectField>
            </div>
        }

        return(
            <div style={{margin:'5px'}} >
                <TextField
                floatingLabelText="Usuario"
                value={this.state.usuario} 
                disabled={this.state.usuarioFijo}
                onChange={(obj,value)=>this.setState({usuario:value})}/>
                <TextField
                    floatingLabelText="Contraseña"
                    value={this.state.contra}
                    disabled={this.state.usuarioFijo}
                    onChange={(obj,value)=>this.setState({contra:value})}/>
                <br/>
                {campos}
                <br/>
                {boton}
            </div>
        )
    }
}