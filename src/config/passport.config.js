import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import passportJWT from "passport-jwt";
import { UsuariosManagerMongo as usuariosManager } from "../managers/usuariosManager.js";
import { generaHash, procesaErrores, validaHash } from "../utils.js";
import { config } from "./config.js";
import jwt from "jsonwebtoken";

const buscarToken = req => {
  let token = null;
  if (req.cookies.tokenCookie) {
    console.log(`passport recibe token...!!!`)
    token = req.cookies.tokenCookie;
  }
  return token;
}


export const initPassport = () => {
  //paso1

  //registro
  passport.use(
    "registro",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { nombre, apellido, edad, rol } = req.body;
          if (!nombre) {

            return done(null, false, { message: "El nombre es requerido" });
          }

          let existe = await usuariosManager.getBy({ email: username });

          if (existe) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          password = generaHash(password);

          let nuevoUsuario = await usuariosManager.create({
            nombre,
            apellido,
            edad,
            email: username,
            password,
            rol: rol || "usuario",
          });
          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
          
        }
      }
    )
  );

  // login
passport.use(
  "login",
  new local.Strategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      try {
        let usuario = await usuariosManager.getBy({ email: username });
        
        if (!usuario) {
          return done(null, false);
        }

        if (!password || !usuario.password) {
          return done(null, false);
        }

        if (!validaHash(password, usuario.password)){
          return done(null, false);
        }

        delete usuario.password;
        return done(null, usuario);

      } catch (error) {
        return done(error);
      }
      
    }
  )
);

//current
  passport.use("current", 
    new passportJWT.Strategy(
        {
            secretOrKey: config.SECRET, 
            jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscarToken])
        },
        async(usuario, done)=>{
            try {
                return done(null, usuario)
            } catch (error) {
                return done(error)
            }
        }
    )
)
};
// github: realizar login con github utilizando json web token
passport.use(
  new github.Strategy(
    {
      clientID: "Iv23li3IBcM1mlRFLoyi",
      clientSecret: "f8e89ab4e7396a1c3506b3d967c731999771e3f4",
      callbackURL:  "http://localhost:3000/api/sessions/callbackGithub"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let usuario = await usuariosManager.getBy({ email: profile.emails[0].value });
        if (!usuario) {
          usuario = await usuariosManager.create({
            nombre: profile.displayName,
            email: profile.emails[0].value,
            password: null,
            rol: "usuario",
          });
        }
        let token = jwt.sign(usuario, config.SECRET, { expiresIn: "1d" });
        return done(null, token);
      } catch (error) {
        return done(error);
      }
    }
  )
);