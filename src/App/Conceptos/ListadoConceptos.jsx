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
            ], 
            actual:'', //cliente a mostrar
            mostrarEdicion:false,
            filtro:'',
        };

        this.db = new DBHandler();
        this.cargarArticulos = this.cargarArticulos.bind(this);
        this.pedirArticulos = this.pedirArticulos.bind(this);
        this.actualizarDatos = this.actualizarDatos.bind(this);
    }

    actualizarDatos(valor,campo){
        
        let dic = {[campo]:valor};
        if(campo === 'actual'){
            dic['mostrarEdicion'] = true;
        }
        this.setState(dic)
    }

    pedirArticulos(){
        this.db.pedir_articulos(this.cargarArticulos);
    }

    cargarArticulos(datos){
        this.setState({articulos:datos.articles});

    }

    componentDidMount(){
        if(this.state.articulos.length === 0){
            this.pedirArticulos();
        }
    }

    generarListado(){

        let lista = this.state.articulos;
        console.log(lista);
        return lista.map((elem,index)=>
            {
                if( elem[1].toLowerCase().includes(this.state.filtro.toLowerCase()) || this.state.filtro === ''){return <Articulo nombre={elem[1]} 
                codigo={elem[0]} id={elem[0]} 
                funAct={this.actualizarDatos} key={index}/>}
            }
        )
    }


    render(){
        let edicion = <CreacionConcepto actLista={this.pedirArticulos} articulo={this.state.actual} />;
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
            codigo:props.codigo,
            id:props.id
        })
    }

    render(){
        return(
            <ListItem onClick={()=>this.actualizarPadre(this.state.id,'actual')} >
                <Avatar>
                    {this.state.codigo}
                </Avatar>
                <span>
                    {this.state.nombre}
                </span>
            </ListItem>
        )
    }

}