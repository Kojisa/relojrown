import React,{Component} from 'react';
import {SelectField,MenuItem,
    Table,TableRow,TableRowColumn,
    TableHeader,TableHeaderColumn,
    TableBody,Paper} from 'material-ui';
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

        }
        this.db = new DBHandler();

        this.cargarCategorias = this.cargarCategorias.bind(this);
        this.cargarSecretarias = this.cargarSecretarias.bind(this);
        this.descargarInforme = this.descargarInforme.bind(this);

        this.db.pedir_limite_secretarias(this.cargarSecretarias)
        this.db.pedir_categorias(this.cargarCategorias);
        this.db.pedir_presentismo_general((datos)=>console.log(datos),'2018-06-01','2018-06-30',2,6,null)    
    }

    descargarInforme(){
        var request = new XMLHttpRequest();
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
            }
        }
        let host = this.db.devolverHost();
        request.open('POST',host + 'urlAPoner' ,true);
        request.setRequestHeader('Access-Control-Allow-Origin','*');
        request.responseText = 'blob';
        
        let datos = {
            from_date:this.state.inicio, 
            to_date:this.state.final,
            secretariat:this.state.secretaria,
            category:this.state.categoria,
            group:this.state.agrupamiento,
        }

        request.setRequestHeader('Content-type','application/json');
        request.send(JSON.stringify(datos))
    }

    recibirDatos(datos){
        let fichadas = datos.map((elem,ind)=><ListItem ></ListItem>)
    }

    cargarCategorias(datos){
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
        secretarias.map((elem,ind)=> <MenuItem value={elem[0]} primaryText={elem[1]} key={ind}/> )
        this.setState({secretarias:secretarias})

    }

    render(){
        return (
            <Paper>
                <div style={{display:'flex'}} >
                    <SelectField
                    value={this.state.indiceCategoria}
                    onChange={(ev)=>{
                        let ind = ev.target.value
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
                        
                    <SelectField
                    value={this.state.secretaria}
                    onChange={(ev)=>this.setState({secretaria:ev.target.value})}
                    floatingLabelText='Secretaria'
                    floatingLabelFixed={true}
                    >
                        {this.state.secretarias}
                    </SelectField>

                </div>
            </Paper>
        )
        
    }

}


class TablaDeDatos extends Component{
    constructor(props){
        super(props);
        this.state={
            datos:props.datos
        }
    }


    componentWillReceiveProps(props){
        this.setState({datos:props.datos});
    }


    render(){
        return(<div>
            
        </div>)
    }
}