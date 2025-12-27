# 🍽️ SmartDine – Restaurant Self-Ordering Web Application

SmartDine is a full-stack web application that allows customers to book restaurant tables, order food without waiting for a waiter, and manage payments logically.  
The system is designed to improve customer experience and reduce manual workload in restaurants.

This project is built as a **learning + portfolio project** using modern web technologies.

---

## 🚀 Features

### 🪑 Table Management
- View all restaurant tables with real-time status:
  - 🟢 FREE
  - 🔴 OCCUPIED
- Book a table using **Table Number + Password**
- Table password is **auto-generated** and **reset after payment**

---

### 📱 Customer Management
- Customers must enter a **phone number** after booking a table
- Customer details are stored in the database for tracking

---

### 📋 Menu & Ordering
- Digital menu with food items
- Add items to cart
- View live cart and total amount
- Confirm order → sent to kitchen (stored in database)

---

### 🔔 Call Waiter
- Call waiter manually with a single click
- Displays a confirmation message

---

### 💰 Payment Features (Logical – No Real Payment Gateway)
- **Confirm Payment**
  - Marks orders as PAID
  - Resets table status to FREE
  - Generates a new table password
- **Split Bill**
  - Split total among multiple people
  - Validates entered amounts before payment
- **Combine Tables**
  - Combine multiple tables into one bill
  - Calculates combined total
  - Marks all involved tables as FREE after payment

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose ODM

---

## 📂 Project Structure
SmartDine/
│

├── backend/

│ ├── server.js

│ ├── package.json

│ ├── .env

│ ├── models/

│ ├── routes/

│

├── frontend/

│ ├── index.html

│ ├── menu.html

│ ├── phone.html

│ ├── css/

│ │ └── style.css

│ ├── js/

│ │ ├── main.js

│ │ ├── menu.js

│ │ └── phone.js

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/SmartDine.git
cd SmartDine
```
---
### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a .env file inside backend/:
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```
Run backend server:
```bash
npm run dev
```
---
### 3️⃣ Frontend Setup
Open frontend/index.html directly in the browser
(or use Live Server in VS Code)
---
🧪 How the Application Works

1. User opens Main Portal

2. Views table availability

3. Books table using table number & password

4. Enters phone number

5. Orders food from menu

6. Confirms order → sent to kitchen

7. Uses: Call Waiter, Split Bill, Combine Tables

8. Confirms payment

9. Table resets and becomes available again
---
🎯 Future Improvements

- Kitchen dashboard for chefs

- Admin panel

- Authentication & roles

- Real payment gateway integration

- Responsive mobile UI

- Deployment (Netlify + Render)
---
👨‍🎓 Author

Naveen Raj R
College Student | Full-Stack Learner

This project was built for learning, practice, and portfolio purposes.
---
