import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Avatar,List,ListItem,Paper,
        RaisedButton} from 'material-ui';
import DBHandler from '../DBHandler';
import {CreacionConcepto} from './CreacionConceptos';



export default function main(){
    let root = document.getElementById("main");
    root.limpiar();

    ReactDOM.render(
        <MUICont>
            <Contenedor/>
        </MUICont>,
        root
    )
}

class Contenedor extends Component{

    constructor(props){
        super(props);

        this.state = {
            articulos:[
            ], //lista de diccionarios. diccionario:{
                //'nombre', 
                //'letra',
                //'id'
                //}
            actual:'', //cliente a mostrar
            mostrarEdicion:false,
            filtro:'',
        };

        this.db = new DBHandler();
        this.cargarArticulos = this.cargarArticulos.bind(this);
        this.pedirArtoculos = this.pedirArtoculos.bind(this);
        this.actualizarDatos = this.actualizarDatos.bind(this);
        this.pedirArtoculos();
    }

    actualizarDatos(valor,campo){
        let dic = {[campo]:valor};
        if(campo === 'actual'){
            dic['mostrarEdicion'] = true;
        }
        this.setState(dic)
    }

    pedirArtoculos(){
        this.db.pedir_articulos(this.cargarArticulos);
    }

    cargarArticulos(datos){

        this.setState({clientes:datos});

    }

    generarListado(){

        let lista = this.state.articulos;

        return lista.map((elem,index)=>
            {
                if( elem.nombre.toLowerCase().includes(this.state.filtro.toLowerCase()) || this.state.filtro === ''){return <Articulo nombre={elem.nombre} 
                codigo={elem.codigo} id={elem.codigo} 
                funAct={this.actualizarDatos} key={index}/>}
            }
        )
    }


    render(){
        let edicion = null;
        if( this.state.mostrarEdicion === false){
            edicion = null;
        }
        return(
            <div>
                <Paper style={{width:'400px',display:'inline-block',margin:'5px'}} >
                    <div style={{margin:'5px'}} >
                    <TextField floatingLabelText={ <label>Busqueda</label> } 
                    onChange={(evento)=>this.actualizarDatos(evento.target.value,evento.target.name)
                    } name='filtro' ></TextField>
                    <RaisedButton label={'Nuevo'} primary={true} onClick={()=>(this.actualizarDatos('NUEVO','actual'))}/>
                    <br/>
                    </div>
                    <div style={{margin:'5px'}} >
                        <List>
                            {this.generarListado()}
                        </List>
                    </div>
                </Paper>
                <div style={{width:'400px',display:'inline-block',verticalAlign:'top',gravity:'left'}} >
                    {edicion}
                </div>
            </div>
        )
    }

}

class Articulo extends Component{

    constructor(props){
        super(props);

        this.state = {
            nombre:props.nombre,
            codigo:props.codigo,
            id:props.id
        }

        this.actualizarPadre = props.funAct;
    }

    componentWillReceiveProps(props){
        this.setState({
            nombre:props.nombre,
            letra:props.letra,
            id:props.id
        })
    }

    render(){
        return(
            <ListItem onClick={()=>this.actualizarPadre(this.state.id,'actual')} >
                <Avatar>
                    {this.state.letra}
                </Avatar>
                <span>
                    {this.state.nombre}
                </span>
            </ListItem>
        )
    }

}