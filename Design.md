# Food Ordering System

## Design Document

---

## 1. Project Overview

The Food Ordering System is a web-based application that enables users to browse food items, add them to a cart, and place orders online. It also provides an admin interface to manage food items and orders.

---

## 2. System Architecture

The application follows a three-tier architecture separating presentation, business logic, and data layers.

**Flow:**
User → React → Spring Boot → H2 Database

---

## 3. Modules

### 1. User Module

* Registration
* Login
* Browse items
* Place orders

### 2. Cart Module

* Add items
* Remove items
* Update quantities

### 3. Order Module

* Place orders
* View order history

### 4. Admin Module

* Manage food items
* Manage orders

---

## 4. API Design

* `POST /register` – Register user
* `POST /login` – User login
* `GET /foods` – Fetch food items
* `POST /foods` – Add food (Admin)
* `PUT /foods/{id}` – Update food
* `DELETE /foods/{id}` – Delete food
* `POST /cart` – Add to cart
* `GET /cart` – View cart
* `POST /orders` – Place order
* `GET /orders` – View orders

---

## 5. Database Design (H2)

| Table    | Fields                            |
| -------- | --------------------------------- |
| Users    | id, name, email, password         |
| Products | id, name, price                   |
| Cart     | id, user_id, product_id, quantity |
| Orders   | id, user_id, total_price          |

---

## 6. Technologies Used

* **Frontend:** React
* **Backend:** Spring Boot
* **Database:** H2
* **Build Tool:** Maven

---

## 7. Conclusion

This system provides a simple and efficient way to order food online with a clean architecture.
