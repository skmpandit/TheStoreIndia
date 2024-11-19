import express from "express";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, orderPlaced } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";


const app = express.Router();


// route - /api/v1/order/new
app.post("/new", newOrder);

// route - /api/v1/order/my
app.get("/my", myOrders);

// route - /api/v1/order/all
app.get("/all", adminOnly, allOrders);

// route - /api/v1/order/
app.route("/:id").get(getSingleOrder).put(adminOnly, orderPlaced).delete(adminOnly, deleteOrder);


export default app;