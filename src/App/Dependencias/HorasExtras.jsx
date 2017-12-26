import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {TextField,Paper,RaisedButton,List,ListItem,
    Divider,Tab,Tabs,MenuItem,SelectField} from 'material-ui';
import MUICont from 'material-ui/styles/MuiThemeProvider';
import DBHandler from '../DBHandler.js';
import {} from 'recharts'


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
            secretarias:[
                
            ],
            gastoTotal:0,
            consumos:{

            },
            ref:{
                
            },
            elegido:'',//jurisdiccion elegida para ver detalles.
            desde:'',
            hasta:'',
            mes:'',
            anio:'',
            meses:[
                <MenuItem value={'01'} primaryText='Enero' />,
                <MenuItem value={'02'} primaryText='Febrero'/>,
                <MenuItem value={'03'} primaryText='Marzo'/>,
                <MenuItem value={'04'} primaryText='Abril'/>,
                <MenuItem value={'05'} primaryText='Mayo'/>,
                <MenuItem value={'06'} primaryText='Junio'/>,
                <MenuItem value={'07'} primaryText='Julio'/>,
                <MenuItem value={'08'} primaryText='Agosto'/>,
                <MenuItem value={'09'} primaryText='Septiembre'/>,
                <MenuItem value={'10'} primaryText='Octubre'/>,
                <MenuItem value={'11'} primaryText='Noviembre'/>,
                <MenuItem value={'12'} primaryText='Diciembre'/>,
            ],
            

        }

        this.db = new DBHandler();
        this.actualizar = this.actualizar.bind(this);
        this.pedirJurisdicciones = this.pedirJurisdicciones.bind(this);
        this.cargarHorasExtras = this.cargarHorasExtras.bind(this);
        this.pedirHorasExtras = this.pedirHorasExtras.bind(this);
        this.actualizarElegido = this.actualizarElegido.bind(this);

    }

    actualizar(evento){
        this.setState({
            [evento.target.name]:evento.target.value,
        })
    }

    actualizarElegido(codigo){
        this.setState({
            elegido:codigo,
        })
    }

    cargarHorasExtras(datos){
        let consu = this.state.consumos;
        let ref = this.state.ref;
        let secret = this.state.secretarias;
        let gastoTotal = 0;
        for(let x = 0; x < datos.overtimes.length; x++){
            if(datos.overtimes[x].secretariat_id in consu){
                gastoTotal += parseFloat(datos.overtimes[x].result.toFixed(2));
                if(datos.overtimes[x].hour_type === '50%'){
                    consu[datos.overtimes[x].secretariat_id ][0] = parseFloat(datos.overtimes[x].result.toFixed(2))
                    secret[ref[datos.overtimes[x].secretariat_id]][3] += parseFloat(datos.overtimes[x].result.toFixed(2));
                }
                
                else if(datos.overtimes[x].hour_type === '100%'){
                    consu[datos.overtimes[x].secretariat_id][1] = parseFloat(datos.overtimes[x].result.toFixed(2))
                    secret[ref[datos.overtimes[x].secretariat_id]][3] += parseFloat(datos.overtimes[x].result.toFixed(2));
                }

                else if(datos.overtimes[x].hour_type === '50%N'){
                    consu[datos.overtimes[x].secretariat_id ] [2] = parseFloat(datos.overtimes[x].result.toFixed(2))
                    secret[ref[datos.overtimes[x].secretariat_id]][3] += parseFloat(datos.overtimes[x].result.toFixed(2));
                }
                else if(datos.overtimes[x].hour_type === '100%N'){
                    consu[datos.overtimes[x].secretariat_id ] [3] = parseFloat(datos.overtimes[x].result.toFixed(2))
                    secret[ref[datos.overtimes[x].secretariat_id]][3] += parseFloat(datos.overtimes[x].result.toFixed(2));
                }
                   
            }
        }

        secret.sort((a,b)=>{
            return  b[3] - a[3] 
        })
        secret.map((elem,index)=>{
            ref[elem[0]] = index
        }
        )


        this.setState({
            consumos:consu,
            secretarias:secret,
            ref:ref,
            gastoTotal:gastoTotal,
        })


    }

    pedirHorasExtras(datos){
        let consumos = {};
        let ref = {};
        let secretarias = datos.budgets;
        let permitidos = ['1110118000','1110119000','1110122000','1110123000','1110120000',
        '1110121000','1110104000','1110106000','1110124000','1110108000','1110100000']
        let finales = [];
        secretarias.map((elem,index)=>{
            if(permitidos.indexOf(elem[0]) != -1){
                consumos[elem[0]] = [0,0,0,0]
                ref[elem[0]] = finales.length;
                elem.push(0);
                finales.push(elem);
            }
        })
        let diaFinal = '';
        let meses31=['01','03','05','07','08','10','12']
        let meses30=['04','06','09','11'];

        if(meses31.indexOf(this.state.mes) != -1){
            diaFinal = '31';
        }
        else if(meses30.indexOf(this.state.mes) != -1){
            diaFinal = '30'
        }
        else{
            diaFinal = '28'
        }
        
        let desde = this.state.anio + '-' + this.state.mes + '-' + '01';
        let hasta = this.state.anio + '-' + this.state.mes + '-' + diaFinal;
        this.setState({
            ref:ref,
            secretarias:finales,
            consumos:consumos,
            desde:desde,
            hasta:hasta,
        })

        
        this.db.pedir_horas_extras(this.cargarHorasExtras,{desde:desde,hasta:hasta})
    }

    pedirJurisdicciones(){
        this.db.pedir_limite_secretarias(this.pedirHorasExtras);
    }

    generarAnios(){
        let lista = [];
        let anioInicial = 2017;
        let anioActual = new Date().getFullYear();
        for (let x = 0 ; x + anioInicial <= anioActual; x++ ){
            lista.push( <MenuItem value={anioInicial + x} primaryText={anioInicial + x}/>)
        }
        return lista;
    }

    ponerPuntuacion(numero){
        
        let texto = numero.toString();
        let coma = texto.indexOf('.');
        texto = texto.replace('.',',');
        let final = texto.substr(coma,3);
        let aux = 0;
        
        for (let x = coma - 1; x >= 0; x--){
            final = texto[x] + final;
            aux += 1;
            if(aux === 3){
                final = '.' + final;
                aux = 0;
            }

        }
        if(final[0] === '.'){
            final = final.substr(1,final.length - 1)
        }
        return final;
    }

    render()
    {
        let panel = null;
        if(this.state.elegido !== ''){
            let secre = this.state.secretarias[this.state.ref[this.state.elegido]];
            console.log(secre);
            panel = <PanelInfo secretaria={secre[1]} codigo={secre[0]} 
            limite={secre[2]} gastos={this.state.consumos[secre[0]]} desde={this.state.desde}
            hasta={this.state.hasta} ></PanelInfo>
        }

        let gastoTotal = null;

        if(this.state.gastoTotal != 0 ){
            gastoTotal = (
                <Paper>
                    <span>Gasto total en el periodo seleccionado: ${this.ponerPuntuacion(this.state.gastoTotal.toFixed(2))}</span>
                </Paper>
            )
        }

        return(
            <Paper>
                <div style={{float:'top'}}>
                    {/*<TextField value={this.state.desde} floatingLabelText={ <label htmlFor="">Desde</label> } 
                    onChange={this.actualizar} name='desde' type='date' floatingLabelFixed={true} ></TextField>
                    <TextField value={this.state.hasta} floatingLabelText={ <label htmlFor="">Hasta</label> }
                    onChange={this.actualizar} name='hasta' type='date' floatingLabelFixed={true}></TextField>*/}
                    <SelectField
                        value={this.state.mes}
                        floatingLabelText="Mes"
                        onChange={(e, i, value) => this.setState({mes:value})}>
                        {this.state.meses}
                    </SelectField>
                    <SelectField
                        value={this.state.anio}
                        floatingLabelText="Año"
                        onChange={(e, i, value) => this.setState({ anio:value })}>
                        {this.generarAnios()}
                    </SelectField>
                    <RaisedButton label='Pedir Datos' onClick={this.pedirJurisdicciones} style={{position:'relative',top:'-18px'}} />
                </div>
                {gastoTotal}
                <br/>
                <Tarjetas secretarias={this.state.secretarias} consumos={this.state.consumos} funAct={this.actualizarElegido}></Tarjetas>
                {panel}
            </Paper>
        )
    }
}


class PanelInfo extends Component{

    constructor(props){
        super(props);
        this.state={
            codigo:props.codigo,
            secretaria:props.secretaria,
            dependencias:[],
            limite:props.limite,
            gastos:props.gastos,
            desde:props.desde,
            hasta:props.hasta,
            ref:{}
        }

        this.db = new DBHandler();
        this.pedirDependenciasAsociadas = this.pedirDependenciasAsociadas.bind(this);
        this.cargarDependencias = this.cargarDependencias.bind(this);
        this.pedirLimitesDependencias = this.pedirLimitesDependencias.bind(this);
        this.cargarLimitesDependencias = this.cargarLimitesDependencias.bind(this);
        this.cargarGastosDependencias = this.cargarGastosDependencias.bind(this);
        this.pedirGastosDependencias = this.pedirGastosDependencias.bind(this);
        this.pedirDependenciasAsociadas();
        
    }

    componentDidMount(){
        if(this.state.codigo){
            this.pedirDependenciasAsociadas()
        }
    }

    cargarGastosDependencias(datos){
        let depen = this.state.dependencias;
        let ref = this.state.ref;
        for (let x = 0; x < datos.overtimes.length; x++){
            if(datos.overtimes[x]['dependence_id'] in ref){
                let ind = ref[datos.overtimes[x]['dependence_id']];
                depen[ind][depen[ind].length - 1] += parseFloat(datos.overtimes[x]['result'].toFixed(2));
            }
        }
        this.setState({
            dependencias:depen,
        })
    }

    pedirGastosDependencias(){

        this.db.pedir_gastos_dependencias(this.cargarGastosDependencias,this.state.desde,this.state.hasta);
    }


    cargarLimitesDependencias(datos){;
        let depen = this.state.dependencias;
        let ref = this.state.ref;
        for (let x = 0; x < datos.budgets.length; x++){
            if(datos.budgets[x][0] in ref){
                let ind = ref[datos.budgets[x][0]];
                depen[ind][depen[ind].length - 2] = datos.budgets[x][datos.budgets[x].length - 1];
            }
        }
        console.log(depen);
        this.setState({
            dependencias:depen,
        },this.pedirGastosDependencias());
    }

    pedirLimitesDependencias(){
        this.db.pedir_dependencias_limite(this.cargarLimitesDependencias);
    }

    cargarDependencias(datos){
        let dependencias = [];
        let ref={};
        datos.dependencies.map((elem,index)=>{
            elem.push(0);
            elem.push(0);
            dependencias.push(elem);
            ref[elem[0]]= dependencias.length -1;
        });
        datos['sub-dependencies'].map((elem,index)=>{
            elem.push(0);
            elem.push(0);
            dependencias.push(elem);
            ref[elem[0]]= dependencias.length - 1;
        });

        this.setState({
            dependencias:dependencias,
            ref:ref,
        },()=>(this.pedirLimitesDependencias()));

        
    }

    pedirDependenciasAsociadas(){
        this.db.pedir_dependencias_jurisdiccion(this.cargarDependencias,this.state.codigo)
    }

    componentWillReceiveProps(props){
        let depen = this.state.dependencias;
        if (props.codigo !== this.state.codigo){
            depen = [];
        }

        this.setState({
            codigo:props.codigo,
            secretaria:props.secretaria,
            limite:props.limite,
            gastos:props.gastos,
            dependencias:depen,
            desde:props.desde,
            hasta:props.hasta,
        },()=>(this.pedirDependenciasAsociadas()))
        

    }

    listarDependencias(){
        if(this.state.dependencias.length === 0 ){
            return null;
        }

        let depen = this.state.dependencias;
        depen.sort((a,b)=> b[b.length -1] - a[a.length - 1] )

        return depen.map((elem,index)=>(
            <TarjetaDepen limite={elem[elem.length - 2]} gastado={elem[elem.length - 1]} descripcion={elem[1]} ></TarjetaDepen>
        ))
    }
    ponerPuntuacion(numero){
        
        let texto = numero.toString();
        let coma = texto.indexOf('.');
        texto = texto.replace('.',',');
        let final = texto.substr(coma,3);
        let aux = 0;
        
        for (let x = coma - 1; x >= 0; x--){
            final = texto[x] + final;
            aux += 1;
            if(aux === 3){
                final = '.' + final;
                aux = 0;
            }

        }
        if(final[0] === '.'){
            final = final.substr(1,final.length - 1)
        }
        return final;
    }

    render(){

        let gastoTotal = 0;
        this.state.gastos.map((elem)=>(gastoTotal += parseFloat(elem)));

        return(
            <Paper style={{float:'left',display:'inline-block',width:'400px',margin:'5px',height:'600px'}} >
                <div style={{margin:'5px'}} >
                    <div style={{textAlign:'center'}}>
                        <label style={{fontSize:'22px'}} >{this.state.secretaria}</label>
                    </div>
                    <br/>
                    <Tabs>
                        <Tab label='Secretaria' >
                            <label >Gastos del periodo Seleccionado : ${this.ponerPuntuacion(gastoTotal.toFixed(2))} </label>
                            <br/>
                            <label htmlFor="">Horas al 50%: ${this.ponerPuntuacion(this.state.gastos[0].toFixed(2))}</label>
                            <br/>
                            <label htmlFor="">Horas al 100%: ${this.ponerPuntuacion(this.state.gastos[1].toFixed(2))}</label>
                            <br/>
                            <label htmlFor="">Nocturnidad al 50%: ${this.ponerPuntuacion(this.state.gastos[2].toFixed(2))}</label>
                            <br/>
                            <label htmlFor="">Nocturnidad al 100%: ${this.ponerPuntuacion(this.state.gastos[3].toFixed(2))}</label>
                            <br/>

                        </Tab>
                        <Tab label='Dependencias'>
                            <div style={{width:'100%',height:'490px',overflowY:'auto',flexDirection:'column'}} >
                            {this.listarDependencias()}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                
            </Paper>
        )
    }
}




class Tarjetas extends Component{

    constructor(props){
        super(props);
        this.state={
            secretarias:props.secretarias,
            consumos:props.consumos
        }

        this.actualizarActual = props.funAct;

    }


    componentWillReceiveProps(props){
        this.setState({
            secretarias:props.secretarias,
            consumos:props.consumos,
        })
    }

    generarTarjetas(){

        let lista = this.state.secretarias;
        if(lista.lenght === 0 ){
            return []
        }

        return lista.map((elem,index)=>{
            let gastos = 0
            if(elem[0] in this.state.consumos){
                gastos = this.state.consumos[elem[0]].reduce((a,b)=>(parseFloat(a) + parseFloat(b)),0);
            }
            return <Tarjeta codigo={elem[0]} nombre={elem[1]} limite={elem[2]} 
            gastado={gastos} funAct={this.actualizarActual} ></Tarjeta>
        })
    }


    render(){
        let tam = window.innerHeight - 200
        return(
            <div style={{minWidth:'400px',maxWidth:'700px',float:'left',height:tam,overflowY:'auto'}} >
                <List>
                    {this.generarTarjetas()}    
                </List>
            </div>
        )
    }
}


class Tarjeta extends Component{
    
    constructor(props){
        super(props);

        this.state={
            codigo:props.codigo,
            nombre:props.nombre,
            limite:props.limite,
            gastado:props.gastado,
        }

        this.seleccionar = props.funAct;
        this.marcarActual = this.marcarActual.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            codigo:props.codigo,
            nombre:props.nombre,
            limite:props.limite,
            gastado:props.gastado,
        })
    }

    marcarActual(evento){
        console.log(this.state.codigo);
        this.seleccionar(this.state.codigo);
    }
    ponerPuntuacion(numero){
        
        let texto = numero.toString();
        let coma = texto.indexOf('.');
        texto = texto.replace('.',',');
        let final = texto.substr(coma,3);
        let aux = 0;
        
        for (let x = coma - 1; x >= 0; x--){
            final = texto[x] + final;
            aux += 1;
            if(aux === 3){
                final = '.' + final;
                aux = 0;
            }

        }
        if(final[0] === '.'){
            final = final.substr(1,final.length - 1)
        }
        return final;
    }

    render(){

        return( 
            <ListItem style={{display:'inline-block',width:'300px',margin:'10px',height:'90px'}} onClick={this.marcarActual} >
                <div style={{margin:'5px'}}>
                    <label htmlFor="">{this.state.nombre}</label>
                    <br/>
                    <label htmlFor="">Gastado: </label>
                    <label htmlFor=""> ${this.ponerPuntuacion(this.state.gastado.toFixed(2))}</label>
                    <label htmlFor="" style={{marginLeft:'5px'}} > De </label>
                    <label htmlFor="">${this.state.limite}</label>
                </div>
            </ListItem>
        )
    }
}


class TarjetaDepen extends Component{

    constructor(props){
        super(props);

        this.state ={
            descripcion:props.descripcion,
            limite:props.limite,
            gastado:props.gastado
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            descripcion:props.descripcion,
            limite:props.limite,
            gastado:props.gastado
        })
    }
    ponerPuntuacion(numero){
        
        let texto = numero.toString();
        let coma = texto.indexOf('.');
        texto = texto.replace('.',',');
        let final = texto.substr(coma,3);
        let aux = 0;
        
        for (let x = coma - 1; x >= 0; x--){
            final = texto[x] + final;
            aux += 1;
            if(aux === 3){
                final = '.' + final;
                aux = 0;
            }

        }
        if(final[0] === '.'){
            final = final.substr(1,final.length - 1)
        }
        return final;
    }

    render(){

        return(
            <Paper style={{width:'360px',height:'70px',display:'block'}} >
                <div style={{margin:'5px'}} >
                    <label htmlFor="">{this.state.descripcion}</label>
                    <br/>
                    <label style={{width:'70px', display:'inline-block'}} >Gastado: </label>
                    <label htmlFor=""> ${this.ponerPuntuacion(this.state.gastado.toFixed(2))}</label>
                    <label style={{width:'30px',display:'inline-block',marginLeft:'5px'}}> de </label>
                    <label htmlFor="">${this.state.limite}</label>         
                </div>
            </Paper>
        )
    }
}