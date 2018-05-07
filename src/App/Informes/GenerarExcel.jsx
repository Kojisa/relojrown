import React,{Component} from React;
import ReactDOM from ReactDOM;
import MUICont from 'material-ui/styles/MuiThemeProvider';
import {TextField,Paper,RaisedButton,List,ListItem,SelectField,MenuItem,
    TableRow,TableBody,TableRowColumn,Table,TableHeader,TableHeaderColumn,
    Checkbox} from 'material-ui';
import DBHandler from './DBHandler.js';
import XLSX from 'xlsx';


class FabricaInformes{

    constructor(props){
        this.nombresColumnas = [];
        this.datos = [];
        this.tipo = null; //despues lo uso para ver si me pasan todo, una secretaria o una dependencia
        this.profundidad = null; //para saber como dividir las solapas.
        this.libro =  XLSX.utils.book_new();
    }

    recibirDatos(nombrePaginas,datos,tipo,profundidad){

        for( let x = 0; x < nombresPaginas.length; x++){

            let pagina = XLSX.utils.aoa_to_sheet(datos[x]);
            XLSX.utils.book_append_sheet(this.libro,pagina,nombresPaginas[x])
        }

        let path = require('path').join(require('os').homedir(),'Desktop')
    }
}

