import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import procesaErrores from "../utils.js";
import { passportCall } from "../utils.js";

const router = Router();

router.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(401).json({ error: `Error al autenticar` });
});

router.post(
  "/registro",
  passport.authenticate("registro", { session: false, failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    try {
      //si sale bien el authenticate, passport deja un req.user con los datos del usuario
      res.setHeader('Content-Type','application/json');
      return res.status(201).json({payload: "Registro exitoso", nuevoUsuario: req.user})  
      
    } catch (error) {
      procesaErrores(res, error);
    }
  }
);

router.post(
  "/login",
  passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }),
  async (req, res) => {
    let token = jwt.sign(req.user, config.SECRET, { expiresIn: "3600" });
    
    try {
      res.cookie("tokenCookie", token, { httpOnly: true});
      res.setHeader('Content-Type','application/json');
      return res.status(201).json({payload: "Login exitoso", usuario: req.user})
      
    } catch (error) {
      procesaErrores(res, error);
    }
});

router.get('/github',
  passport.authenticate('github', {}),
);


router.get("/callbackGithub",
  passport.authenticate("github",{failureRedirect:"/api/sessions/error"}),
  (req, res)=>{

      
      let token = jwt.sign(req.user, config.SECRET, { expiresIn: "3600" });
      

      try {
        res.cookie("tokenCookie", token, { httpOnly: true });
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login exitoso", usuarioLogueado: req.user});
        
        
      } catch (error) {
        procesaErrores(res, error);
      }
  }
)


/*Agregar al router /api/sessions/ la ruta /current, 
la cual validará al usuario logueado y 
devolverá en una respuesta sus datos (Asociados al JWT). */
router.get("/current", passport.authenticate("current", {session: false}), (req, res) => {

  let token = jwt.sign(req.user, config.SECRET, { expiresIn: "3600" });
  res.cookie("tokenCookie", token, { httpOnly: true });
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: req.user });
});

router.get("/perfil", passportCall("jwt", {session: false}), (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: req.user });
});


router.get("/logout", (req, res) => {
  res.clearCookie("tokenCookie");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "Logout exitoso...!!!" });
});

export default router;
