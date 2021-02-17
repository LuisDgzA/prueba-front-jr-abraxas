const inputAddTask = document.getElementById("inputAddTask");
const btnAddTask = document.getElementById("btnAddTask");
const listaTareas = document.getElementById("listaTareas");
const template = document.getElementById("templateTasks").content;
const fragment = document.createDocumentFragment();
const formularioEdit = document.getElementById("formEdit");

inputAddTask.addEventListener('keyup' , function(){
    document.getElementById("divSelecOptionsTask").style.visibility = "visible"; 
})

// inputAddTask.addEventListener('blur' , function(){
//     if(document.getElementById("divSelecOptionsTask").hasFocus){
//         alert("tiebe")
//     }else{
//         //document.getElementById("divSelecOptionsTask").style.visibility = "hidden"; 
//     }
    
// })

var tareas = {
    1613435827964 : {
        id: 1613435827964,
        texto: 'Lorem akjhdkash ajhgsdjkas dhajs djkashd ashdj asdhjas dhjkashd ashdja shdjkasgdhasg dhasgdh',
        estado: 'pendiente'
    }
};


document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("tareas")){
        tareas = JSON.parse(localStorage.getItem("tareas"));
    }

    displayTareas();
})

listaTareas.addEventListener("click", e => {
    btnAccion(e);
})

inputAddTask.addEventListener("keyup", e => {
    if(e.keyCode == 13){
        setTarea(e);
        
    }
})

btnAddTask.addEventListener("click", e => {
    setTarea(e);
    

    
})

const setTarea = e =>{

    if(inputAddTask.value.trim() === ""){
        return;
    }
    const tarea = {
        id: Date.now(),
        texto: inputAddTask.value,
        estado: "pendiente"
    }
    tareas[tarea.id] = tarea;
    inputAddTask.value = "";
    

    displayTareas();
}

const displayTareas = () =>{
    localStorage.setItem("tareas", JSON.stringify(tareas));
    listaTareas.innerHTML = "";
    Object.values(tareas).forEach(tarea =>{
        if(tarea.estado != "realizada"){
            const clone = template.cloneNode(true);
            clone.querySelector("p").textContent = tarea.texto;
            if(tarea.estado == "en curso"){
                clone.querySelector(".alert").classList.replace("alert-pendiente", "alert-inicializada");
                clone.querySelectorAll(".readId")[3].classList.replace("fa-play", "fa-pause");
            }else if(tarea.estado == "pausada"){
                clone.querySelector(".alert").classList.replace("alert-pendiente", "alert-inicializada");
                
            }
            clone.querySelectorAll(".readId")[0].dataset.id = tarea.id;
            clone.querySelectorAll(".readId")[1].dataset.id = tarea.id;
            clone.querySelectorAll(".readId")[2].dataset.id = tarea.id;
            clone.querySelectorAll(".readId")[3].dataset.id = tarea.id;
            fragment.appendChild(clone);
        }

        
    })
    listaTareas.appendChild(fragment);
}

const btnAccion = e =>{
    if(e.target.classList.contains("fa-circle")){
        tareas[e.target.dataset.id].estado = "realizada";
        displayTareas();
    }
    if(e.target.classList.contains("fa-play")){
        tareas[e.target.dataset.id].estado = "en curso";
        displayTareas();
    }
    if(e.target.classList.contains("fa-pause")){
        tareas[e.target.dataset.id].estado = "pausada";
        displayTareas();
    }
    if(e.target.classList.contains("fa-edit")){
        
        document.getElementById("inputEditDescripcion").value = tareas[e.target.dataset.id].texto;
        document.getElementById("inputEditDescripcion").dataset.id = e.target.dataset.id;
        $("#modalEdit").modal();
    }
    if(e.target.classList.contains("fa-trash-alt")){
        delete tareas[e.target.dataset.id];
        displayTareas();
    }

    

    e.stopPropagation();
}

formularioEdit.addEventListener("submit", e=> {
    e.preventDefault();
    var text = document.getElementById("inputEditDescripcion").value;
   
    var id = document.getElementById("inputEditDescripcion").dataset.id;
    tareas[id].texto = text;
    $("#modalEdit").modal("toggle");
    displayTareas();
})




