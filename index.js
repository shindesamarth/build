"use strict";
const state = {
  tasklist: [],
};
const taskContents = document.querySelector(".task_contents");
const taskmodal = document.querySelector(".task_modal_body");

const htmlcontent = ({ id, title, description, type, url }) => `
<div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
   <div class="card shadow-sm task_card">
       <div class="card-header d-flex justify-content-end task_card_header">
          <button type="button" class="btn btn-outline-info mr-1.5" name=${id} onclick="editTask()" id=${id}>
            <i class="fas fa-pencil-alt" name=${id} onclick="editTask()" id=${id}></i>
          </button>
          <button type="button" class="btn btn-outline-danger " name=${id} onclick="deletetask()">
            <i class="fas fa-trash-alt" name=${id} onclick="deletetask()" id=${id}></i>
          </button>
       </div>
       <div class="card-body">
           ${
             url
               ? `<img width='100%' src='${url}' alt='cardimage' class='card-img-top md-3 rounded-lg'/>`
               : `<img width='100%' src='https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg' alt='cardimage' class='card-img-top md-3 rounded-lg'/>`
           }
           <h4 class='card-title task_card_title'>${title}</h4>
           <p class='description trim-3-lines text-muted'>${description}</p>
           <div class='tags text-white d-flex flex-wrap'>
             <span class='badge text-bg-primary m-1'>${type}</span>
           </div>
           
       </div>
       <div class='card-footer'>
           <button type='button' class='btn btn-outline-primary float-right open' data-bs-toggle="modal" data-bs-target="#showtask" onclick="opentask()" id=${id}>Open Task</button>
       </div>
   </div>
</div>


`;

//model body on clicking open task
const modalbody = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
  <div id=${id}>
  ${
    url &&
    `<img width='100%' src='${url}' alt='cardimage' class='img-fluid place_holder_image mb-3'/>`
  }
  <strong class="text-muted text-sm">Created on: ${date.toDateString()}</strong>
  <h2 class="mb-3">${title}</h2>
  <p class="text-muted">${description}</p>
  </div>
  `;
};
// save our items in local storage of browser
// tasky is name of storage  tasks is key
const updatelocalstorage = function () {
  localStorage.setItem("task", JSON.stringify({ tasks: state.tasklist }));
};
// load cards data when we start browser from mlocal storqage
// converting back into object or json format using json .parse
const loadinitialdata = function () {
  const localStoragecopy = JSON.parse(localStorage.task);
  if (localStoragecopy) {
    state.tasklist = localStoragecopy.tasks;
  }
  state.tasklist.map((carddate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlcontent(carddate));
  });
};
// when we edit a task we need to save
const handlesubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageurl").value,
    title: document.getElementById("tasktitle").value,
    type: document.getElementById("tags").value,
    description: document.getElementById("textdescribe").value,
  };
  if (input.description == "" || input.title == "" || input.type == "") {
    return alert("Input all necesssary fields !!!");
  }
  taskContents.insertAdjacentHTML("beforeend", htmlcontent({ ...input, id }));
  state.tasklist.push({ ...input, id });
  updatelocalstorage();
};

//open task
const opentask = (e) => {
  if (!e) {
    e = window.event;
  }
  const gettask = state.tasklist.find(({ id }) => {
    if (id === e.target.id) {
      return id;
    }
  });
  const id = e.target.id;
  const diving = modalbody({ id, ...gettask });
  const place = document.querySelector(".task_modal_body");
  place.innerHTML = diving;
};
//open edit
const editTask = (e) => {
  if (!e) {
    e = window.event;
  }

  const targetid = e.target.id;
  const type = e.target.tagName;
  //console.log(type,targetid);
  let parentNode;
  let taskTitle;
  let tasktype;
  let taskdescription;
  let submitbutton;
  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  //taskTitle = parentNode.childNodes[3];
  //console.log(taskTitle);
  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskdescription = parentNode.childNodes[3].childNodes[5];
  tasktype = parentNode.childNodes[3].childNodes[7].childNodes[1];
  // console.log(taskTitle,taskdescription,tasktype);
  submitbutton = parentNode.childNodes[5].childNodes[1];
  //console.log(submitbutton);
  taskTitle.setAttribute("contenteditable", "true");
  taskdescription.setAttribute("contenteditable", "true");
  tasktype.setAttribute("contenteditable", "true");
  submitbutton.removeAttribute("data-bs-toggle");
  submitbutton.removeAttribute("data-bs-target");

  submitbutton.innerHTML = "Save Changes";
  submitbutton.setAttribute("onclick", "saveedit()");
};

// delete task

const deletetask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.getAttribute("name");
  // console.log(targetId);
  const type = e.target.tagName;
  // console.log(type);
  const removetask = state.tasklist.filter(({ id }) => id !== targetId);
  // console.log(removeTask);
  updatelocalstorage();

  if (type === "BUTTON") {
    console.log(e.target.parentNode.parentNode.parentNode.parentNode);
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  } else if (type === "I") {
    console.log(e.target.parentNode.parentNode.parentNode.parentNode);
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

// save edit
const saveedit = (e) => {
  if (!e) {
    e = window.event;
  }
  let taskTitle;
  let tasktype;
  let taskdescription;
  let submitbutton;
  let parentNode;

  parentNode = e.target.parentNode.parentNode;
  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskdescription = parentNode.childNodes[3].childNodes[5];
  tasktype = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitbutton = parentNode.childNodes[5].childNodes[1];
  // submitbutton.removeAttribute("data-bs-model");
  // submitbutton.removeAttribute("show-tasks");
  const targetid = e.target.id;
  const object = state.tasklist.find(function ({ id }) {
    if (id == targetid) {
      return id;
    }
  });
  console.log(object);
  object.title = taskTitle.innerHTML;
  object.description = taskdescription.innerHTML;
  object.type = tasktype.innerHTML;
  submitbutton.setAttribute("data-bs-toggle", "modal");
  submitbutton.setAttribute("data-bs-target", "#showtask");
  submitbutton.setAttribute("onclick", "opentask()");
  taskTitle.setAttribute("contenteditable", "false");
  taskdescription.setAttribute("contenteditable", "false");
  tasktype.setAttribute("contenteditable", "false");
  //submitbutton.setAttribute("onclick","")
  submitbutton.innerHTML = "Open Tasks";
  updatelocalstorage();

  console.log(targetid);
};
const search = (e) => {
  if (!e) {
    e = window.event;
  }
  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }
  const resultdata = state.tasklist.filter(({title})=>{
    if(title.toLowerCase().includes(e.target.value.toLowerCase())){
      return title;
    }
  });
  resultdata.map(
    (cardData) =>
      taskContents.insertAdjacentHTML("beforeend", htmlcontent(cardData))
    // taskContents.insertAdjacentHTML("beforeend", htmlModalContent(cardData))
  );
  console.log(resultdata);
};
