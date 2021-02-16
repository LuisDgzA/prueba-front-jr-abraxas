const inputAddTask = document.getElementById("inputAddTask");
const btnAddTask = document.getElementById("btnAddTask");
const listaTareas = document.getElementById("listaTareas");
const template = document.getElementById("templateTasks").content;
const fragment = document.createDocumentFragment();

inputAddTask.addEventListener('focus' , function(){
    document.getElementById("divSelecOptionsTask").style.visibility = "visible"; 
})

inputAddTask.addEventListener('blur' , function(){
    document.getElementById("divSelecOptionsTask").style.visibility = "hidden"; 
})

var tareas = {
    1613435827964 : {
        id: 1613435827964,
        texto: 'Lorem akjhdkash ajhgsdjkas dhajs djkashd ashdj asdhjas dhjkashd ashdja shdjkasgdhasg dhasgdh',
        estado: false
    }
};


document.addEventListener("DOMContentLoaded", () => {
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
        estado: false
    }
    tareas[tarea.id] = tarea;
    inputAddTask.value = "";
    

    displayTareas();
}

const displayTareas = () =>{
    listaTareas.innerHTML = "";
    Object.values(tareas).forEach(tarea =>{
        const clone = template.cloneNode(true);
        clone.querySelector("p").textContent = tarea.texto;
        clone.querySelectorAll(".readId")[0].dataset.id = tarea.id;
        clone.querySelectorAll(".readId")[1].dataset.id = tarea.id;
        clone.querySelectorAll(".readId")[2].dataset.id = tarea.id;
        clone.querySelectorAll(".readId")[3].dataset.id = tarea.id;
        fragment.appendChild(clone);
    })
    listaTareas.appendChild(fragment);
}

const btnAccion = e =>{
    if(e.target.classList.contains("fa-circle")){
        alert(e.target.dataset.id)
    }
    e.stopPropagation();
}




