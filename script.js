
const theme = document.getElementById('theme');

theme.addEventListener('click', () => {
  document.querySelector('body').classList = [theme.checked ? 'theme-light' : 'theme-dark'];
});

function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("todo-input");

  db.collection("todo-item").add({
    text: text.value,
    status: "active"
  })
  text.value = "";
}

function getItems() {
  db.collection("todo-item").onSnapshot((snapshot) => {
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      });

    })
    generateItem(items);
  })
}

function generateItem(items) {

  let itemHTML = "";

  items.forEach((item) => {
    itemHTML += `
        <div class="todo-item">
          <div class="check">
            <div data-id = "${item.id}" class="check-mark ${item.status == "completed" ? "checked" : ""}">
              <img src="./images/icon-check.svg" alt="">
            </div>
          </div>
          <div class="todo-text ${item.status == "completed" ? "checked" : ""}">
            ${item.text}
          </div>
        </div>`

  })
  document.querySelector(".todo-items").innerHTML = itemHTML;
  createEventListeners();
}

function createEventListeners() {
  let todocheckmark = document.querySelectorAll(".todo-item .check-mark")
  todocheckmark.forEach((checkMark) => {
    checkMark.addEventListener("click", () => {
      markCompleted(checkMark.dataset.id)
    });
  })
}

function markCompleted(id) {
  //from a database
  let item = db.collection("todo-item").doc(id);

  item.get().then((doc) => {
    if (doc.exists) {
      let status = doc.data().status;
      if (status == "active") {
        item.update({
          status: "completed"
        })
      } else if (status == "completed") {
        item.update({
          status: "active"
        })
      }
    }
  })
}

getItems();

 