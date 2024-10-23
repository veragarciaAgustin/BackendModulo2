import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

// export const auth=(req, res, next)=>{

//     console.log(req.cookies)

//     if(!req.cookies.tokenCookie){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`Unauthorized - no llega token`})
//     }

//     // console.log(req.headers.authorization)
//     let token=req.cookies.tokenCookie    
//     try {
//         req.user=jwt.verify(token, config.SECRET)
//     } catch (error) {
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`${error.message}`})
//     }

//     next()
// }

export const auth = rol =>{
    return (req, res, next)=>{
        if(!req.user || !req.user?.rol){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No autorizado`})
        }

        if(req.user.rol!==rol){
            res.setHeader('Content-Type','application/json');
            return res.status(403).json({error:`No autorizado`})
        }

        next()
    }
}
