//Express
import express from "express";
import path from "path";
import sessions from "express-session";
//Handlebars
import handlebars from "express-handlebars";
//Utils
import __dirname from "./utils.js";
//CookieParser
import cookieParser from "cookie-parser";
//Auth
import { auth } from "./middleware/auth.js";
//Routes
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import sessionsRouter from "./routes/sessions.js";
//Config
import { config } from './config/config.js';
//Routes de vistas
import viewsRouter from "./routes/views.js";
//Mongoose
import mongoose from "mongoose";
import { productModel } from "./models/productsModel.js";
//ConnectMongo, para almacenar datos de sesiones
import MongoStore from "connect-mongo";
//Passport
import passport from "passport";
import { initPassport } from "./config/passport.config.js";

const port = config.PORT;
const app = express();


//Handlebars
app.engine(
  "handlebars",
  handlebars.engine({ allowProtoMethodsByDefault: true })
);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

// app.use(passport.session()); //SOLO SI USO SESIONES, no con JWT
initPassport();
app.use(passport.initialize());

//Routes
app.use("/api/products", productsRouter);
app.use("/carts", passport.authenticate("current", {session: false}), cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


//Conexion a base de datos
const environment = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://agusvera:Agus1234@mycluster.6nf1g.mongodb.net/productos",
      { maxPoolSize: 30 }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
  let products = await productModel.paginate({}, { page: 1, limit: 10 });
};
environment();