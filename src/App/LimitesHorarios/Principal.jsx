import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import DB from '../DBHandler';
import {SelectField,MenuItem,TextField} from 'material-ui'


export default class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            secretarias:[],//listado de secretarias
            elegida:null, //en caso de que quiera tenerlo a mano
            empleados:[], //lista de objetos react, cada actualizacion se va a gestionar de manera independiente
            filtro:'',//para filtrar por legajo o nombre,
            preFiltro:'',
        }

        this.db = new DB();
        this.db.pedir_limite_secretarias(this.recibirDependencias.bind(this));
    }

    recibirDependencias(datos){
        let listado = [];
        let secretarias = datos.budgets; //[id,nombre,0]

        secretarias.sort((a,b)=>{
            if(a[1] < b[1]){
                return -1;
            }
            else if( a[1] === b[1]){
                if(a[0] < b[0]){
                    return -1;
                }
                else{
                    return 1;
                }
            }
            else{
                return 1;
            }
        })

        listado = secretarias.map((val,ind)=><MenuItem 
            value={val[0]}
            primaryText={val[0] + ' - ' + val[1]} />)
        this.setState({secretarias:listado})
        
    }

    render(){





        return(
            <div>

                <SelectField
                    value={this.state.elegida}
                    floatingLabelText="Secretaria"
                    floatingLabelFixed={true}
                    onChange={(e, i, value) => {
                        this.setState({ elegida:value });
                        //funcion que pide los legajos
                        }
                    }
                    >
                    {this.state.secretarias}
                </SelectField>

            </div>
        )
    }
}