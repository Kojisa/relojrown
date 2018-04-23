import React, { Component } from 'react';
import Header from './App/Header.js';
import Informes from './App/Informes/PrincipalInformes';



class App extends Component {
  
  constructor(props){
    super(props);
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  render() {
    return (
      <Header/>
    );
  }
}




export default App;

