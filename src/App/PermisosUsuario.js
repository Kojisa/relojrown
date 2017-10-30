import jwt from 'jsrsasign';

export default class PermisosUsuario{

    
    cookie = document.cookie;
    dato = ()=>{
            let cookie = '; '+ document.cookie;
            let cookies = cookie.indexOf('; auth=');
            let fin = 0;
            for (let x = cookies + 1 ; x < cookie.length; x++){
                if(cookie[x]==';'){
                    fin = x;
                }
            }
            if (fin === 0) fin = cookie.length;
            return cookie.substring(cookies +1,fin);
            }
    permisos = jwt.jws.JWS.parse(this.dato()).payloadObj;
}