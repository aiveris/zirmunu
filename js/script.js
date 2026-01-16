"use strict";
const addTodoA1 = document.querySelector(".add-todo-a1");
const addTodoFormA1 = document.querySelector(".add-todo-a1 .form");
const tableTodosA1 = document.querySelector(".table-a1");
const btnAdd = document.querySelector(".btn-add");
const plansA1 = document.querySelector(".buttonA1");
const titleA1 = document.querySelector("#titleA1");
let id;
let countA1 = 0;

// Create element and render to-do a1 ----------------------------------
const renderTodoA1 = (doc) => {
  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().todo}</td>
      <th>
      <button class="btn btn-delete">✘</button>
      </th>
    </tr>
  `;

  tableTodosA1.insertAdjacentHTML("beforeend", tr);

  // Click delete to-do
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener("click", () => {
    var result = confirm("Want to delete?");
    if (result) {
      db.collection("a1").doc(`${doc.id}`).delete();
    }
  });
};
const setButtonDisabled = (playerId, isDisabled) => {
  if (playerId === undefined || playerId === null) {
    return;
  }

  const button = document.getElementById(String(playerId));
  if (button) {
    button.disabled = isDisabled;
  }
};
// // Real time listener.
db.collection("a1").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      renderTodoA1(change.doc);
      countA1++;
      document.getElementById("countA1").innerHTML = countA1;
      const playerId = change.doc.data().playerId;
      setButtonDisabled(playerId, true);
    }
    if (change.type === "removed") {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableTodosA1.removeChild(tbody);
      countA1--;
      document.getElementById("countA1").innerHTML = countA1;
      const playerId = change.doc.data().playerId;
      setButtonDisabled(playerId, false);
    }
  });
});
addTodoFormA1.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("a1").add({
    todo: addTodoFormA1.todo.value,
  });
  addTodoFormA1.todo.value = "";
});

const deleteAllA1 = async () => {
  const snapshot = await db.collection("a1").get();
  if (snapshot.empty) {
    return;
  }

  const batchSize = 500;
  let batch = db.batch();
  let operationCount = 0;

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    operationCount++;
    if (operationCount % batchSize === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (operationCount % batchSize !== 0) {
    await batch.commit();
  }
};

if (titleA1) {
  titleA1.addEventListener("click", async () => {
    const result = confirm("Ištrinti visus įrašus?");
    if (!result) {
      return;
    }

    await deleteAllA1();
  });
}

const addPlayerA1 = async (playerId, name) => {
  await db.collection("a1").add({
    todo: name,
    playerId: playerId,
  });
  setButtonDisabled(playerId, true);
};

function add_player_0() {
  addPlayerA1(0, "Evaldas Stankevičius");
}
function add_player_2() {
  addPlayerA1(2, "Domas Vilkelis");
}
function add_player_3() {
  addPlayerA1(3, "Hubertas Degėsis");
}
function add_player_4() {
  addPlayerA1(4, "Jokūbas Ramanauskas");
}
function add_player_5() {
  addPlayerA1(5, "Martynas Urbšas");
}
function add_player_7() {
  addPlayerA1(7, "Mindaugas Beleka");
}
function add_player_8() {
  addPlayerA1(8, "Maksim Karas");
}
function add_player_9() {
  addPlayerA1(9, "Pijus Petrošius");
}
function add_player_10() {
  addPlayerA1(10, "Tomas Ališauskas");
}
function add_player_11() {
  addPlayerA1(11, "Viktor Taujanski");
}
function add_player_12() {
  addPlayerA1(12, "Evaldas Dzikevičius");
}
function add_player_13() {
  addPlayerA1(13, "Pavel Racevič");
}
function add_player_14() {
  addPlayerA1(14, "Mantas Šimėnas");
}
function add_player_15() {
  addPlayerA1(15, "Karolis Rimša");
}
function add_player_19() {
  addPlayerA1(19, "");
}
function add_player_23() {
  addPlayerA1(23, "");
}
function add_player_24() {
  addPlayerA1(24, "");
}
function add_player_27() {
  addPlayerA1(27, "");
}
function add_player_30() {
  addPlayerA1(30, "");
}
function add_player_33() {
  addPlayerA1(33, "");
}
function add_player_42() {
  addPlayerA1(42, "");
}
function add_player_55() {
  addPlayerA1(55, "");
}
function add_player_69() {
  addPlayerA1(69, "");
}
function add_player_77() {
  addPlayerA1(77, "");
}
function add_player_82() {
  addPlayerA1(82, "Dainius Stoškus 82");
}
function add_player_91() {
  addPlayerA1(91, "Jonas Savickas 91");
}
function add_player_92() {
  addPlayerA1(92, "Augustinas Stoškus 92");
}
function add_player_99() {
  addPlayerA1(99, "Tomas Žiburkus 99");
}