const API_URL = "https://smartdine-backend-59y6.onrender.com";

function submitPhone() {
  const phone = document.getElementById("phone").value;
  const tableNumber = localStorage.getItem("tableNumber");

  if (!phone) {
    document.getElementById("message").innerText = "Phone number required";
    return;
  }

  fetch(`${API_URL}/create-customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone,
      tableNumber: Number(tableNumber)
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("message").innerText = data.message;

      if (data.message === "Customer created") {
        window.location.href = "menu.html";
      }
    })
    .catch(err => console.log(err));
}


