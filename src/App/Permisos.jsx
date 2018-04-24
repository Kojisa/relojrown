
let permisos = {};

//informe principal
permisos['informePrincipalTotal'] = 1;
permisos['informePrincipalSecretaria'] = 2;
permisos['informePrincipalDependencia'] = 3;

//datos basicos
permisos['datosBasicos'] = 4;

//actualiar inasistencias
permisos['actualizarInasistencias'] = 5;

//depurar licencias anuales
permisos['depurarLicenciasAnuales'] = 6;

//limite presupuestario
permisos['limitePresupuestario'] = 7;

//bloquear dependencias
permisos['bloquearDependencias'] = 8;

permisos['verConceptos'] = 9;

permisos['cargarManualPresentismo'] = 10;

permisos['depuracionPresentismo'] = 11;

permisos['planillones'] = 12;

permisos['presentes'] = 13;

permisos['presentismoPorLegajoTodos'] = 14;
permisos['presentismoPorLegajoPropio'] = 15;

permisos['informesTotal'] = 16;
permisos['informesSecretaria'] = 17;
permisos['informesDependencia'] = 18;
permisos['informesPropio'] = 19;

permisos['creacionUsuarios'] = 0;

let inverso = {};

for (let x = 0; x < Object.keys(permisos).length; x++){
    inverso[permisos[Object.keys(permisos)[x]]] = Object.keys(permisos)[x]
}


export function DecodificarPermisos(permUsu){
    let final = {}
    for (let permiso in permUsu){
        final[ inverso[permiso] ] = '';
    }
    return final
}


export function codificarPermiso(permiso){
    return permisos[permiso]
}

export function codificarPermisos(permUsu){
    let final = {}
    for (let permiso in permUsu){
        final[ permisos[permiso] ] = '';
    }
    return final
}