import express from "express";
import Route from "../model/routeModel.js";

const router = express.Router();

// Show map page with routes
router.get("/map", async (req, res) => {
  const routes = await Route.find();   // get routes from DB
  res.render("map", { routes });       // send to EJS
});

export default router;
