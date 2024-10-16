import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcrypt';

//__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

//multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/images`)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
    }
})
export const uploader = multer({ storage, onError:function(error, next){
    console.log(error)
    next()
}})


//bcrypt
export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaHash = (pass, hash) => bcrypt.compareSync(pass, hash)



