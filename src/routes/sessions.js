import { Router } from "express";
import { UsuariosManagerMongo as UsuariosManager } from "../managers/usuariosManager.js";
import { config } from "../config/config.js";
import { generaHash, validaHash } from "../utils.js";

const router = Router();

router.post("/registro", async (req, res) => {
  let { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Complete los datos...!!!` });
  }

  // validaciones x cuenta del alumno
  try {
    let existe = await UsuariosManager.getBy({ email });
    if (existe) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `Ya existe un usuario con email ${email}` });
    }

    password = generaHash(password);

    let nuevoUsuario = await UsuariosManager.create({
      nombre,
      email,
      password,
    });

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ mensaje: "Registro exitoso", nuevoUsuario });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Complete datos...!!!` });
  }

  try {
    
    let usuario = await UsuariosManager.getBy({ email });
    if (!usuario) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: `Credenciales inválidas` });
    }
    if(!validaHash(password, usuario.password)){
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: `Credenciales inválidas` });
    }
    delete usuario.password; // borrar datos sensibles

    req.session.usuario = usuario;

    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ mensaje: "Login exitoso", usuarioLogueado: usuario });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
});

router.get("/logout", (req, res) => {
  let { web } = req.query;

  req.session.destroy((error) => {
    if (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: `Error al realizar logout` });
    }
    if (web) {
      return res.redirect("/login?mensaje=Logout exitoso");
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: "Logout exitoso...!!!" });
    }
  });
});

export default router;
