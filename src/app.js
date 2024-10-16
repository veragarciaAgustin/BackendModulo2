//Express
import express from "express";
import path from "path";
import sessions from "express-session";
//Handlebars
import handlebars from "express-handlebars";
//Utils
import __dirname from "./utils.js";
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

const app = express();
const port = 8080;

//Conexion a base de datos
const environment = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://agusvera:Agus1234@mycluster.6nf1g.mongodb.net/productos",
      { useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 30 }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
  let products = await productModel.paginate({}, { page: 1, limit: 10 });
};
environment();

//Handlebars
app.engine(
  "handlebars",
  handlebars.engine({ allowProtoMethodsByDefault: true })
);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  sessions({
    secret: config.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.MONGO_URL,
      dbName: config.DB_NAME,
      ttl: 3600
    }),
  })
);

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
