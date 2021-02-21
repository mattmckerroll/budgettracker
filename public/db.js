let db;

//create indexed db
const request = indexedDB.open('budget',1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
}

request.onsuccess = function(event){
    db = event.target.result;
    if (navigator.onLine){
        checkForPending()
    }
}

request.onerror = function(event){
    console.log("There was an error:" + event.target.errorCode);
}

function saveRecord(record){
    const transaction = db.transaction(["pending"], "readwrite");

    // access your pending object store
    const store = transaction.objectStore("pending");
  
    // add record to your store with add method.
    store.add(record);
}

function checkForPending() {

    const transaction = db.transaction(["pending"], "readwrite");
    const storage = transaction.objectStore('pending');
    const getAll = storage.getAll();

    getAll.onsuccess = function(){
        if (getAll.result.length>0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                }
              })
              .then(response => response.json())
              .then(()=>{
                const transaction = db.transaction(["pending"], "readwrite");

                const storage = transaction.objectStore("pending");

                storage.clear();
              })
        }
    }

}

window.addEventListener("online", checkForPending);