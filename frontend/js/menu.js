window.onload = () => {
  const tableNumber = localStorage.getItem("tableNumber");
  if (!tableNumber) {
    window.location.href = "index.html";
  }
};

const menuItems = [
  { name: "Burger", price: 120 },
  { name: "Pizza", price: 250 },
  { name: "Pasta", price: 180 },
  { name: "Fries", price: 100 },
  { name: "Coke", price: 60 }
];

let cart = [];

const tableNumber = localStorage.getItem("tableNumber");
const API_URL = "http://localhost:5000";

window.onload = () => {
  const tableNumber = localStorage.getItem("tableNumber");
  if (!tableNumber) {
    window.location.href = "index.html";
    return;
  }
  showMenu();
};

function showMenu() {
  const menuDiv = document.getElementById("menu");
  menuDiv.innerHTML = "";

  menuItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("menu-card");

    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <button onclick="addToCart(${index})">Add</button>
    `;

    menuDiv.appendChild(div);
  });
}

function addToCart(index) {
  const item = menuItems[index];
  const existing = cart.find(i => i.name === item.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById("cart");
  const totalSpan = document.getElementById("total");

  cartDiv.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    cartDiv.innerHTML += `
      ${item.name} x ${item.qty} = ₹${item.price * item.qty}<br>
    `;
  });

  totalSpan.innerText = total;
}
function confirmOrder() {
  if (cart.length === 0) {
    document.getElementById("message").innerText = "Cart is empty";
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  fetch(`${API_URL}/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tableNumber: Number(tableNumber),
      items: cart,
      total
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("message").innerText = data.message;
      cart = [];
      updateCart();
    })
    .catch(err => console.log(err));
}
function callWaiter() {
  document.getElementById("message").innerText =
    "👨‍🍳 Waiter has been called to your table";
}
function confirmPayment() {
  fetch(`${API_URL}/confirm-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tableNumber: Number(tableNumber)
    })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);

      // Clear browser memory
      localStorage.clear();

      // Redirect to main portal
      window.location.href = "index.html";
    })
    .catch(err => console.log(err));
}
function splitBill() {
  const total = Number(document.getElementById("total").innerText);

  if (total === 0) {
    alert("No amount to split");
    return;
  }

  const persons = prompt("How many people are splitting the bill?");

  if (!persons || persons <= 0) {
    alert("Invalid number of persons");
    return;
  }

  let sum = 0;

  for (let i = 1; i <= persons; i++) {
    const amount = prompt(`Enter amount paid by person ${i}`);

    if (!amount || isNaN(amount)) {
      alert("Invalid amount entered");
      return;
    }

    sum += Number(amount);
  }

  if (sum !== total) {
    alert(`Total mismatch! Entered: ₹${sum}, Actual: ₹${total}`);
    return;
  }

  // If correct, treat as payment success
  confirmPayment();
}
function combineTables() {
  const baseTable = Number(tableNumber);

  const input = prompt(
    "Enter table numbers to combine (comma separated, e.g. 3,4)"
  );

  if (!input) return;

  const combineTables = input
    .split(",")
    .map(n => Number(n.trim()))
    .filter(n => !isNaN(n));

  if (combineTables.length === 0) {
    alert("Invalid table numbers");
    return;
  }

  fetch(`${API_URL}/combine-tables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      baseTable,
      combineTables
    })
  })
    .then(res => res.json())
.then(data => {
  alert(data.message);

  if (!data.message.toLowerCase().includes("successful")) {
    return;
  }

  localStorage.clear();
  window.location.href = "index.html";
})
    .catch(err => console.log(err));
}
