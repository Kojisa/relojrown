import React,{Component} from 'react';
import {SelectField,MenuItem,
    Table,TableRow,TableRowColumn,
    TableHeader,TableHeaderColumn,
    TableBody,Paper,RaisedButton} from 'material-ui';
import ReactDOM from 'react-dom';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler';
import Fechas from './MenuFechas';


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
            secretaria:0,
            secretarias:[],
            agrupamiento:0,
            categoria:0,
            categorias:[],
            indiceCategoria:0,
            categoriasPreparadas:[],
            inicio:'',
            final:'',
            datos:[],
            generandoArchivo:false,
            cargando:false,

        }
        this.db = new DBHandler();

        this.cargarCategorias = this.cargarCategorias.bind(this);
        this.cargarSecretarias = this.cargarSecretarias.bind(this);
        this.descargarInforme = this.descargarInforme.bind(this);
        this.pedirInfo = this.pedirInfo.bind(this);
        this.descargarInforme = this.descargarInforme.bind(this);
        this.pedirExcel = this.pedirExcel.bind(this);

        this.db.pedir_limite_secretarias(this.cargarSecretarias)
        this.db.pedir_categorias(this.cargarCategorias); 
    }

    pedirInfo(){
        if(this.state.inicio.length === 0 || this.state.inicio === null ||
        this.state.final.length === 0 || this.state.final === null){
            return;
        }

        let secretaria = this.state.secretaria;
        if( secretaria === 0){
            secretaria = null;
        }

        let indiceCategoria,categoria,agrupamiento
        indiceCategoria = this.state.indiceCategoria;
        if(indiceCategoria === 0){
            categoria = null;
            agrupamiento = null;
        }
        else{
            categoria = this.state.categoria
            agrupamiento = this.state.agrupamiento
        }
        this.setState({cargando:true})

        this.db.pedir_presentismo_general((datos)=>{
            this.setState({cargando:false,
            datos:datos.attendance})},
        this.state.inicio,this.state.final,categoria,agrupamiento,secretaria);
    }

    descargarInforme(){
        var request = new XMLHttpRequest();
        let fun = ()=>this.setState({generandoArchivo:false})
        request.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                var blob = this.response;
                var filename = 'Informe.xlsx';
                let a = document.createElement('a');
                let ob = URL.createObjectURL(blob);
                var e = document.createEvent('MouseEvents');
                e.initEvent('click',true,true);
                a.href = window.URL.createObjectURL(blob);
                a.download = filename;
                a.dispatchEvent(e);
                fun();
            }
            else{
                console.log(this.response)
            }
        }
        let host = this.db.devolverHost();
        request.open('POST','http://' + host + '/api/0.1/attendance/presentism/excel' ,true);
        request.setRequestHeader('Access-Control-Allow-Origin','*');
        request.responseType = 'blob';
        request.setRequestHeader('auth_token',document.cookie.split(';')[0].substring(11));
        request.setRequestHeader('username',document.cookie.split(';')[1].split('=')[1]);
        
        
        let datos = {
            from_date:this.state.inicio, 
            to_date:this.state.final,
            secretariat:this.state.secretaria,
            category:this.state.categoria,
            group:this.state.agrupamiento,
        }

        request.setRequestHeader('Content-type','application/json');
        request.send(JSON.stringify(datos))
        this.setState({generandoArchivo:true})
    }

    recibirDatos(datos){
        this.setState({datos:datos});
    }

    cargarCategorias(datos){
        datos = datos.categories;
        let categorias = [];
        datos.splice(0,0,[0,0,'Todas'])
        categorias = datos.map((elem,ind)=><MenuItem value={ind} primaryText={elem[2]} key={ind}/>)
        this.setState({categorias:datos,categoriasPreparadas:categorias})
    }

    cargarSecretarias(datos){
        let secretarias = []
        for (let x = 0; x < datos.budgets.length; x ++) {
            secretarias.push([datos.budgets[x][0],datos.budgets[x][1]]);
        }
        secretarias.sort((a,b)=> a[1].localeCompare(b[1]))
        secretarias = secretarias.map((elem,ind)=> <MenuItem value={elem[0]} primaryText={elem[1]} key={ind}/> )
        secretarias.splice(0,0,<MenuItem value={0} primaryText='Todas' key={-1}/>)
        this.setState({secretarias:secretarias})

    }


    render(){

        let botonPedir = <RaisedButton onClick={this.pedirInfo} 
                label='Pedir Informacion' primary />

        let botonExcel = <RaisedButton onClick={this.descargarInforme}
            label='Descargar Excel' primary />
            
        if(this.state.inicio.length === 0 || this.state.inicio === null ||
            this.state.final.length === 0 || this.state.final === null){
                botonPedir = <RaisedButton onClick={this.pedirInfo} 
                label='Pedir Informacion' primary disabled/>
                botonExcel = <RaisedButton onClick={this.descargarInforme}
                label='Descargar Excel' primary disabled/>
        }
        
        if(this.state.cargando){
            botonPedir = <RaisedButton
                label='Pidiendo Información' secondary />
            botonExcel =  <RaisedButton onClick={this.descargarInforme}
            label='Descargar Excel' primary disabled/>
        }

        if(this.state.generandoArchivo){
            botonPedir = <RaisedButton onClick={this.pedirInfo} 
                label='Pedir Informacion' primary disabled/>
            botonExcel =  <RaisedButton 
            label='Pidiendo Archivo' secondary/>
        }

        return (
            <Paper>
                <div style={{display:'flex',height:'84vh',margin:'5px'}} >
                    <div>
                        <div>
                            <SelectField
                            value={this.state.indiceCategoria}
                            onChange={(ev,a,ind)=>{
                                
                                this.setState({
                                    indiceCategoria:ind,
                                    categoria:this.state.categorias[ind][0],
                                    agrupamiento:this.state.categorias[ind][1],
                                })}}
                            floatingLabelText='Categoria'
                            floatingLabelFixed={true}
                            >
                                {this.state.categoriasPreparadas}
                            </SelectField >
                            <br/>
                            <SelectField
                            value={this.state.secretaria}
                            onChange={(ev,a,val)=>this.setState({secretaria:val})}
                            floatingLabelText='Secretaria'
                            floatingLabelFixed={true}
                            >
                                {this.state.secretarias}
                            </SelectField>
                        </div>
                        <div style={{marginTop:'31px'}}>
                            <Fechas funActInicio={(val)=>{
                                this.setState({inicio:val})}}
                            funActFin={(val)=>{
                                this.setState({final:val})}} />
                        </div>
                        <div style={{marginTop:'50px'}}>
                            {botonPedir}
                            <br/>
                            {botonExcel}
                        </div>
                    </div>
                    <div style={{marginTop:'5px'}}>
                        <TablaDeDatos datos={this.state.datos}/>
                    </div>

                </div>
            </Paper>
        )
        
    }

}
                //"docket": result[0],
                //"check_in": result[1].isoformat(),
                //"checkout": result[2].isoformat(),
                //"days": result[3],
                //"name": result[4],
                //"secretariat": result[5],
                //"category": result[6],
                //"hour_value": result[7]

class TablaDeDatos extends Component{
    CAMPOS = ['Legajo','Ingreso','Egreso','Horas Trabajadas',
    'Nombre','Secretaria','Categoria','Modulo Horario']
    
    constructor(props){
        super(props);
        this.state={
            datos:props.datos
        }
        
    }


    componentWillReceiveProps(props){
        this.setState({datos:props.datos});
    }

    acomodarFechas(fecha){
        let dia = fecha.split('T')[0]
        let hora = fecha.split('T')[1]
        dia = dia.substr(8,2) + '/' + dia.substr(5,2) + '/' + dia.substr(0,4)
        return dia + ' ' + hora
        
    }

    cargarLinea(linea){
        let campos = ['docket','check_in','checkout','days'
        ,'name','secretariat','category','hour_value']
        let lista = []
        for( let x = 0; x < campos.length; x++){
            let valor = linea[campos[x]];
            if(x === 1 || x === 2){
                valor = this.acomodarFechas(valor);
            }
            if(x === 3){
                valor = valor.toFixed(2)
            }
            lista.push( <TableRowColumn> <span style={{whiteSpace: 'normal',
            wordWrap: 'break-word'}}>{valor}</span> </TableRowColumn>  )
        }
        return lista;
    }

    render(){



        return(<div>
            <Table selectable={false} height='75vh'>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    {this.CAMPOS.map((elem,ind)=><TableHeaderColumn key={ind}>
                        {elem}
                    </TableHeaderColumn>)}
                </TableHeader>
                <TableBody displayRowCheckbox={false} stripedRows={true}>
                    {this.state.datos.map((elem,ind)=><TableRow>
                        {this.cargarLinea(elem)}
                    </TableRow>)}
                </TableBody>
            </Table>
        </div>)
    }
}