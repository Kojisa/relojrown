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
            legajo:'',
            nombre:'',
            horarios:[], //horario laboral asociado al legajo
            desde:'',
            hasta:'',
            registros:[] //registros de fichada
        }
        this.db = new DBHandler();
        this.actualizar = this.actualizar.bind(this);
        this.pedirRegistros = this.pedirRegistros.bind(this);
        this.actualizarRegistro = this.actualizarRegistro.bind(this);
        this.obtenerNombre = this.obtenerNombre.bind(this);
    }

    actualizar(evento){
        let campo = evento.target.name;
        let valor = evento.target.value;
        this.setState({
            [campo]:valor
        });
    }

    actualizarRegistro(pos,info){
        let registros = this.state.registros;
        registros[pos] = info;
        this.setState({
            regsitros:registros
        });

    } 

    obtenerNombre(){
        this.db.pedir_nombre((datos)=>(this.setState({nombre:datos.name})),this.state.legajo);
    }

    pedirRegistros(){

    }


    render(){

        let registros = null;
        if(this.state.registros.length > 0){
            registros = <MuestraRegistros registros={this.state.registros} funAct={this.actualizarRegistro}/>
        }

        return(
            <div>
                <Paper style={{minWidth:'400px',display:'inline-block'}} >
                    <div style={{margin:'5px'}}>
                        <TextField value={this.state.legajo}  onChange={this.actualizar} name='legajo'
                        floatingLabelText={ <label htmlFor="">Nº Legajo</label> } 
                        onBlur={this.obtenerNombre}></TextField>
                        <TextField value={this.state.nombre} name='nombre' disabled floatingLabelText={ <label htmlFor="">Nombre</label> } 
                        floatingLabelFixed={true} 
                       ></TextField>
                        <br/>
                        <TextField value={this.state.desde} floatingLabelText={ <label htmlFor="">Desde</label> } onChange={this.actualizar}
                        name='desde' type='date' floatingLabelFixed={true} ></TextField>
                        
                        <TextField value={this.state.hasta} floatingLabelText={ <label htmlFor="">Hasta</label> } onChange={this.actualizar}
                        name='hasta' type='date' floatingLabelFixed={true}></TextField>
                        <br/>
                        <RaisedButton label='Pedir' onClick={this.pedirRegistros} primary={true} style={{marginLeft:'300px'}}> </RaisedButton>
                    </div>
                </Paper>
                <div style={{display:'inline-block'}} >
                    {registros}
                </div>
            </div>
            
        )
    }

}


class MuestraRegistros extends Component{
    constructor(props){
        super(props);
        this.state={
            registros:props.registros
        }

        this.actualizarRegistro = props.funAct;

        this.cargarRegistros = this.cargarRegistros.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            registros:props.registros,
        })
    }


    cargarRegistros(){

        let lista = this.state.registros;
        let final = [];
        let aux = 0; //contabiliza las entradas para ver si agrega separador
        for( let x = 0; x < lista.length; x = x + 2){
            console.log(x);
            let regs = []
            let fecha1 = lista[x][0];
            let registro1 = lista[x][1]; //id del registro
            let entrada1 = lista[x][2];
            
            regs.push([fecha1,registro1,entrada1]);

            let fecha2 = lista[x + 1][0];
            let registro2 = lista[x + 1][1];
            let entrada2 = lista[x + 1][2];

            regs.push([fecha2,registro2,entrada2]);

            let item = <ParRegistros registros={regs} indice={x} funAct={this.actualizarRegistro} />
 
            final.push(item);
        }

        return final


    }

    render(){

        return(
            <Paper style={{width:'400px',overflowY:'scroll',height:'70%'}} >
                <div style={{margin:'5px'}} >
                    <List>
                        {this.cargarRegistros()}
                    </List>
                </div>
            </Paper>
        )
    }
}

class ParRegistros extends Component{

    constructor(props){
        super(props);
        this.state={
            registros:props.registros,
            indice:props.indice
        }

        this.cargarRegistros = this.cargarRegistros.bind(this);
        this.actualizarRegistro = props.funAct;
    }

    componentWillReceiveProps(props){
        this.setState({
            registros:props.registros,
            indice:props.indice
        });
    }

    cargarRegistros(){
        
        return this.state.registros.map((elem,index)=>(
            <Registro funAct={this.actualizarRegistro} fecha={elem[0]}
            registro={elem[1]} entrada={elem[2]} indice={this.state.indice + index} />
        ))
    }

    render(){

        return(
            <ListItem>
                <div>
                    {this.cargarRegistros()}
                    <br/>
                    <RaisedButton label='Actualizar Par' primary={true}/>
                    <br/>
                    <Divider/>
                </div>
            </ListItem>
        )
    }



}



class Registro extends Component{

    constructor(props){
        super(props);
        this.state={
            hora:props.fecha.split('T')[1],
            dia:props.fecha.split('T')[0],
            registro:props.registro,
            indice:props.indice,
            entrada:props.entrada, //esto es un bool, si es true fue marcado como entrada, si es false, fue marcado como salida.
        }
        this.actualizarRegistro = this.actualizarRegistro.bind(this);
        this.actualizar = props.funAct;
    }

    componentWillReceiveProps(props){
        this.setState({
            hora:props.fecha.split('T')[1],
            dia:props.fecha.split('T')[0],
            registro:props.registro,
            indice:props.indice,
            entrada:props.entada,
        })
    }

    actualizarRegistro(evento){
        let datos={
            hora:this.state.hora,
            dia:this.state.dia,
            registro:this.state.registro,
            entrada:this.state.entrada
        }

        datos[evento.target.name] = evento.target.value;
        this.actualizar(this.indice,datos);

    }

    render(){

        let boton = <RaisedButton label='Entrada' primary={true} 
        onChange={()=>(this.actualizarRegistro({target:{name:'entrada',value:true}}))} />
        if(!this.state.entrada){
            boton = <RaisedButton label='Salida' secondary={true} 
            onChange={()=>(this.actualizarRegistro({target:{name:'entrada',value:false}}))} />
        }


        return(
            <div>
                <TextField floatingLabelText={ <label htmlFor="">Día</label> } value={this.state.dia} 
                onChange={this.actualizarRegistro} name='dia' type='date' style={{width:'140px'}} />
                
                <TextField floatingLabelText={ <label htmlFor="">Hora</label> } value={this.state.hora}
                onChange={this.actualizarRegistro} name='hora' type='time' style={{width:'80px'}}/>

                {boton}
            </div>
        )
    }
}


