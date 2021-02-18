const inputAddTask = document.getElementById("inputAddTask");
const btnAddTask = document.getElementById("btnAddTask");
const listaTareas = document.getElementById("listaTareas");
const formularioEdit = document.getElementById("formEdit");
const buttonCorta = document.getElementById("defCorta");
const buttonMediana = document.getElementById("defMediana");
const buttonLarga = document.getElementById("defLarga");
const buttonListo = document.getElementById("btnListo");

var startTimer = null;

var tareas = {
    1613435827964 : {
        id: 1613435827964,
        texto: 'Lorem akjhdkash ajhgsdjkas dhajs djkashd ashdj asdhjas dhjkashd ashdja shdjkasgdhasg dhasgdh',
        estado: 'pendiente',
        duracion: '1:25'
    }
};


document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("tareas")){
        tareas = JSON.parse(localStorage.getItem("tareas"));
    }
    loadTareas();
    

    //displayTareas();
})
/** funcion que recorre la coleccion de objetos y carga las tareas  */
function loadTareas(){
    Object.values(tareas).forEach(tarea =>{
        addToDo(tarea.id, tarea.texto, tarea.estado, tarea.duracion);
        
    })
    
}
/** evento para mostrar el div de seleccionar tiempo */
inputAddTask.addEventListener('keyup' , function(){
    document.getElementById("divSelecOptionsTask").style.visibility = "visible"; 
})
/** funcion que añade una sola tarea al DOM */
function addToDo(id, texto, estado, duracion){
    
    if(estado == "realizada"){
        return;
    }
    var claseAlert ="";
    var iconEstatus = "";
    if(estado == "pendiente"){
        claseAlert ="alert-pendiente";
        iconEstatus = "fa-play";
    }else if(estado == "en curso"){
        claseAlert = "alert-inicializada";
        iconEstatus = "fa-pause";
    }else if(estado == "pausada"){
        claseAlert = "alert-inicializada";
        iconEstatus = "fa-play";
    }
    var arrayTiempo = duracion.split(":");
    
    const item =
            `<div class="alert ${claseAlert} divTarea p-1 my-1" id="${id}">
                <div class="row">
                    <div class="col-2 d-flex">
                        <i class="far fa-circle readId my-auto" data-id="${id}" role="button"></i>
                    </div>
                    <div class="col-8">
                        <div class="row p-0">
                            <p class="m-0 p-0" >${texto}</p>
                        </div>
                        <div class="row mt-2">
                            <div class="col-3">
                                <h6 class="my-0 text-center"><small><span class="nuevoTiempo">${arrayTiempo[0]}</span>:<span class="nuevoTiempo">${arrayTiempo[1]}</span>:<span class="nuevoTiempo">00</span></small> </h6>
                            </div>
                            <div class="col-3">
                                <h6 class="my-0 text-center">
                                    <small><i class="fas fa-redo-alt readId" data-id="${id}" role="button"></i></small>
                                </h6>
                            </div>
                            <div class="col-3">
                                <h6 class="my-0 text-center">
                                    <small><i class="fas fa-edit readId" data-id="${id}" role="button"></i></small> 
                                </h6>
                            </div>
                            <div class="col-3">
                                <h6 class="my-0 text-center">
                                    <small><i class="fas fa-trash-alt readId" data-id="${id}" role="button"></i></small> 
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-2 d-flex">
                        <i class="fas fa-play readId my-auto ml-auto pr-1" data-id="${id}" role="button"></i>
                        

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
    }else if(flagCorta == false && flagMediana == false && flagLarga == false){
        alert("Debe de escoger la duración de la tarea");
        return;
    }
    var duracion;
    if(flagCorta == true){
        duracion = "0:30";
        flagCorta = false;
        buttonCorta.parentNode.classList.remove("selected");
    }
    if(flagMediana == true){
        duracion = "0:45";
        flagMediana = false;
        buttonMediana.parentNode.classList.remove("selected");
    }
    if(flagLarga == true){
        duracion = "1:00";
        flagLarga = false;
        buttonLarga.parentNode.classList.remove("selected");

    }

    const tarea = {
        id: Date.now(),
        texto: inputAddTask.value,
        estado: "pendiente",
        duracion: duracion
    }
    tareas[tarea.id] = tarea;
    localStorage.setItem("tareas", JSON.stringify(tareas));
    inputAddTask.value = "";    
    addToDo(tarea.id, tarea.texto, tarea.estado, tarea.duracion);
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
/* evento que me permitira saber que boton fue presionado y realizar funciones despues de esto*/
listaTareas.addEventListener("click", e => {
    btnAccion(e);
})

/** desencadena funciones en base al boton presionado */
const btnAccion = e =>{
    if(e.target.classList.contains("fa-circle")){
        completeTask(e);
        
    }
    if(e.target.classList.contains("fa-play")){
        playTask(e);
    }
    if(e.target.classList.contains("fa-pause")){
        tareas[e.target.dataset.id].estado = "pausada";
    }
    if(e.target.classList.contains("fa-edit")){
        var id = e.target.dataset.id;
        document.getElementById("inputEditDescripcion").value = tareas[id].texto;
        document.getElementById("inputEditDescripcion").dataset.id = id;
        if(tareas[id].estado == "pendiente"){   
            var arrayTiempo = tareas[id].duracion.split(":");   
            
            document.getElementById("pickHora").value = arrayTiempo[0];
            document.getElementById("pickMinuto").value = arrayTiempo[1];
            document.getElementById("divEditarDuracion").style.visibility = "visible"; 
        }else{
            document.getElementById("divEditarDuracion").style.visibility = "hidden";
        }
        $("#modalEdit").modal();
        
        
    }
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
        var hora =  document.getElementById("pickHora").value;
        var minuto =  document.getElementById("pickMinuto").value;
        if((hora == 0 && minuto == 0) || (hora > 2) || (hora < 0) || (minuto > 59) || (minuto < 0)){
            alert("Valores no validos");
            return;
        }
        var duracion = hora + ":" + minuto;
        tareas[id].duracion = duracion;
        div.querySelectorAll(".nuevoTiempo")[0].textContent = hora;
        div.querySelectorAll(".nuevoTiempo")[1].textContent = minuto;
    }
    tareas[id].texto = text;    
    div.querySelector("p").textContent = text;
    $("#modalEdit").modal("toggle");
    localStorage.setItem("tareas", JSON.stringify(tareas));
    
})
var second = 0;
function timer(id){
    const div = document.getElementById(id);
    
    var minute = Number.parseInt(div.querySelectorAll(".nuevoTiempo")[1].textContent);
    var hour = Number.parseInt(div.querySelectorAll(".nuevoTiempo")[0].textContent);
    

    if(second != 0){
        second--;
        div.querySelectorAll(".nuevoTiempo")[2].textContent = second;
    }else if(minute != 0 && second == 0){
        second = 59;
        minute--;
        div.querySelectorAll(".nuevoTiempo")[2].textContent = second;
        div.querySelectorAll(".nuevoTiempo")[1].textContent = minute;
    }else if(hour != 0 && minute == 0 && second == 0){
        second = 59;
        minute = 59;
        hour--;
        div.querySelectorAll(".nuevoTiempo")[2].textContent = second;
        div.querySelectorAll(".nuevoTiempo")[1].textContent = minute;
        div.querySelectorAll(".nuevoTiempo")[0].textContent = hour;
    }
    
    //minute.value--;
}

/** pone una tarea en marcha */
function playTask(element){
    var id = element.target.dataset.id;
    
    var div = document.getElementById(id);
    
    div.classList.replace("alert-pendiente", "alert-inicializada");;
    tareas[id].estado = "en curso";
    
    div.querySelector(".fa-play").classList.replace("fa-play", "fa-pause");
    localStorage.setItem("tareas", JSON.stringify(tareas));
    startTimer = setInterval(function() {
        timer(id);
    }, 1000);
}

/** elimina una tarea */
function deleteTask(element){
    var id = element.target.dataset.id;
    
    var div = document.getElementById(id);

    delete tareas[id];
    listaTareas.removeChild(div);
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

/** completa una tarea */
function completeTask(element){
    var id = element.target.dataset.id;
    
    var div = document.getElementById(id);

    tareas[id].estado = "realizada";
    listaTareas.removeChild(div);
    localStorage.setItem("tareas", JSON.stringify(tareas));
}
var flagCorta = false;
var flagMediana = false;
var flagLarga = false;

buttonCorta.addEventListener("click", e =>{
    if(flagMediana == true){
        buttonMediana.parentNode.classList.remove("selected");
        flagCorta = false;
    }else if(flagLarga == true){
        buttonLarga.parentNode.classList.remove("selected");  
        flagLarga = false;
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
    }
    e.target.parentNode.classList.add("selected");
    flagLarga = true;
})

buttonListo.addEventListener("click", e =>{
    if(flagCorta == false && flagMediana == false && flagLarga == false){
        alert("Debe de escoger la duración de la tarea");
    }
    setTarea();    
})

