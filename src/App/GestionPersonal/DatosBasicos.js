import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,SelectField,
    MenuItem,Checkbox,RadioButton,RadioButtonGroup,
    Tab,Tabs,AutoComplete} from 'material-ui';
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

        this.state ={
            legajo:'',
            persona:'',//nombre asociado al legajo
            tipoAsistencia:null,
            anios25:false,
            premio:null,
            dependencia:'',
            horarios:[
                {
                    building:23,
                    valid_from:'20170505',
                    valid_to:'20170605',
                    schedule:{
                        lunes:[8,8.5],
                        miercoles:[11,19.35]
                    }
                }
            ],

        }
        this.actualizarDatos = this.actualizarDatos.bind(this);
        this.actualizarHorarios = this.actualizarHorarios.bind(this);
    }

    actualizarDatos(dato,campo){
        this.setState({[campo]:dato});
    }

    actualizarHorarios(){
    }

    render(){
        let horarios = null;
        console.log(Object.keys(this.state.horarios).length)
        if(Object.keys(this.state.horarios).length != 0){
            horarios = <Horarios horarios={this.state.horarios} planillones={this.habilitarPlanillones}/>
        }
        

        return (
            <div >
                <div style={{display:'inline-block',margin:'5px'}}>
                    <DatosBasicos funAct={this.actualizarDatos} persona={this.state.persona}
                    tipoAsistencia={this.state.tipoAsistencia}
                    anios25={this.state.anios25}
                    premio={this.state.premio}
                    legajo={this.state.legajo}
                    dependencia={this.state.dependencia}
                    />
                </div>
                <div style={{display:'inline-block',margin:'5px',verticalAlign:'top'}}>
                    {horarios}
                </div>
                <div style={{float:'bottom',margin:'5px'}}>
                <RaisedButton label={<label>Actualizar Perfil</label>} primary={true}/>
                </div>
            </div>
        )
    }
}



class DatosBasicos extends Component{

    constructor(props){
        super(props);
        this.state = {
            legajo:props.legajo,
            persona:props.persona,
            tipoAsistencia:props.tipoAsistencia,
            anios25:props.anios25,
            premio:props.premio,
            dependencia:props.dependencia,
            dependencias:[''],
            dependenciasCodigo:{},
            codigoDependencias:{},
        }
        this.actualizarPadre = props.funAct;
        this.actualizarDatos = this.actualizarDatos.bind(this);
        this.actualizarTipoAsist = this.actualizarTipoAsist.bind(this);
        this.actualizarCheck = this.actualizarCheck.bind(this);
        this.actualizarPremio = this.actualizarPremio.bind(this);
        this.buscarNombre = this.buscarNombre.bind(this);
        this.db = new DBHandler();

        //this.db.pedir_todas_las_dependencias(this.cargarDependencias)
    }

    componentWillReceiveProps(props){
        this.setState({persona:props.persona,
            tipoAsistencia:props.tipoAsistencia,
            anios25:props.anios25,
            premio:props.premio,
            dependencia:props.dependencia})
    }

    cargarDependencias(datos){
        let listaFinal = [];
        let dependenciasCodigo = {};
        let codigoDependencias = {};
        for (let x = 0; x < datos['dependencies'].length; x++){
            listaFinal.push[datos['dependencies'][1]];
            dependenciasCodigo[datos['dependencies'][1]] = datos['dependencies'][0]; //para tener la referencia de que rependencia es.
            codigoDependencias[datos['dependencies'][0]] = datos['dependencies'][1];
        }
        this.setState({dependencias:listaFinal,dependenciasCodigo:dependenciasCodigo,codigoDependencias:codigoDependencias});
    }


    actualizarDatos(evento){

        let campo = evento.target.name;
        let dato = evento.target.value;
        this.actualizarPadre(dato,campo);
    }

    generarTiposAsistencia(){
        let tipos = ['S','N','B'];

        return tipos.map((elem,index)=>(<MenuItem value={elem} primaryText={elem} key={elem}/>))
    }

    buscarNombre(){
        let db = new DBHandler();
        db.pedir_nombre((dato)=>(this.setState({persona:dato.name})),this.state.legajo)
    }

    actualizarTipoAsist(evento,key,valor){
        this.actualizarPadre(valor,'tipoAsistencia');
    }

    actualizarCheck(evento, checked){
        this.actualizarPadre(checked,'anios25');

    }

    actualizarPremio(valor){
        this.actualizarPadre({'premio':valor});
    }

    render(){

        let dependencia = null;
        if(this.state.dependencias.length != 0){
            dependencia = <AutoComplete floatingLabelText={ <label htmlFor="">Dependencia(Horas Extras)</label> } 
            searchText={this.state.dependencia} dataSource={this.state.dependencias} 
            />
        }

        return(
            <div style={{width:'350px',display:'inline-block'}} >
                <div style={{marginLeft:'15px'}}>
                    <TextField floatingLabelText={<label>Legajo Nº</label>} onBlur={this.buscarNombre} onChange={this.actualizarDatos} name='legajo' type='number' style={{width:'150px'}} />
                    <TextField value={this.state.persona} floatingLabelText={<label>Nombre y Apellido</label>} disabled />
                    <br/>
                    <SelectField value={this.state.tipoAsistencia} floatingLabelText={<label>Registra Asistencia</label>} onChange={this.actualizarTipoAsist} >
                        {this.generarTiposAsistencia()}
                    </SelectField>
                    <br/>
                    <Checkbox label={<label>25 Años de servicio: </label>} checked={this.state.anios25} onCheck={this.actualizarCheck}
                     labelPosition='left' style={{paddingTop:'10px'}} />
                    <br/>
                    {dependencia}
                    <Premio funAct={this.actualizarPremio} premio={this.state.premio} />
                </div>
            </div>
        )
    }
}


class Premio extends Component{

    constructor(props){
        super(props);
        this.state={
            elegido:props.premio
        }
        
    }

    componentWillReceiveProps(props){
        this.setState({'elegido':props.premio})
    }

    render(){

        return(
            <div>
                <label >Estado De Premio </label>
                <RadioButtonGroup name='premio' labelPosition='left' style={{marginTop:'15px'}} valueSelected={this.state.elegido}>
                    <RadioButton value='a' label='Premio A'/>
                    <RadioButton value='b' label='Premio B'/>
                    <RadioButton value='no' label='No cobra premio'/>
                    <RadioButton value='excento' label='Excento de premio'/>
                    <RadioButton value='descuento' label='Descuento'/>
                    <RadioButton value='sinliq' label='Sin liquidacion'/>
                </RadioButtonGroup>
            </div>
        )
    }

}


class Horarios extends Component{
    
    constructor(props){
        super(props);
        this.state={
            horarios:props.horarios, //formato clave = dependencia, lista de horarios
            planillones:props.planillones,
        }
        this.habilitarPlanillones = props.habilitarPlanillones;
    }

    agregarPlanillon(){
    }

    cargarPlanillones(){
        let lista = [];
        for (let x = 0; x < this.state.horarios; x++){
            let tab = (<Tab label={this.state.horarios[x].building} key={x} value={this.state.horarios[x].building}> 
                <HorarioSemanal semana={this.state.horarios[x].schedule} />
                <br/>
                <RaisedButton label={<label>Eliminar Planillon</label>} secondary={true} style={{float:'right'}} />
            </Tab>);
            lista.push(tab);
        }
        lista.push(<Tab onActive={this.agregarPlanillon} label={<lable>+</lable>} key='+'> <AgregarPlanillon/> </Tab>);
        return lista;

    }

    componentWillReceiveProps(props){
        this.setState({horarios:props.horarios});
    }

    render(){
        return(
            <div style={{width:'350px'}}>
                <Tabs>
                    {this.cargarPlanillones()};
                </Tabs>
            </div>
        );
    }

}


class HorarioSemanal extends Component{
    constructor(props){
        super(props);

        this.state={
            semana:props.semana,
            dependencia:props.dependencia
        }
        this.cambiarIngreso = this.cambiarIngreso.bind(this);
        this.cambiarSalida = this.cambiarSalida.bind(this);
    }

    cambiarIngreso(evento){
        let dato = evento.target.value;
        let indice = parseInt(evento.target.name);

        let horarios = this.state.semana;
        horarios[indice][0] = dato;
        this.setState({'semana':horarios});


    }
    cambiarSalida(evento){
        let dato = evento.target.value;
        let indice = parseInt(evento.target.name);

        let horarios = this.state.semana;
        horarios[indice][1] = dato;
        this.setState({'semana':horarios});

    }

    generarSemana(){
        let datos = this.state.semana;
        let dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo','Feriados']
        if(!datos) return;

        let lista = dias.map((elem,index)=>{
            if(elem in datos)
            <div style={{width:'350px', marginLeft:'5px'}} key={index.toString()} >
                <span style={{width:'100px',display:'inline-block'}} >{dias[index]} :</span>
                <TextField value={elem[0]} onChange={this.cambiarIngreso} name={index.toString()} type='time' style={{width:'80px'}}/>
                -
                <TextField value={elem[1]} onChange={this.cambiarSalida} name={index.toString()} type='time' style={{width:'80px'}}/>
            </div>    
        }
    )
        return lista;
    }


    render(){

        return(
            <div>
             {this.generarSemana()}
            </div>
        )

    }
}

class AgregarPlanillon extends Component{

    constructor(props){
        super(props);

        this.state={
            planillones:{},
            codigos:{},
            codigo:'',
            nombre:'',
        }

        this.actualizarVariables = this.actualizarVariables.bind(this);
    }

    actualizarVariables(evento){
        let campo = evento.target.name;
        let valor = evento.target.value;

        if(campo == 'codigo'){
            if(valor in this.state.codigos){
                this.setState({
                    codigo:valor,
                    nombre:this.state.codigos[valor]
                })
            }
        }
        else if(campo == 'nombre'){
            if(valor in this.state.planillones){
                this.setState({
                    codigo:this.state.planillones[valor],
                    nombre:valor
                })
            }
        }
        else{
            this.setState({[campo]:valor});
        }

    }

    render(){
        return(
            <div style={{marginLeft:'5px',display:'inline-block'}}>
                <AutoComplete floatingLabelText={<label>Codigo Planillon</label>} searchText={this.codigo} name='codigo' type='text'
                onBlur={this.actualizarVariables} onNewRequest={(elegido,indice)=>{
                    let evento = {target:{name:'codigo',value:elegido}};
                    this.actualizarVariables(evento);
                }} dataSource={Object.keys(this.state.codigos).sort()}/>
                <AutoComplete floatingLabelText={<label>Planillon</label>} searchText={this.codigo} name='codigo' type='text'
                onBlur={this.actualizarVariables} onNewRequest={(elegido,indice)=>{
                    let evento = {target:{name:'codigo',value:elegido}};
                    this.actualizarVariables(evento);
                }} dataSource={Object.keys(this.state.planillones).sort()}/>
                <br/>
                <RaisedButton label='Elegir' style={{float:'right'}}/>
            </div>
        )
    }

}