# Online Food Order System (React + Spring Boot + MySQL)

This project is a Swiggy/Zomato-style starter with:
- JWT authentication and authorization
- Login/Register page
- Interactive dashboard with restaurant images
- Food item listing with prices
- Add to cart
- Checkout with delivery address + payment method
- Review submission
- MySQL database integration

## Tech Stack
- Frontend: React + Vite + React Router + Axios
- Backend: Spring Boot, Spring Security, JWT, Spring Data JPA
- Database: MySQL

## Backend Setup
1. Open `backend/src/main/resources/application.properties`.
2. Update:
   - `spring.datasource.username`
   - `spring.datasource.password`
3. Start backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

Backend runs on `http://localhost:8080`.

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Docker Setup
Run both services with Docker Compose from the project root:
```bash
docker compose up --build
```

Then open:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8081`

If you want to run just one service:
```bash
docker build -t food-order-backend ./backend
docker build -t food-order-frontend ./frontend
```

If you are inside the `backend` folder, build the backend image with:
```bash
docker build -t food-order-backend .
```

Then run them separately:
```bash
docker run -p 8081:8081 food-order-backend
docker run -p 5173:80 food-order-frontend
```
## Core API Endpoints
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Restaurants:
  - `GET /api/restaurants`
  - `GET /api/restaurants/{id}/foods`
- Cart:
  - `GET /api/cart`
  - `POST /api/cart/add?foodId=1&qty=1`
  - `DELETE /api/cart/{id}`
- Orders:
  - `POST /api/orders/checkout`
  - `GET /api/orders`
- Reviews:
  - `POST /api/reviews/{restaurantId}`
  - `GET /api/reviews/{restaurantId}`

## Notes
- Initial restaurant and food data is auto-seeded on backend startup.
- Payment is mocked as successful for demo purposes.
- You can extend this with real payment gateway and order tracking.
