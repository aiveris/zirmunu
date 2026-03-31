"use strict";
const addTodoA1 = document.querySelector(".add-todo-a1");
const addTodoFormA1 = document.querySelector(".add-todo-a1 .form");
const tableTodosA1 = document.querySelector(".table-a1");
const btnAdd = document.querySelector(".btn-add");
const plansA1 = document.querySelector(".buttonA1");
const titleA1 = document.querySelector("#titleA1");
let id;
let countA1 = 0;

// Persistence of "Nebūsiu" (declined) is now handled in Firestore.

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
db.collection("a1").orderBy("todo").onSnapshot((snapshot) => {
  // Clear table and reset
  tableTodosA1.innerHTML = "";
  countA1 = 0;
  
  // Reset all buttons
  document.querySelectorAll('.players button').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('btn-declined');
  });

  // Re-render all docs based on status
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const playerId = data.playerId;
    const status = data.status || 'attending';

    if (status === 'attending') {
      renderTodoA1(doc);
      countA1++;
      if (playerId !== undefined && playerId !== null) {
        setButtonDisabled(playerId, true);
      }
    } else if (status === 'declined') {
      if (playerId !== undefined && playerId !== null) {
        const btn = document.getElementById(String(playerId));
        if (btn) {
          btn.classList.add('btn-declined');
        }
      }
    }
  });

  document.getElementById("countA1").innerHTML = countA1;
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

    // Clear Firestore collection (which includes both attending and declined)
    await deleteAllA1();
  });
}

const setPlayerStatus = async (playerId, name, status) => {
  // Find if player already has a record (to update instead of duplicate)
  const snapshot = await db.collection("a1").where("playerId", "==", playerId).get();
  
  if (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: status, todo: name });
    });
    await batch.commit();
  } else {
    await db.collection("a1").add({
      todo: name,
      playerId: playerId,
      status: status
    });
  }
};

// Show confirmation modal with Būsiu / Nebūsiu options
function showPlayerModal(playerId, name) {
  const modal = document.getElementById('confirmModal');
  const nameEl = document.getElementById('confirmPlayerName');
  nameEl.textContent = name;
  modal.style.display = 'flex';

  const btnBusiu = document.getElementById('btnBusiu');
  const btnNebusiu = document.getElementById('btnNebusiu');

  // Clone buttons to remove previous event listeners
  const newBusiu = btnBusiu.cloneNode(true);
  const newNebusiu = btnNebusiu.cloneNode(true);
  btnBusiu.parentNode.replaceChild(newBusiu, btnBusiu);
  btnNebusiu.parentNode.replaceChild(newNebusiu, btnNebusiu);

  newBusiu.addEventListener('click', () => {
    setPlayerStatus(playerId, name, 'attending');
    modal.style.display = 'none';
  });

  newNebusiu.addEventListener('click', () => {
    setPlayerStatus(playerId, name, 'declined');
    modal.style.display = 'none';
  });
}

// Close modal when clicking outside
document.getElementById('confirmModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.style.display = 'none';
  }
});

function add_player_0() {
  setPlayerStatus(0, "Evaldas Stankevičius", "attending");
}
function add_player_2() {
  setPlayerStatus(2, "Domas Vilkelis", "attending");
}
function add_player_3() {
  setPlayerStatus(3, "Hubertas Degėsis", "attending");
}
function add_player_4() {
  setPlayerStatus(4, "Jokūbas Ramanauskas", "attending");
}
function add_player_5() {
  setPlayerStatus(5, "Martynas Urbšas", "attending");
}
function add_player_7() {
  setPlayerStatus(7, "Mindaugas Beleka", "attending");
}
function add_player_8() {
  setPlayerStatus(8, "Maksim Karas", "attending");
}
function add_player_9() {
  setPlayerStatus(9, "Pijus Petrošius", "attending");
}
function add_player_10() {
  setPlayerStatus(10, "Tomas Ališauskas", "attending");
}
function add_player_11() {
  setPlayerStatus(11, "Viktor Taujanski", "attending");
}
function add_player_12() {
  setPlayerStatus(12, "Evaldas Dzikevičius", "attending");
}
function add_player_13() {
  setPlayerStatus(13, "Pavel Racevič", "attending");
}
function add_player_14() {
  setPlayerStatus(14, "Mantas Šimėnas", "attending");
}
function add_player_15() {
  setPlayerStatus(15, "Karolis Rimša", "attending");
}
function add_player_19() {
  setPlayerStatus(19, "", "attending");
}
function add_player_23() {
  setPlayerStatus(23, "", "attending");
}
function add_player_24() {
  setPlayerStatus(24, "", "attending");
}
function add_player_27() {
  setPlayerStatus(27, "", "attending");
}
function add_player_30() {
  setPlayerStatus(30, "", "attending");
}
function add_player_33() {
  setPlayerStatus(33, "", "attending");
}
function add_player_42() {
  setPlayerStatus(42, "", "attending");
}
function add_player_55() {
  setPlayerStatus(55, "", "attending");
}
function add_player_69() {
  setPlayerStatus(69, "", "attending");
}
function add_player_77() {
  setPlayerStatus(77, "", "attending");
}
function add_player_82() {
  setPlayerStatus(82, "Dainius Stoškus 82", "attending");
}
function add_player_91() {
  setPlayerStatus(91, "Jonas Savickas 91", "attending");
}
function add_player_92() {
  setPlayerStatus(92, "Augustinas Stoškus 92", "attending");
}
function add_player_99() {
  setPlayerStatus(99, "Tomas Žiburkus 99", "attending");
}