import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from './config/config.js';

//__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/images`)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
    }
})

//errores
export const procesaErrores = (res, error) => {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
        error: 'Internal Server Error',
        detalle: `${error.message}`
    });
}

//bcrypt
export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaHash = (data, hash) => bcrypt.compareSync(data, hash)

//exports
export default __dirname;

export const uploader = multer({ storage, onError:function(error, next){
    console.log(error)
    next()
}})
