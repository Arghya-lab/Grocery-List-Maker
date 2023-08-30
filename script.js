/* select items  */
const itemInput = document.querySelector(".item-input");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

const alert = document.querySelector(".alert");
const form = document.querySelector(".form");
const itemContainer = document.querySelector(".item-container");
const itemList = document.querySelector(".item-list");
/*  edit options  */
let editElement;
let editFlag = false;
let editId = "";

/*  event listners  */

/* submit item  */
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems());

/* functions */

//  additems
function addItem(e) {
  e.preventDefault();
  const value = itemInput.value;
  const id = new Date().getTime().toString();

  //for add new item
  if (value && !editFlag) {
    creatsListItems(id, value);
    //show container
    itemContainer.classList.add("show-container");

    //add to local storage
    addToLocalStorage(id, value);

    //backto default
    setBackToDefault();
    //display alert
    displayAlert("item added to list", "success");
  }
  //edit existing item
  else if (value && editFlag) {
    editElement.innerHTML = value;
    setBackToDefault();
    editLocalStorage(editId, value);
    displayAlert("value changed", "success");
  }
  // for empty value entry
  else {
    displayAlert("plz enter a value", "danger");
  }
}

/*  edit item  */
function editItem(e) {
  editElement = e.currentTarget.parentElement.previousElementSibling;
  itemInput.value = editElement.innerHTML;
  submitBtn.textContent = "edit";

  const elem = e.currentTarget.parentElement.parentElement;
  editId = elem.dataset.id;
  editFlag = true;
}

//  delete item
function deleteItem(e) {
  const elem = e.currentTarget.parentElement.parentElement;
  itemList.removeChild(elem);

  if (itemList.children.length === 0) {
    //remove container
    itemContainer.classList.remove("show-container");
  }
  setBackToDefault();
  deleteItemInLocalStorage(elem.dataset.id);
  displayAlert("item deleted", "danger");
}

//back to default
function setBackToDefault() {
  itemInput.value = "";
  submitBtn.textContent = "submit";
  editFlag = false;
}

//display alert
function displayAlert(msg, action) {
  alert.textContent = msg;
  alert.classList.add(`alert-${action}`);

  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//clear items
function clearItems() {
  const items = document.querySelectorAll(".item");
  items.forEach(function (item) {
    itemList.removeChild(item);
  });
  itemContainer.classList.remove("show-container");
  setBackToDefault();
  localStorage.removeItem("list");
  displayAlert("all items cleared", "danger");
}

//  local storage //

//getlocal storage
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//add to local storage
function addToLocalStorage(id, value) {
  const item = {
    id: id,
    value: value,
  };
  const items = getLocalStorage();
  items.push(item);
  localStorage.setItem("list", JSON.stringify(items));
}

//edit value in local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

//delete item in localstorage
function deleteItemInLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// load local storage on relode
function setupItems() {
  items = getLocalStorage();
  items.forEach(function (item) {
    creatsListItems(item.id, item.value);
  });
  //show container
  itemContainer.classList.add("show-container");
}

//genererte listitem
function creatsListItems(id, value) {
  const elem = document.createElement("article");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  elem.setAttributeNode(attr);
  elem.classList.add("item");
  elem.innerHTML = `
    <p class="item-name">${value}</p>
      <div class="btn-container">
        <button class="edit">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="delete">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  //add eventlistner to both button
  const editBtn = elem.querySelector(".edit");
  editBtn.addEventListener("click", editItem);
  const deleteBtn = elem.querySelector(".delete");
  deleteBtn.addEventListener("click", deleteItem);

  //append child
  itemList.appendChild(elem);
}
