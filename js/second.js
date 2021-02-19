const inputAddTask = document.getElementById("inputAddTask");
const btnAddTask = document.getElementById("btnAddTask");
const listaTareas = document.getElementById("listaTareas");
const formularioEdit = document.getElementById("formEdit");
const buttonCorta = document.getElementById("defCorta");
const buttonMediana = document.getElementById("defMediana");
const buttonLarga = document.getElementById("defLarga");
const inputPersonalizadaHora = document.getElementById("personalizadaHora");
const inputPersonalizadaMinuto = document.getElementById("personalizadaMinuto");
const inputPersonalizadaSegundo = document.getElementById("personalizadaSegundo");
const buttonListo = document.getElementById("btnListo");
const buttonFiltroCorta = document.getElementById("btnFiltroCorta");
const buttonFiltroMedia = document.getElementById("btnFiltroMedia");
const buttonFiltroLarga = document.getElementById("btnFiltroLarga");
const buttonFiltroTodas = document.getElementById("btnFiltroTodas");
const pillHistorial = document.getElementById("pillHistorial");
const divHistorial = document.getElementById("historial");
const pillGrafica = document.getElementById("pillGrafica");

var flagCorta = false;
var flagMediana = false;
var flagLarga = false;
var flagPersonalizada = false;
var flagTareaEnCurso = false;

var startTimer = null;


var arrayNombresTareas = ["Ir al mercado",
"Cocinar",
"Barrer",
"Tarea de inglés",
"Sacudir muebles",
"Verificar carro",
"Revisar correo electrónico",
"Responder correos",
"Sacar al perro",
"Limpiar el patio",
"Recoger ropa de lavandería",
"Regresar paquete en estafeta",
"Doblar ropa",
"Guardar el super ",
"Acomodar juguetes",
"Levantar trastes ",
"Registrarme en curso",
"Hablarle a mis padres", 
"Ir a la cafetería con mi amiga",
"Cromprar dulces",
"Llevar a la estética al perro",
"Sacar la basura",
"Hacer ejercicio",
"Comprar ropa",
"Estudiar",
"Practicar box",
"Leer",];
var arrayDuracion = ["0:30:00", "0:45:00", "1:00:00"];


var tareas = {};
/** funcion para crear las 50 tareas random */
function randomTareas(){
    var fecha = new Date();
    
    var diaActualSemana = fecha.getDay();
    if(diaActualSemana == 0){
        diaActualSemana = 7;
    }
    diaActualSemana--;
    
      
    var fecha2 = new Date();
    fecha2 = fecha2.setDate(fecha2.getDate()-diaActualSemana);
    var fechaInicioSemana = new Date(fecha2);
    //console.log(fechaInicioSemana)
    
    
    for(var i = 0; i < 50; i++){
        var numberRandom = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
        
        var fechaRandom = new Date();
        fechaRandom = fechaRandom.setDate(fechaInicioSemana.getDate()+numberRandom)
        var fechaAuxRandom = new Date(fechaRandom);
       
        
        

        const tarea = {
            id: i,
            texto: arrayNombresTareas[Math.floor(Math.random() * arrayNombresTareas.length)],
            estado: "realizada",
            duracion: arrayDuracion[Math.floor(Math.random() * arrayDuracion.length)],
            tiempoRestante : "0:00:00",
            fechaFinal : fechaAuxRandom.getDate() + " / " + (fechaAuxRandom.getMonth()+1) + " / " + fechaAuxRandom.getFullYear(),    
            diaSemana : fechaAuxRandom.getDay(),    
            fechaTerminoUnix : fechaRandom
        } 
        
        tareas[tarea.id] = tarea;
    }
}

randomTareas();


// tareas = {
//     1613435827964 : {
//         id: 1613435827964,
//         texto: 'Lorem akjhdkash ajhgsdjkas dhajs djkashd ashdj asdhjas dhjkashd ashdja shdjkasgdhasg dhasgdh',
//         estado: 'pendiente',
//         duracion: '1:25:00',
//         tiempoRestante : ''
//     }
// };

/** obtener las tareas de localstorage si existen */
document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("tareas")){
        tareas = JSON.parse(localStorage.getItem("tareas"));
    }
    loadTareas();
    
})

/** funcion que recorre la coleccion de objetos y carga las tareas  */
function loadTareas(){
    
    Object.values(tareas).forEach(tarea =>{
        addToDo(tarea.id, tarea.texto, tarea.estado, tarea.duracion, tarea.tiempoRestante);
        
    })
    
}

/** evento para mostrar el div de seleccionar tiempo */
inputAddTask.addEventListener('keyup' , function(){
    document.getElementById("divSelecOptionsTask").style.visibility = "visible"; 
})

/** evento para ocultar el div de seleccionar tiempo */
inputAddTask.addEventListener('blur' , function(){
    if(inputAddTask.value.trim() === ""){
        document.getElementById("divSelecOptionsTask").style.visibility = "hidden"; 
    }
    
})

/** funcion que añade una sola tarea al DOM */
function addToDo(id, texto, estado, duracion, tiempoRestante){
     var arrayTiempo
    if(estado == "realizada"){
        return;
    }
    var claseAlert ="";
    var iconEstatus = "";
    if(estado == "pendiente"){
        claseAlert ="alert-pendiente";
        iconEstatus = "fa-play";
        arrayTiempo = duracion.split(":");
    }else if(estado == "en curso"){
        claseAlert = "alert-inicializada";
        iconEstatus = "fa-pause";
    }else if(estado == "pausada"){
        claseAlert = "alert-inicializada";
        iconEstatus = "fa-play";
        arrayTiempo = tiempoRestante.split(":");
    }
    
    

    
    const item =
            `<div class="alert ${claseAlert} divTarea p-1 my-2" id="${id}">
                <div class="row">
                    <div class="col-2 d-flex ">
                        <i class="icon-check mx-auto fas fa-check readId my-auto" data-id="${id}" role="button"></i>
                    </div>
                    <div class="col-8">
                        <div class="row p-0">
                            <p class="m-0 p-0" >${texto}</p>
                        </div>
                        <div class="row mt-2">
                            <div class="col-3">
                                <h6 class="my-0 text-center"><small><span class="nuevoTiempo">${arrayTiempo[0]}</span>:<span class="nuevoTiempo">${arrayTiempo[1] < 10 ? "0" + Number.parseInt(arrayTiempo[1]) : arrayTiempo[1]}</span>:<span class="nuevoTiempo">${arrayTiempo[2] < 10 ? "0" + Number.parseInt(arrayTiempo[2]) : arrayTiempo[2]}</span></small> </h6>
                            </div>
                            <div class="col-3">
                                <h6 class="my-0 text-center">
                                    <small><i class="icon-reset fas fa-redo-alt readId" data-id="${id}" role="button"></i></small>
                                </h6>
                            </div>
                            <div class="col-3">
                                <h6 class="my-0 text-center">
                                    <small><i class="icon-edit fas fa-edit readId" data-id="${id}" role="button"></i></small> 
                                </h6>
                            </div>
                            <div class="col-3">
                                <h6 class="my-0 text-center">
                                    <small><i class="icon-basura fas fa-trash-alt readId" data-id="${id}" role="button"></i></small> 
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-2 d-flex">
                        <i class="icon-play mx-auto fas ${iconEstatus} checkPlayPause readId my-auto ml-auto pr-1" data-id="${id}" role="button"></i>
                        

                    </div>
                </div>
            </div>`;
    const position = "beforeend";
    listaTareas.insertAdjacentHTML(position,item);
    
}

/** funcion que recopila los datos de la tarea para poder añadirla */
const setTarea = () =>{
    
    if(inputAddTask.value.trim() === ""){
        return;
    }else if(flagCorta == false && flagMediana == false && flagLarga == false && flagPersonalizada == false){
        alert("Debe de escoger la duración de la tarea");
        return;
    }
    var duracion;
    if(flagCorta == true){
        duracion = "0:30:00";
        flagCorta = false;
        buttonCorta.parentNode.classList.remove("selected");
    }
    if(flagMediana == true){
        duracion = "0:45:00";
        flagMediana = false;
        buttonMediana.parentNode.classList.remove("selected");
    }
    if(flagLarga == true){
        duracion = "1:00:00";
        flagLarga = false;
        buttonLarga.parentNode.classList.remove("selected");

    }
    if(flagPersonalizada == true){
        duracion = inputPersonalizadaHora.value + ":" + inputPersonalizadaMinuto.value + ":" + inputPersonalizadaSegundo.value;
        flagPersonalizada = false;
    }

    const tarea = {
        id: Date.now(),
        texto: inputAddTask.value,
        estado: "pendiente",
        duracion: duracion,
        tiempoRestante : ""
    }
    tareas[tarea.id] = tarea;
    localStorage.setItem("tareas", JSON.stringify(tareas));
    inputAddTask.value = "";    
    addToDo(tarea.id, tarea.texto, tarea.estado, tarea.duracion);
    inputPersonalizadaHora.value = 0;
    inputPersonalizadaMinuto.value = 0;
    inputPersonalizadaSegundo.value = 0;
    document.getElementById("divSelecOptionsTask").style.visibility = "hidden"; 
    
    
}

/** evento que se dispara al presionar enter sobre el input para fijar una tarea */
inputAddTask.addEventListener("keyup", e => {
    if(e.keyCode == 13){
        setTarea();        
    }
})

/** funcion que se dispara al dar click sobre el boton al lado del input para añadir una tarea */
btnAddTask.addEventListener("click", e => {
    setTarea();
})

/* evento que me permitira saber que icono fue presionado */
listaTareas.addEventListener("click", e => {
    btnAccion(e);
})

/** desencadena funciones en base al icono presionado */
const btnAccion = e =>{
    if(e.target.classList.contains("fa-check")){
        completeTask(e);
        
    }else
    if(e.target.classList.contains("fa-play")){
        playTask(e);
    }else
    if(e.target.classList.contains("fa-pause")){
        pauseTask(e);
        
    }else
    if(e.target.classList.contains("fa-redo-alt")){
        resetTask(e);
        
    }else
    if(e.target.classList.contains("fa-edit")){
        editTask(e);
        
        
        
    }else
    if(e.target.classList.contains("fa-trash-alt")){
        deleteTask(e)
        
    }

    

    e.stopPropagation();
}

/** evento submit para la edicion de una tarea */
formularioEdit.addEventListener("submit", e=> {
    e.preventDefault();
    var text = document.getElementById("inputEditDescripcion").value;   
    var id = document.getElementById("inputEditDescripcion").dataset.id;
    var div = document.getElementById(id);
    if(document.getElementById("divEditarDuracion").style.visibility == "visible"){
        var hora =  Number.parseInt(document.getElementById("pickHora").value);
        var minuto =  Number.parseInt(document.getElementById("pickMinuto").value);
        var segundo =  Number.parseInt(document.getElementById("pickSegundo").value);


        if((hora == 0 && minuto == 0 && segundo == 0) || (hora > 2) || (hora < 0) || (minuto > 59) || (minuto < 0) || (hora == 2 && minuto > 0) || (hora == 2 && segundo > 0)){
            alert("Valores no validos");
            return;
        }
        var duracion = hora + ":" + minuto + ":" + segundo;
        tareas[id].duracion = duracion;
        div.querySelectorAll(".nuevoTiempo")[0].textContent = hora;
        div.querySelectorAll(".nuevoTiempo")[1].textContent = minuto < 10 ? "0" + minuto : minuto;
        div.querySelectorAll(".nuevoTiempo")[2].textContent = segundo < 10 ? "0" + segundo : segundo;
    }
    tareas[id].texto = text;    
    div.querySelector("p").textContent = text;
    $("#modalEdit").modal("toggle");
    localStorage.setItem("tareas", JSON.stringify(tareas));
    
})


/** funcion que comenzara la cuenta regrsiva de una tarea */
function timer(id){
    const div = document.getElementById(id);
    var second = Number.parseInt(div.querySelectorAll(".nuevoTiempo")[2].textContent);    
    var minute = Number.parseInt(div.querySelectorAll(".nuevoTiempo")[1].textContent);
    var hour = Number.parseInt(div.querySelectorAll(".nuevoTiempo")[0].textContent);
    
    

    if(second != 0){
        second--;
        if(second < 10){
            second = "0"+second;
        }
        div.querySelectorAll(".nuevoTiempo")[2].textContent = second;
    }else if(minute != 0 && second == 0){
        second = 59;
        minute--;
        if(minute < 10){
            minute = "0"+minute;
        }
        div.querySelectorAll(".nuevoTiempo")[2].textContent = second;
        div.querySelectorAll(".nuevoTiempo")[1].textContent = minute;
    }else if(hour != 0 && minute == 0 && second == 0){
        second = 59;
        minute = 59;
        hour--;
        
        div.querySelectorAll(".nuevoTiempo")[2].textContent = second;
        div.querySelectorAll(".nuevoTiempo")[1].textContent = minute;
        div.querySelectorAll(".nuevoTiempo")[0].textContent = hour;
    }else if((hour==0)&&(minute == 0)&&(second==0))
	{
        /** marcar tarea como finalizada */
		clearInterval(startTimer);
        var fecha = new Date();
		tareas[id].estado = "realizada";
        tareas[id].tiempoRestante = "0:00:00";
        tareas[id].diaSemana = fecha.getDay();  
        tareas[id].fechaFinal = fecha.getDate() + " / " + ((fecha.getMonth()+1) < 10 ? "0" + (fecha.getMonth()+1) : (fecha.getMonth()+1)) + " / " + fecha.getFullYear();    

        tareas[id].fechaTerminoUnix = Date.now();
        localStorage.setItem("tareas", JSON.stringify(tareas));        
        listaTareas.removeChild(div);
	}
    
}


/** pone una tarea en marcha */
function playTask(element){
    Object.values(tareas).forEach(tarea =>{
        if(tarea.estado == "en curso"){
            flagTareaEnCurso = true;
        }
        
    })
    if(flagTareaEnCurso){
        alert("Existe una tarea en curso");
        flagTareaEnCurso = false;
        return;
    }
    var id = element.target.dataset.id;
    var textId = "#"+id;
    
    var div = document.getElementById(id);
    
    div.classList.replace("alert-pendiente", "alert-inicializada");
    tareas[id].estado = "en curso";
    
    div.querySelector(".fa-play").classList.replace("fa-play", "fa-pause");
    localStorage.setItem("tareas", JSON.stringify(tareas));
    var firstId = "#"+listaTareas.querySelectorAll(".divTarea")[0].id;
    
    $("#listaTareas").each(function() {
        $(textId, this).insertBefore($(firstId, this));
    });
    startTimer = setInterval(function() {
        timer(id);
    }, 1000);
    
}

/** pausa el reloj de una tarea */
function pauseTask(element){
    var id = element.target.dataset.id;
    var div = document.getElementById(id);
    var tiempoRestante = div.querySelectorAll(".nuevoTiempo")[0].textContent+":"+div.querySelectorAll(".nuevoTiempo")[1].textContent+":"+div.querySelectorAll(".nuevoTiempo")[2].textContent;
    
    div.querySelector(".fa-pause").classList.replace("fa-pause", "fa-play");
    tareas[id].tiempoRestante = tiempoRestante;
    tareas[id].estado = "pausada";
    localStorage.setItem("tareas", JSON.stringify(tareas));
    clearInterval(startTimer);
}


function resetTask(element){
    clearInterval(startTimer);
    var id = element.target.dataset.id;
    var div = document.getElementById(id);
    var arrayTiempo = tareas[id].duracion.split(":");
    div.classList.replace("alert-inicializada", "alert-pendiente");
    if(div.querySelector(".checkPlayPause").classList.contains("fa-pause")){
        div.querySelector(".checkPlayPause").classList.replace("fa-pause", "fa-play");
    }
    div.querySelectorAll(".nuevoTiempo")[0].textContent = arrayTiempo[0];
    div.querySelectorAll(".nuevoTiempo")[1].textContent = arrayTiempo[1];
    div.querySelectorAll(".nuevoTiempo")[2].textContent = "00";
    tareas[id].tiempoRestante = "";
    tareas[id].estado = "pendiente";
    localStorage.setItem("tareas", JSON.stringify(tareas));
    
    
}


function deleteTask(element){
    var id = element.target.dataset.id;
    
    var div = document.getElementById(id);

    delete tareas[id];
    listaTareas.removeChild(div);
    localStorage.setItem("tareas", JSON.stringify(tareas));
}


function completeTask(element){
    clearInterval(startTimer);
    var id = element.target.dataset.id;
    
    var div = document.getElementById(id);
    var tiempoRestante = div.querySelectorAll(".nuevoTiempo")[0].textContent+":"+div.querySelectorAll(".nuevoTiempo")[1].textContent+":"+div.querySelectorAll(".nuevoTiempo")[2].textContent;
    var fecha = new Date();
    tareas[id].tiempoRestante = tiempoRestante;
    tareas[id].estado = "realizada";
    tareas[id].fechaFinal = fecha.getDate() + " / " + (fecha.getMonth()+1) + " / " + fecha.getFullYear();    
    tareas[id].diaSemana = fecha.getDay();    
    tareas[id].fechaTerminoUnix = Date.now();
    listaTareas.removeChild(div);
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function editTask(element){
    var id = element.target.dataset.id;
        document.getElementById("inputEditDescripcion").value = tareas[id].texto;
        document.getElementById("inputEditDescripcion").dataset.id = id;
        if(tareas[id].estado == "pendiente"){   
            var arrayTiempo = tareas[id].duracion.split(":");   
            
            document.getElementById("pickHora").value = arrayTiempo[0];
            document.getElementById("pickMinuto").value = arrayTiempo[1];
            document.getElementById("pickSegundo").value = arrayTiempo[2];

            document.getElementById("divEditarDuracion").style.visibility = "visible"; 
        }else{
            document.getElementById("divEditarDuracion").style.visibility = "hidden";
        }
        $("#modalEdit").modal();
}


/** verificaciones de los botones seleccionados para la duracion de la tarea */
buttonCorta.addEventListener("click", e =>{
    if(flagMediana == true){
        buttonMediana.parentNode.classList.remove("selected");
        flagCorta = false;
    }else if(flagLarga == true){
        buttonLarga.parentNode.classList.remove("selected");  
        flagLarga = false;
    }else if(flagPersonalizada == true){
        inputPersonalizadaHora.value = "";
        inputPersonalizadaMinuto.value = "";
        inputPersonalizadaSegundo.value = "";
        flagPersonalizada = false;
    }
    e.target.parentNode.classList.add("selected");
    flagCorta = true;
})

buttonMediana.addEventListener("click", e =>{
    if(flagCorta == true){
        buttonCorta.parentNode.classList.remove("selected");
        flagCorta = false;
    }else if(flagLarga == true){
        buttonLarga.parentNode.classList.remove("selected");  
        flagLarga = false;
    }else if(flagPersonalizada == true){
        inputPersonalizadaHora.value = "";
        inputPersonalizadaMinuto.value = "";
        inputPersonalizadaSegundo.value = "";
        flagPersonalizada = false;
    }
    e.target.parentNode.classList.add("selected");
    flagMediana = true;
})

buttonLarga.addEventListener("click", e =>{
    if(flagCorta == true){
        buttonCorta.parentNode.classList.remove("selected");
        flagCorta = false;
    }else if(flagMediana == true){
        buttonMediana.parentNode.classList.remove("selected");  
        flagMediana = false;
    }else if(flagPersonalizada == true){
        inputPersonalizadaHora.value = "";
        inputPersonalizadaMinuto.value = "";
        inputPersonalizadaSegundo.value = "";
        flagPersonalizada = false;
    }
    e.target.parentNode.classList.add("selected");
    flagLarga = true;
})

inputPersonalizadaHora.addEventListener("change", e => {
    if(flagCorta == true){
        buttonCorta.parentNode.classList.remove("selected");
        flagCorta = false;
    }else if(flagMediana == true){
        buttonMediana.parentNode.classList.remove("selected");  
        flagMediana = false;
    }else if(flagLarga == true){
        buttonLarga.parentNode.classList.remove("selected");  
        flagLarga = false;
    }
    flagPersonalizada = true;
})

inputPersonalizadaMinuto.addEventListener("change", e => {
    if(flagCorta == true){
        buttonCorta.parentNode.classList.remove("selected");
        flagCorta = false;
    }else if(flagMediana == true){
        buttonMediana.parentNode.classList.remove("selected");  
        flagMediana = false;
    }else if(flagLarga == true){
        buttonLarga.parentNode.classList.remove("selected");  
        flagLarga = false;
    }
    flagPersonalizada = true;
})

inputPersonalizadaSegundo.addEventListener("change", e => {
    if(flagCorta == true){
        buttonCorta.parentNode.classList.remove("selected");
        flagCorta = false;
    }else if(flagMediana == true){
        buttonMediana.parentNode.classList.remove("selected");  
        flagMediana = false;
    }else if(flagLarga == true){
        buttonLarga.parentNode.classList.remove("selected");  
        flagLarga = false;
    }
    flagPersonalizada = true;
})

buttonListo.addEventListener("click", e =>{
    if(flagCorta == false && flagMediana == false && flagLarga == false && flagPersonalizada == false){
        alert("Debe de escoger la duración de la tarea");
        return;
    }
    
    setTarea();    
})


/** filtros */
buttonFiltroCorta.addEventListener("click", () =>{
    var id, div;
    Object.values(tareas).forEach(tarea =>{
        if(tarea.estado == "en curso"){
            id = tarea.id;
            flagTareaEnCurso = true;
        }
        
    })
    if(flagTareaEnCurso){
        div = document.getElementById(id);
        var tiempoRestante = div.querySelectorAll(".nuevoTiempo")[0].textContent+":"+div.querySelectorAll(".nuevoTiempo")[1].textContent+":"+div.querySelectorAll(".nuevoTiempo")[2].textContent;
    
        div.querySelector(".fa-pause").classList.replace("fa-pause", "fa-play");
        tareas[id].tiempoRestante = tiempoRestante;
        tareas[id].estado = "pausada";
        localStorage.setItem("tareas", JSON.stringify(tareas));
        flagTareaEnCurso = false;
        

        clearInterval(startTimer);
    }
    listaTareas.innerHTML = "";
    Object.values(tareas).forEach(tarea =>{    
        var horasDuracion = Number.parseInt(tarea.duracion.split(":")[0]);
        var minutosDuracion = Number.parseInt(tarea.duracion.split(":")[1]);
        var segundosDuracion = Number.parseInt(tarea.duracion.split(":")[2]);
        if((horasDuracion == 0 && minutosDuracion == 30 && segundosDuracion == 0) || (horasDuracion == 0 && minutosDuracion < 30 && segundosDuracion >= 0) ){
            addToDo(tarea.id, tarea.texto, tarea.estado, tarea.duracion, tarea.tiempoRestante);
        }
        
    })
})

buttonFiltroMedia.addEventListener("click", () =>{
    var id, div;
    Object.values(tareas).forEach(tarea =>{
        if(tarea.estado == "en curso"){
            id = tarea.id;
            flagTareaEnCurso = true;
        }
        
    })
    if(flagTareaEnCurso){
        div = document.getElementById(id);
        var tiempoRestante = div.querySelectorAll(".nuevoTiempo")[0].textContent+":"+div.querySelectorAll(".nuevoTiempo")[1].textContent+":"+div.querySelectorAll(".nuevoTiempo")[2].textContent;
    
        div.querySelector(".fa-pause").classList.replace("fa-pause", "fa-play");
        tareas[id].tiempoRestante = tiempoRestante;
        tareas[id].estado = "pausada";
        localStorage.setItem("tareas", JSON.stringify(tareas));
        flagTareaEnCurso = false;

        clearInterval(startTimer);
    }
    listaTareas.innerHTML = "";
    Object.values(tareas).forEach(tarea =>{    
        var horasDuracion = Number.parseInt(tarea.duracion.split(":")[0]);
        var minutosDuracion = Number.parseInt(tarea.duracion.split(":")[1]);
        var segundosDuracion = Number.parseInt(tarea.duracion.split(":")[2]);
        if((horasDuracion == 1 && minutosDuracion == 0 && segundosDuracion == 0) || (horasDuracion == 0 && minutosDuracion >= 45)){
            addToDo(tarea.id, tarea.texto, tarea.estado, tarea.duracion, tarea.tiempoRestante);
        }
        
    })
})

buttonFiltroLarga.addEventListener("click", () =>{
    var id, div;
    Object.values(tareas).forEach(tarea =>{
        if(tarea.estado == "en curso"){
            id = tarea.id;
            flagTareaEnCurso = true;
        }
        
    })
    if(flagTareaEnCurso){
        div = document.getElementById(id);
        var tiempoRestante = div.querySelectorAll(".nuevoTiempo")[0].textContent+":"+div.querySelectorAll(".nuevoTiempo")[1].textContent+":"+div.querySelectorAll(".nuevoTiempo")[2].textContent;
    
        div.querySelector(".fa-pause").classList.replace("fa-pause", "fa-play");
        tareas[id].tiempoRestante = tiempoRestante;
        tareas[id].estado = "pausada";
        localStorage.setItem("tareas", JSON.stringify(tareas));
        flagTareaEnCurso = false;

        clearInterval(startTimer);
    }
    listaTareas.innerHTML = "";
    Object.values(tareas).forEach(tarea =>{    
        var horasDuracion = Number.parseInt(tarea.duracion.split(":")[0]);
        var minutosDuracion = Number.parseInt(tarea.duracion.split(":")[1]);
        var segundosDuracion = Number.parseInt(tarea.duracion.split(":")[2]);

        if((horasDuracion == 2 && minutosDuracion == 0 && segundosDuracion == 0) || (horasDuracion == 1 && minutosDuracion == 0 && segundosDuracion > 0) || (horasDuracion == 1 && minutosDuracion > 0 && segundosDuracion == 0) ){
            addToDo(tarea.id, tarea.texto, tarea.estado, tarea.duracion, tarea.tiempoRestante);
        }
        
    })
})
buttonFiltroTodas.addEventListener("click", () =>{
    var id, div;
    Object.values(tareas).forEach(tarea =>{
        if(tarea.estado == "en curso"){
            id = tarea.id;
            flagTareaEnCurso = true;
        }
        
    })
    if(flagTareaEnCurso){
        div = document.getElementById(id);
        var tiempoRestante = div.querySelectorAll(".nuevoTiempo")[0].textContent+":"+div.querySelectorAll(".nuevoTiempo")[1].textContent+":"+div.querySelectorAll(".nuevoTiempo")[2].textContent;
    
        div.querySelector(".fa-pause").classList.replace("fa-pause", "fa-play");
        tareas[id].tiempoRestante = tiempoRestante;
        tareas[id].estado = "pausada";
        localStorage.setItem("tareas", JSON.stringify(tareas));
        flagTareaEnCurso = false;

        clearInterval(startTimer);
    }
    listaTareas.innerHTML = "";
    Object.values(tareas).forEach(tarea =>{    
        
        addToDo(tarea.id, tarea.texto, tarea.estado, tarea.duracion, tarea.tiempoRestante);
        
        
    })
})

/** funcion que se dispara al seleccionar el pill historial y agrega las tareas realizadas al historial */
function addTaskHistorial(texto, duracion, tiempoRestante, fechaFinal){
    var arrayTiempo = duracion.split(":");
    var arrayTiempoRestante = tiempoRestante.split(":");
    
    const item =
            `<div class="alert alert-realizada divTarea p-1 my-1" >
                <div class="row">
                    <div class="col-1">
                        
                    </div>
                    <div class="col-10">
                        <div class="row d-flex justify-content-end">
                            <p class="text-center" >${fechaFinal}</p>
                        </div>
                        <div class="row">
                            <p >${texto}</p>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6">
                                <h6 class="my-0 text-center"><small><span class="nuevoTiempo">${arrayTiempo[0]}</span>:<span class="nuevoTiempo">${arrayTiempo[1] < 10 ? "0" + Number.parseInt(arrayTiempo[1]) : arrayTiempo[1]}</span>:<span class="nuevoTiempo">${arrayTiempo[2] < 10 ? "0" + Number.parseInt(arrayTiempo[2]) : arrayTiempo[2]}</span></small> </h6>
                                <h6 class="my-0 text-center"><small>Tiempo definido</small></h6>
                            </div>
                            <div class="col-6">
                                <h6 class="my-0 text-center"><small><span class="nuevoTiempo">${arrayTiempoRestante[0]}</span>:<span class="nuevoTiempo">${arrayTiempoRestante[1]}</span>:<span class="nuevoTiempo">${arrayTiempoRestante[2]}</span></small> </h6>
                                <h6 class="my-0 text-center"><small>Tiempo restante</small></h6>
                            </div>
                            
                        </div>
                    </div>
                    <div class="col-1">

                    </div>
                </div>
            </div>`;
    const position = "beforeend";
    divHistorial.insertAdjacentHTML(position,item);
    
}




/** guardar los datos y pausar antes de salir de la ventana */
window.addEventListener('beforeunload', (event) => {
    var id, div;
    Object.values(tareas).forEach(tarea =>{
        if(tarea.estado == "en curso"){
            id = tarea.id;
            flagTareaEnCurso = true;
        }
        
    })
    if(flagTareaEnCurso){
        div = document.getElementById(id);
        var tiempoRestante = div.querySelectorAll(".nuevoTiempo")[0].textContent+":"+div.querySelectorAll(".nuevoTiempo")[1].textContent+":"+div.querySelectorAll(".nuevoTiempo")[2].textContent;
    
        div.querySelector(".fa-pause").classList.replace("fa-pause", "fa-play");
        tareas[id].tiempoRestante = tiempoRestante;
        tareas[id].estado = "pausada";
        localStorage.setItem("tareas", JSON.stringify(tareas));
        flagTareaEnCurso = false;

        clearInterval(startTimer);
    }
    event.returnValue = `Are you sure you want to leave?`;
});



pillHistorial.addEventListener("click", () =>{
    divHistorial.innerHTML = "";
    Object.values(tareas).forEach(tarea =>{    
        if(tarea.estado == "realizada" ){
            addTaskHistorial(tarea.texto, tarea.duracion, tarea.tiempoRestante, tarea.fechaFinal);
        }
        
        
    })
})

pillGrafica.addEventListener("click", () =>{   
    
    var fecha = new Date();
    
    var diaActualSemana = fecha.getDay();
    if(diaActualSemana == 0){
        diaActualSemana = 7;
    }
    diaActualSemana--;
    
      
    var fecha2 = new Date();
    fecha2 = fecha2.setDate(fecha2.getDate()-diaActualSemana);
    var fechaInicioSemana = new Date(fecha2);
    fechaInicioSemana.setHours(0,0,0,0);
    
    
    
    var Lunes = 1;
    var Martes = 1;
    var Miercoles = 1;
    var Jueves = 1;
    var Viernes = 1;
    var Sabado = 1;
    var Domingo = 1;
    Object.values(tareas).forEach(tarea =>{    
        if(tarea.estado == "realizada" && tarea.fechaTerminoUnix >= fechaInicioSemana){
            
            if(tarea.diaSemana == 0){
                Domingo++;
            }else if(tarea.diaSemana == 1){
                Lunes++;
            }else if(tarea.diaSemana == 2){
                Martes++;
            }else if(tarea.diaSemana == 3){
                Miercoles++;
            }else if(tarea.diaSemana == 4){
                Jueves++;
            }else if(tarea.diaSemana == 5){
                Viernes++;
            }else if(tarea.diaSemana == 6){
                Sabado++;
            }
        }
        
    })
    


    var arrayDatos = [Lunes,Martes,Miercoles,Jueves,Viernes,Sabado,Domingo];
    console.log(arrayDatos)
    var ctx = document.getElementById("graficaRealizadas").getContext('2d');
    var grafica = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        // data: {
        //     labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sebado', 'Domingo'],
        //     datasets: [{
        //         label: 'Tareas realizadas',
        //         backgroundColor: 'rgb(255, 99, 132)',
        //         borderColor: 'rgb(255, 99, 132)',
        //         data: [1,2,3,4,5,6,7]
        //     }]
        // },

        data: {
        labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: arrayDatos
        }]
    },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: 'Historial de la semana'
            }
        }
    });
})


