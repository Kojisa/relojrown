import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,List,ListItem,Divider} from 'material-ui';
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
            elegido:'',
            planillones:[], //lista de pares clave-descripcion.
            filtro:'',
            ref:{}
        }

        this.actualizarFiltro = this.actualizarFiltro.bind(this);
        this.db = new DBHandler();
        this.cargarPlanillones = this.cargarPlanillones.bind(this);
        this.pedirPlanillones = this.pedirPlanillones.bind(this);
        this.actualizarDescripcion = this.actualizarDescripcion.bind(this);
        this.actualizarElegido = this.actualizarElegido.bind(this);
        this.actualizarNuevo = this.actualizarNuevo.bind(this);
        this.pedirPlanillones();

    }

    actualizarElegido(codigo){
        this.setState({
            elegido:codigo,
        })
    }

    actualizarFiltro(evento){
        this.setState({
            filtro:evento.target.value,
        })
    }

    cargarPlanillones(datos){
        let ref = {};
        for( let x = 0; x < datos.buildings.length; x++){
            ref[datos.buildings[x][0]] = datos.buildings[x][1]
        }
        this.setState({
            planillones:datos.buildings,
            ref:ref
        })
    }

    actualizarDescripcion(codigo,descripcion){
        let planillones = this.state.planillones;

        for (let x = 0; x < planillones.length; x++ ){
            if(planillones[x][0] === codigo){
                planillones[x][1] = descripcion;
                break
            }
        }
        this.setState({
            planillones:planillones,
        })
    }

    pedirPlanillones(){
        this.db.pedir_planillones(this.cargarPlanillones)
    }

    actualizarNuevo(){
        this.actualizarElegido('NUEVO');
    }

    mostrarPlanillones(){

        let planillones = this.state.planillones;
        let lista=[];
        for(let x = 0; x < planillones.length; x++){
            if(planillones[x][1].toLowerCase().includes( this.state.filtro.toLowerCase()) ){
                lista.push( <ListItem onClick={()=>(this.actualizarElegido(planillones[x][0]))}  >{planillones[x][1]}</ListItem> );
            }
        }
        return lista
    }


    render(){
        let edicion= null;
        console.log(this.state.ref);
        if(this.state.elegido != ''){
            let descripcion = ''
            if(this.state.elegido === 'NUEVO'){
                descripcion = '';
            }
            else{
                descripcion = this.state.ref[this.state.elegido]
            }
            edicion= (
            <Paper style={{display:'inline-block',verticalAlign:'top',float:'left',marginLeft:'10px'}}>
                <div style={{margin:'5px'}} >
                    <EdicionPlanillon codigo={this.state.elegido} 
                    descripcion={descripcion} funAct={this.pedirPlanillones}/>
                </div>
            </Paper>)
            
        }

        let lista = null;
        if(this.state.planillones.length > 0 ){
            lista = (
                <List>
                    {this.mostrarPlanillones()}
                </List>
            )
        }

        return(
            <div>
               <Paper style={{width:'400px',height:'90%',float:'left'}}>
                    <div style={{margin:'5px'}} >
                        <TextField name='filtro' value={this.state.filtro} onChange={this.actualizarFiltro} ></TextField>
                        <RaisedButton label='Agregar' onClick={this.actualizarNuevo} ></RaisedButton>
                        <br/>
                        {lista}
                    </div>
                </Paper>
                {edicion}
            </div>
        )
    }
}


class EdicionPlanillon extends Component{
    constructor(props){
        super(props);
        let codigo = props.codigo
        if(codigo === 'NUEVO'){
            codigo = '';
        }
        this.state={
            codigo:codigo,
            descripcion:props.descripcion
        }
        this.db = new DBHandler();
        this.actualizar = this.actualizar.bind(this);
        this.guardar = this.guardar.bind(this);
        this.funAct = props.funAct;
    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        })

    }

    guardar(){
        if(this.state.codigo === '' || this.state.codigo === null){
            this.db.pedir_planillones((datos)=>{this.db.guardar_planillon(this.funAct,(datos.buildings.length + 1),this.state.descripcion)})
        }
        else{
            this.db.guardar_planillon(this.funAct,this.state.codigo,this.state.descripcion);
        }
    }

    componentWillReceiveProps(props){
        console.log(props);
        if(props.codigo === 'NUEVO'){
            this.setState({
                codigo:'',
                descripcion:''
            })
        }
        else{
            this.setState({
                codigo:props.codigo,
                descripcion:props.descripcion
            })
        }
    }

    render(){
        return(
            <div>
                <TextField floatingLabelText={ <label htmlFor="">Codigo</label> } 
                value={this.state.codigo} floatingLabelFixed={true} disabled></TextField>
                <br/>
                <TextField floatingLabelText={ <label htmlFor="">Descripcion</label> } 
                value={this.state.descripcion} name='descripcion' onChange={this.actualizar}></TextField>
                <br/>
                <RaisedButton label ='Guardar'
                primary={true} onClick={this.guardar} ></RaisedButton>
            </div>
        )
    }
}