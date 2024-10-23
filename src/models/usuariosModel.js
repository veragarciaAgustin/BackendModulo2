import mongoose from "mongoose";

export const usuariosModel = mongoose.model(
  "usuarios",
  new mongoose.Schema(
    {
      nombre: String,
      apellido: String,
      email: {
        type: String,
        unique: true,
      },
      edad: Number,
      password: String,
      cartId: String,
      rol: {
        type: String,
        default: "usuario"}
    },
    {
      timestamps: true,
      strict: false,
    }
  )
);
