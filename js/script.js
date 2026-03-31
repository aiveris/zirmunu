"use strict";
const addTodoA1 = document.querySelector(".add-todo-a1");
const addTodoFormA1 = document.querySelector(".add-todo-a1 .form");
const tableTodosA1 = document.querySelector(".table-a1");
const btnAdd = document.querySelector(".btn-add");
const plansA1 = document.querySelector(".buttonA1");
const titleA1 = document.querySelector("#titleA1");
let id;
let countA1 = 0;

// Mapping of names to player IDs for manual entry synchronization
const nameToIdMap = {
  "Domas Vilkelis": 2,
  "Evaldas Dzikevičius": 12,
  "Evaldas Stankevičius": 0,
  "Hubertas Degėsis": 3,
  "Jokūbas Ramanauskas": 4,
  "Karolis Rimša": 15,
  "Mindaugas Beleka": 7,
  "Maksim Karas": 8,
  "Mantas Šimėnas": 14,
  "Martynas Urbšas": 5,
  "Pijus Petrošius": 9,
  "Pavel Racevič": 13,
  "Tomas Ališauskas": 10,
  "Viktor Taujanski": 11
};

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
  if (playerId === undefined || playerId === null) return;
  const button = document.getElementById(String(playerId));
  if (button) {
    button.disabled = isDisabled;
  }
};

const setButtonDeclined = (playerId, isDeclined) => {
  if (playerId === undefined || playerId === null) return;
  const button = document.getElementById(String(playerId));
  if (button) {
    if (isDeclined) button.classList.add('btn-declined');
    else button.classList.remove('btn-declined');
  }
};

// Real time listener.
db.collection("a1").orderBy("todo").onSnapshot((snapshot) => {
  // Clear table and reset UI
  tableTodosA1.innerHTML = "";
  countA1 = 0;
  
  // Reset all buttons first
  document.querySelectorAll('.players button').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('btn-declined');
  });

  // Re-apply states from Firestore
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const status = data.status || 'attending';
    const name = data.todo;
    
    // Determine player ID: either from field or by matching name
    let playerId = data.playerId;
    if (playerId === undefined || playerId === null) {
      playerId = nameToIdMap[name];
    }

    if (status === 'attending') {
      renderTodoA1(doc);
      countA1++;
      if (playerId !== undefined && playerId !== null) {
        setButtonDisabled(playerId, true);
      }
    } else if (status === 'declined') {
      if (playerId !== undefined && playerId !== null) {
        setButtonDeclined(playerId, true);
      }
    }
  });

  document.getElementById("countA1").innerHTML = countA1;
});

// Manual entry form
addTodoFormA1.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = addTodoFormA1.todo.value.trim();
  const playerId = nameToIdMap[name];
  
  if (playerId !== undefined) {
    // If name matches a known player, use setPlayerStatus to ensure sync
    await setPlayerStatus(playerId, name, 'attending');
  } else {
    // Normal guest addition
    await db.collection("a1").add({
      todo: name,
      status: 'attending'
    });
  }
  addTodoFormA1.todo.value = "";
});

const deleteAllA1 = async () => {
  const snapshot = await db.collection("a1").get();
  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

if (titleA1) {
  titleA1.addEventListener("click", async () => {
    const result = confirm("Ištrinti visus įrašus?");
    if (!result) return;
    await deleteAllA1();
  });
}

// Fixed-ID strategy for players to prevent duplicates and simplify updates
const setPlayerStatus = async (playerId, name, status) => {
  const docId = "player_" + playerId;
  await db.collection("a1").doc(docId).set({
    todo: name,
    playerId: playerId,
    status: status
  });
};

// Show confirmation modal
function showPlayerModal(playerId, name) {
  const modal = document.getElementById('confirmModal');
  const nameEl = document.getElementById('confirmPlayerName');
  nameEl.textContent = name;
  modal.style.display = 'flex';

  const btnBusiu = document.getElementById('btnBusiu');
  const btnNebusiu = document.getElementById('btnNebusiu');

  // Clone to refresh listeners
  const newBusiu = btnBusiu.cloneNode(true);
  const newNebusiu = btnNebusiu.cloneNode(true);
  btnBusiu.parentNode.replaceChild(newBusiu, btnBusiu);
  btnNebusiu.parentNode.replaceChild(newNebusiu, btnNebusiu);

  newBusiu.addEventListener('click', async () => {
    await setPlayerStatus(playerId, name, 'attending');
    modal.style.display = 'none';
  });

  newNebusiu.addEventListener('click', async () => {
    await setPlayerStatus(playerId, name, 'declined');
    modal.style.display = 'none';
  });
}

// Close modal
document.getElementById('confirmModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.style.display = 'none';
  }
});

// Legacy functions
function add_player_0() { setPlayerStatus(0, "Evaldas Stankevičius", "attending"); }
function add_player_2() { setPlayerStatus(2, "Domas Vilkelis", "attending"); }
function add_player_3() { setPlayerStatus(3, "Hubertas Degėsis", "attending"); }
function add_player_4() { setPlayerStatus(4, "Jokūbas Ramanauskas", "attending"); }
function add_player_5() { setPlayerStatus(5, "Martynas Urbšas", "attending"); }
function add_player_7() { setPlayerStatus(7, "Mindaugas Beleka", "attending"); }
function add_player_8() { setPlayerStatus(8, "Maksim Karas", "attending"); }
function add_player_9() { setPlayerStatus(9, "Pijus Petrošius", "attending"); }
function add_player_10() { setPlayerStatus(10, "Tomas Ališauskas", "attending"); }
function add_player_11() { setPlayerStatus(11, "Viktor Taujanski", "attending"); }
function add_player_12() { setPlayerStatus(12, "Evaldas Dzikevičius", "attending"); }
function add_player_13() { setPlayerStatus(13, "Pavel Racevič", "attending"); }
function add_player_14() { setPlayerStatus(14, "Mantas Šimėnas", "attending"); }
function add_player_15() { setPlayerStatus(15, "Karolis Rimša", "attending"); }