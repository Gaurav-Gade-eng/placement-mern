#  Placement Portal (MERN Stack)

A full-stack Placement Management System built using the MERN stack (MongoDB, Express, React, Node.js). It helps students, TPO, and faculty manage placement activities efficiently in a centralized platform.

---

##  Live Demo

Frontend:  
https://placement-hub.duckdns.org  

Backend API:  
https://placement-backend1-on3n.onrender.com  

---

##  Features

-  Student profile creation & resume upload  
-  Company listings and job applications  
-  TPO dashboard to manage students & placement status  
-  Announcements system  
-  Email notifications (OTP & application updates)  
-  JWT-based authentication  
-  AI chatbot for answering queries  

---

## 🛠️ Tech Stack

- **Frontend:** React, Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT  
- **Email Service:** Nodemailer  
- **Deployment:** Render  

---

## ⚙️ Installation & Setup

###  Clone the repository

```bash
git clone https://github.com/your-username/placement-portal.git
cd placement-portal
## Setup Backend
cd backend
npm install

Create a .env file:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

Run backend:

node server.js
## Setup Frontend
cd frontend
npm install
npm start
## Build for Production
npm run build
## Environment Variables
Variable	Description
MONGO_URI=MongoDB connection string
JWT_SECRET=Secret key for authentication
EMAIL	Gmail ID for sending emails
EMAIL_PASSWORD=Gmail App Password
## Project Objective

To provide a centralized digital platform for managing placement processes, improving transparency, and helping students prepare and apply for job opportunities efficiently.

##Author

Gaurav Gade

##Acknowledgements
React Documentation
Node.js Documentation
MongoDB Atlas
