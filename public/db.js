let db;

//create indexed db
const request = indexedDB.open('budget',1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
}

request.onsuccess = function(event){

}

request.onerror = function(event){

}

function saveRecord(record){

}

function checkForPending() {

}

window.addEventListener("online", checkDatabase);