import React, { Component } from 'react';
import Header from './App/Header.js';
import Informes from './App/Informes/PrincipalInformes';



class App extends Component {
  
  constructor(props){
    super(props);
    document.cookie += ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  render() {
    return (
      <Header/>
    );
  }
}




export default App;

