import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,SelectField,
    MenuItem,Checkbox,RadioButton,RadioButtonGroup} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';
//ARREGLAR LA PARTE DE CONCEPTOS ANEXADOS

export default function main(props){
    let root = document.getElementById('main');
    root.limpiar();

    ReactDOM.render(
        <div style={{margin:"30px"}}>
            <MUICont>
                <CreacionConcepto/>
            </MUICont>
        </div>,
        root
    )
}


export class CreacionConcepto extends Component{

    constructor(props){
        super(props);
        
        let codigos = props.codigos;
        let articulos = props.articulos;

        if(!codigos){
            codigos={}
        }
        if(!articulos){
            articulos={}
        }

        let articulo = props.articulo;
        if(!articulo || articulo.length === 0 || articulo === 'NUEVO'){
            articulo = '';
        }
        
        
        this.state={
            articulo:articulo,
            descripcion:'',
            maxAnu:'',
            maxMen:'',
            sexo:'',
            justifica:false,
            dias:'',
            modArch:false,
            justificaOtros:[],
            articulos:articulos,
            codigos:codigos
        }
        this.db = new DBHandler();

        this.actualizarValor = this.actualizarValor.bind(this);
        this.actualizarCheck = this.actualizarCheck.bind(this);
        this.guardarConcepto = this.guardarConcepto.bind(this);
        this.actualizarPadre = props.actLista;
        this.cargarArticulo = this.cargarArticulo.bind(this);


    }

    actualizarValor(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        })
    }

    cargarArticulo(datos){
        console.log(datos);
        this.setState({
            articulo:datos.code,
            descripcion:datos.description,
            maxAnu:datos.annual_max, //cambiar esto cuando lo arregle gaston.
            maxMen:datos.month_max,
            sexo:datos.sex,
            justifica:datos.justify,
            dias:datos.covers,
            modArch:datos.modify_article,
            justificaOtros:datos.justify_list,
        })
    }

    componentWillReceiveProps(props){
        
        let art = this.state.articulo;
        console.log(props.articulo);
        console.log(art);
        if(props.articulo === 'NUEVO'){
            this.setState({
                articulo:'',
                descripcion:'',
                maxAnu:'',
                maxMen:'',
                sexo:'',
                justifica:false,
                dias:'',
                modArch:false,
                justificaOtros:[],
            })
            return;   
        }
        if (props.articulo  && props.articulo != 'NUEVO'){
            this.db.pedir_articulo(this.cargarArticulo,1);
        }

        

        
    }

    componentDidMount(){
        let codigo = this.state.articulo;
        if(codigo && codigo != 'NUEVO'){
            this.db.pedir_articulo(this.cargarArticulo,1);
        }
    }

    actualizarCheck(evento,checked){
        this.setState({
            [evento.target.name]:checked
        })
    }

    guardarConcepto(){
        let datos = {
            'code':this.state.articulo,
            'description':this.state.descripcion,
            'month_max':this.state.maxMen,
            'annual_max':this.state.maxAnu,
            'sex':this.state.sexo,
            'justify':this.state.justifica,
            'covers':this.state.dias,
            'modify_article':this.state.modArch,
            'justify_list':this.state.justificaOtros,
        }
        if(this.state.articulo === ''){

            this.db.crear_articulo((datos)=>{
                console.log(datos);
                this.setState({articulo:datos.code});
                this.actualizarPadre();},datos);
    
        }
        else{
            this.db.actualizar_articulo(this.actualizarPadre,datos);
        }

        
    }


    render(){

        return(
            <div style={{display:'inline-block'}}>
                <div style={{marginLeft:'5px',width:'350px'}} >
                    <TextField floatingLabelText={<label>Articulo Nº</label>} disabled value={this.state.articulo} name='articulo'/>
                    <br/>
                    <TextField floatingLabelText={<label>Descripción</label>} name='descripcion' value={this.state.descripcion} onChange={this.actualizarValor}/>
                    <br/>
                    <TextField floatingLabelText={<label>Máximo Anual</label>} name='maxAnu'value={this.state.maxAnu} onChange={this.actualizarValor} />
                    <br/>
                    <TextField floatingLabelText={<label>Máximo Mensual</label>} name='maxMen' value={this.state.maxMen} onChange={this.actualizarValor} />
                    <br/>
                    <Sexo actualizarPadre={this.actualizarValor} valor={this.state.sexo}/>
                    <br/>
                    <Checkbox label='Justifica' checked={this.state.justifica} name='justifica' onCheck={this.actualizarCheck} labelPosition='left'/>
                    <br/>
                    <Dias actualizarPadre={this.actualizarValor} valor={this.state.dias} />
                    <br/>
                    <Checkbox label='Modifica Archivo' checked={this.state.modArch} name='modArch' onCheck={this.actualizarCheck} labelPosition='left'/>

                    <div>
                        <RaisedButton label='guardar' primary={true} onClick={this.guardarConcepto}/>
                    </div>
                </div>
            </div>
        )
    }



}


class Sexo extends Component{

    constructor(props){
        super(props);
        this.state={
            valor:props.valor,
        }
        this.actualizarPadre = props.actualizarPadre;
        this.actualizarValor = this.actualizarValor.bind(this);
    }

    actualizarValor(evento,valor){
        this.setState({
            valor:valor
        })
        this.actualizarPadre({target:{name:'sexo',value:valor}})
    }
    
    componentWillReceiveProps(props){
        this.setState({
            valor:props.valor,
        })
    }

    render(){
        return(
            <div>
                <label>Sexo</label>
                <RadioButtonGroup valueSelected={this.state.valor} 
                labelPosition='left' style={{marginTop:'15px'}}
                onChange={this.actualizarValor}>
                    <RadioButton label='Masculino' value='M'/>
                    <RadioButton label='Femenino' value='F'/>
                    <RadioButton label='General' value='B' />
                </RadioButtonGroup>
            </div>
        )
    }
}

class Dias extends Component{

    constructor(props){
        super(props);
        this.state={
            valor:props.valor,
        }
        this.actualizarPadre = props.actualizarPadre;
        this.actualizarValor = this.actualizarValor.bind(this);
    }

    actualizarValor(evento,valor){
        this.actualizarPadre({target:{name:'dias',value:valor}})
    }
    componentWillReceiveProps(props){
        this.setState({
            valor:props.valor,
        })
    }

    render(){
        return(
            <div>
                <label>Dias Hábiles/Corridos</label>
                <RadioButtonGroup labelPosition='left' style={{marginTop:'15px'}}
                onChange={this.actualizarValor} name='dias' valueSelected={this.state.valor}>
                    <RadioButton label='Hábiles' value='W'/>
                    <RadioButton label='Corridos' value='A' />
                </RadioButtonGroup>
            </div>
        )
    }
}


class ArticulosAfectados extends Component{

    constructor(props){
        super(props);

        let lista = props.lista;

        if(!lista){
            lista = []
        }

        this.setState={
            lista:lista,
            codigos:props.codigos,
            articulos:props.articulos
        }

    }

    cargarArticulos(){
        let lista = this.state.lista;
        if(lista.length == 0 ){
            return []
        }
        lista.map((elem,index)=>(
            <div name={index.toString()}>
            <TextField floatingLabelText={<label>Codigo</label>} value={elem[0]}/>

            </div>)
        )
    }


}
