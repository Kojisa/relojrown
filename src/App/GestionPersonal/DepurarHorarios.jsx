import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,List,ListItem,Divider} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';


export default function main(){
    let root = document.getElementById('main');
    root.limpiar();
    let tam = window.innerHeight - 150;
    ReactDOM.render(
        <div style={{margin:"30px",height:tam}}>
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
            registros:[], //registros de fichada
            originales:[],
        }
        this.db = new DBHandler();
        this.actualizar = this.actualizar.bind(this);
        this.pedirRegistros = this.pedirRegistros.bind(this);
        this.actualizarRegistro = this.actualizarRegistro.bind(this);
        this.obtenerNombre = this.obtenerNombre.bind(this);

        this.borrarRegistro = this.borrarRegistro.bind(this);
        this.mandarRegistros = this.mandarRegistros.bind(this);
    }

    actualizar(evento){
        let campo = evento.target.name;
        let valor = evento.target.value;
        this.setState({
            [campo]:valor
        });
    }


    //tipo 0 es entrada tipo 1 es salida
    actualizarRegistro(pos,info,tipo){
        let registros = this.state.registros;
        registros[pos][tipo] = info.dia + 'T' + info.hora;
        this.setState({
            registros:registros
        });

    } 

    obtenerNombre(){
        this.db.pedir_nombre((datos)=>(this.setState({nombre:datos.name})),this.state.legajo);
    }

    pedirRegistros(){
        this.db.enviarPeticion((datos)=>(this.setState({
            registros:datos.attendance,
            originales:datos.attendance,
        }
            )),'api/0.1/attendance/'+this.state.legajo,'POST',{from_date:this.state.desde,to_date:this.state.hasta},true);
    }

    borrarRegistro(pos){
        this.db.borrar_presencia(this.pedirRegistros,{original:this.state.originales[pos],legajo:this.state.legajo})
    }

    mandarRegistros(pos){
        this.db.actualizar_presencia(null,{original:this.state.originales[pos],registro:this.state.registros[pos],legajo:this.state.legajo})
    }

    render(){

        let registros = null;
        
        if(this.state.registros.length > 0){
            registros = <MuestraRegistros registros={this.state.registros} funMan={this.mandarRegistros}
             funAct={this.actualizarRegistro} funBor={this.borrarRegistro} />
        }

        return(
            <div style={{height:'100%'}} >
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
                
                {registros}
                
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
        this.mandarRegistros = props.funMan;
        this.borrarRegistro = props.funBor;
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
        for( let x = 0; x < lista.length; x ++){           

            let item = <ParRegistros registros={lista[x]} indice={x} funMan={this.mandarRegistros}
            funAct={this.actualizarRegistro} funBor={this.borrarRegistro} />
 
            final.push(item);
        }

        return final


    }

    render(){

        return(
            <Paper style={{width:'400px',overflowY:'auto',height:'80%'}} >
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
        this.mandarRegistros = props.funMan;
        this.borrarRegistro = props.funBor;
    }

    componentWillReceiveProps(props){
        this.setState({
            registros:props.registros,
            indice:props.indice
        });
    }

    cargarRegistros(){
        
        return this.state.registros.map((elem,index)=>(
            <Registro funAct={this.actualizarRegistro} fecha={elem}
            indice={this.state.indice} entrada={index} />
        ))
    }

    render(){

        return(
            <ListItem>
                <div>
                    {this.cargarRegistros()}
                    <br/>
                    <RaisedButton label='Actualizar Par' primary={true} onClick={()=>this.mandarRegistros(this.state.indice)}/>
                    <RaisedButton
                        secondary={true}
                        label="Borrar Registro"
                        onClick={()=>this.borrarRegistro(this.state.indice)} />
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
            indice:props.indice,
            tipo:props.entrada, //esto es un int, si es 0 fue marcado como entrada, si es 1, fue marcado como salida.
        }
        this.actualizarRegistro = this.actualizarRegistro.bind(this);
        this.actualizar = props.funAct;
    }

    componentWillReceiveProps(props){
        this.setState({
            hora:props.fecha.split('T')[1],
            dia:props.fecha.split('T')[0],
            indice:props.indice,
            tipo:props.entada,
        })
    }

    actualizarRegistro(evento){
        let datos={
            hora:this.state.hora,
            dia:this.state.dia,
            registro:this.state.registro,
            tipo:this.state.entrada
        }

        if(evento.target.name='dia'){
            datos.dia =evento.target.value;
        }
        if(evento.target.name='hora'){
            datos.hora = evento.target.value;
        }

        
        this.actualizar(this.state.indice,datos,this.state.tipo);

    }

    render(){

        let boton = <RaisedButton label='Entrada' primary={true} 
        onChange={()=>(this.actualizarRegistro({target:{name:'entrada',value:true}}))} />
        if(!this.state.tipo == 0){
            boton = <RaisedButton label='Salida' secondary={true} 
            onChange={()=>(this.actualizarRegistro({target:{name:'entrada',value:false}}))} />
        }


        return(
            <div>
                <TextField floatingLabelText={ <label htmlFor="">Día</label> } value={this.state.dia} 
                onChange={this.actualizarRegistro} name='dia' type='date' style={{width:'140px'}} />
                
                <TextField floatingLabelText={ <label htmlFor="">Hora</label> } value={this.state.hora}
                onChange={this.actualizarRegistro} name='hora' type='time' style={{width:'80px'}}/>
            </div>
        )
    }
}


