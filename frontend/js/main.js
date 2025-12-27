const API_URL = "https://smartdine-backend.onrender.com";

// Load tables when page opens
window.onload = fetchTables;

function fetchTables() {
  fetch(`${API_URL}/tables`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("tables-container");
      container.innerHTML = "";

      data.forEach(table => {
        const div = document.createElement("div");
        div.classList.add("table-card");
        div.classList.add(table.status === "FREE" ? "free" : "occupied");

        div.innerHTML = `
          Table ${table.tableNumber}<br>
          ${table.status}
        `;

        container.appendChild(div);
      });
    })
    .catch(err => console.log(err));
}

function bookTable() {
  const tableNumber = document.getElementById("tableNumber").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/book-table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tableNumber: Number(tableNumber),
      password
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("message").innerText = data.message;

if (data.message === "Table booked successfully") {
  localStorage.setItem("tableNumber", tableNumber);
  window.location.href = "phone.html";
}

    })
    .catch(err => console.log(err));
}



