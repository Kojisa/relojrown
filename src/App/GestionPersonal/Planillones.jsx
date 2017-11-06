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
            filtro:''
        }

        this.actualizarFiltro = this.actualizarFiltro.bind(this);
        this.db = new DBHandler();
        this.cargarPlanillones = this.cargarPlanillones.bind(this);
        this.pedirPlanillones = this.pedirPlanillones.bind(this);
        

    }

    actualizarPrincipal(codigo){
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
        console.log(datos);
        this.setState({
            planillones:datos.buildings
        })
    }

    pedirPlanillones(){
        this.db.pedir_planillones(this.cargarPlanillones)
    }

    mostrarPlanillones(){

        let planillones = this.state.planillones;
        let lista=[];
        for(let x = 0; x < planillones.length; x++){
            if(planillones[x][1].toLowerCase().includes( this.state.filtro.toLowerCase()) ){
                lista.push( <ListItem onClick={()=>(this.actualizarFiltro(planillones[x][0]))}  >{planillones[x][1]}</ListItem> );
            }
        }
        return lista
    }


    render(){
        let edicion= null;
        if(this.state.elegido){
            edicion= <EdicionPlanillon codigo={this.state.elegido} 
            descripcion={this.state.planillones[this.state.elegido]}/>
        }

        return(
            <div>
                <Paper style={{width:'400px',height:'90%'}}>
                    <div style={{margin:'5px'}} >
                        <TextField name='filtro' value={this.state.filtro} onChange={this.actualizarFiltro} ></TextField>
                        <RaisedButton label='Agregar' onClick={this.actualizarPrincipal('NUEVO')} ></RaisedButton>
                        <br/>
                        <List>
                            {this.mostrarPlanillones()}
                        </List>
                    </div>
                </Paper>
                <Paper style={{display:'inline-block',verticalAlign:'top'}}>
                    <div style={{margin:'5px'}} >

                    {edicion}
                    </div>
                </Paper>
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
    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        })

    }

    guardar(){
        this.db.guardar_planillon(null,this.state.codigo,this.state.descripcion);
    }

    componentWillReceiveProps(props){
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
                value={this.state.codigo} disabled floatingLabelFixed={true} ></TextField>
                <br/>
                <TextField floatingLabelText={ <label htmlFor="">Descripción</label> } 
                value={this.state.descripcion} onChange={this.actualizar} > </TextField>
                <br/>
                <RaisedButton primary={true} onClick={this.guardar} ></RaisedButton>
            </div>
        )
    }
}