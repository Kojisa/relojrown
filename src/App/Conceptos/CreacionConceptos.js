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
        
        
        this.state={
            articulo:'',
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

    }

    actualizarValor(evento){
        this.setState({
            [evento.target.name]:evento.target.value
        })
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
            'month_min':this.state.maxAnu,
            'sex':this.state.sexo,
            'justify':this.state.justifica,
            'covers':this.state.dias,
            'modify_article':this.state.modArch
        }

        this.db.crear_articulo(null,datos);

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
                    <Sexo actualizarPadre={this.actualizarValor}/>
                    <br/>
                    <Checkbox label='Justifica' checked={this.state.justifica} name='justifica' onCheck={this.actualizarCheck} labelPosition='left'/>
                    <br/>
                    <Dias actualizarPadre={this.actualizarValor}/>
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

    render(){
        return(
            <div>
                <label>Sexo</label>
                <RadioButtonGroup defaultSelected={this.state.valor} 
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
        this.setState({
            valor:valor
        })
        this.actualizarPadre({target:{name:'dias',value:valor}})
    }

    render(){
        return(
            <div>
                <label>Dias Hábiles/Corridos</label>
                <RadioButtonGroup defaultSelected={this.state.valor} 
                labelPosition='left' style={{marginTop:'15px'}}
                onChange={this.actualizarValor} name='dias'>
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
