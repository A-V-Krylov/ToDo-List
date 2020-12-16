// Переменные 
const addButton = document.querySelector('.add-button');
const input = document.querySelector('.input');
const formContainer = document.querySelector('.form-container');
const listNotes = document.querySelector('.list-notes');
const allButton = document.querySelector('.all-button');
const activeButton = document.querySelector('.active-button');
const completedButton = document.querySelector('.completed-button');
const clearComplered = document.querySelector('.clear-complered');
const accountActive = document.querySelector('.account-active');
const buttonContainer = document.querySelector('.button-container');
let activeNotes = document.querySelector('.active-notes');
let todoList = [];

// Функции
function shadowForm() {
    if (Object.keys(todoList).length == 0)
        formContainer.classList.remove('shadow');
    else formContainer.classList.add('shadow');
}

function buttonGroup() {
    if (Object.keys(todoList).length == 0)
        buttonContainer.classList.add('none');
    else buttonContainer.classList.remove('none');
}

function renderNotes(arr) {
    let template = '';
    let x = 0;
    for (let key in arr) {
        template +=
            `<div id="${arr[key].id}" class="notes-container">
        <input  type="checkbox" ${arr[key].check == true ? 'checked' : ''} class="check">
        <div class="notes-text">${arr[key].text}<label></label></div>
        <button class='button delete-button'>x</button>
    </div>`;
        x++;
    }
    listNotes.innerHTML = template;
};

function deleteCard(event) {
    if (event.target.classList[1] == 'delete-button') {
        event.preventDefault();
        event.target.parentNode.remove();
        todoList = todoList.filter(function (el) {
            return el.id != event.target.parentNode.id;
        });
        localStorage.setItem('todo', JSON.stringify(todoList));
    }
    buttonGroup();
    numberActiveNotes();
    shadowForm();
};

function deleteAllCard(event) {
    event.preventDefault();
    localStorage.removeItem('todo');
    document.querySelectorAll('.notes-container').forEach(el => {
        el.remove();
    })
    todoList = [];
    buttonGroup();
    if (Object.keys(todoList).length != 0) numberActiveNotes();
    shadowForm();
}

function crossOut(event) {
    if (event.target.classList == 'check') {
        todoList.find(el => el.id == event.target.parentNode.id).check = event.target.checked;
        localStorage.setItem('todo', JSON.stringify(todoList));

        if (listNotes.classList[1] == 'active-notes') {
            renderNotes(filterArr(false));
        }
        else if (listNotes.classList[1] == 'completed-notes') {
            renderNotes(filterArr(true));
        }
        numberActiveNotes();
    };
}

function addClass(event, cl) {
    if (listNotes.classList[1] != cl) {
        listNotes.classList.remove(listNotes.classList[1]);
        listNotes.classList.add(cl);
        document.querySelector('.current').classList.remove('current');
        event.target.classList.add('current');
    }
}

function filterArr(bool) {
    todoList = JSON.parse(localStorage.getItem('todo'));
    let arr = todoList.filter(function (el) {
        return el.check == bool;
    });
    return arr;
}

function numberActiveNotes() {
    accountActive.textContent = `${filterArr(false).length} items left`
}

// Вызов функции 
if (localStorage.getItem('todo') != undefined) {
    todoList = JSON.parse(localStorage.getItem('todo'));
    renderNotes(todoList);
}
buttonGroup()
if (Object.keys(todoList).length != 0) numberActiveNotes();
shadowForm();

//Обработчики событий 
listNotes.addEventListener('click', (event) => {
    deleteCard(event);
    crossOut(event);
});

addButton.addEventListener('click', function (event) {
    event.preventDefault();
    let allNotes = {};
    allNotes.text = input.value;
    allNotes.check = false;
    allNotes.id = Math.ceil(Math.random() * 10000);
    let i = todoList.length;
    todoList[i] = allNotes;
    localStorage.setItem('todo', JSON.stringify(todoList));
    if (listNotes.classList[1] == 'all-notes') renderNotes(todoList);
    else if (listNotes.classList[1] == 'active-notes') renderNotes(filterArr(false));
    input.value = '';
    numberActiveNotes();
    buttonGroup();
    shadowForm();
});

allButton.addEventListener('click', function (event) {
    event.preventDefault();
    addClass(event, 'all-notes');
    todoList = JSON.parse(localStorage.getItem('todo'));
    renderNotes(todoList);
    numberActiveNotes();
});

activeButton.addEventListener('click', function (event) {
    event.preventDefault();
    addClass(event, 'active-notes');
    renderNotes(filterArr(false));
    numberActiveNotes();
});

completedButton.addEventListener('click', function (event) {
    event.preventDefault();
    addClass(event, 'completed-notes');
    renderNotes(filterArr(true));
    numberActiveNotes();
});

clearComplered.addEventListener('click', deleteAllCard);