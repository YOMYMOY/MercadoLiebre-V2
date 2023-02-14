const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination : (req,file,callback) => {
        callback(null, path.join(__dirname, '../../public/images/products'));
    },
    filename : (req,file,callback) => {
        callback(null, `img-${Date.now()}${path.extname(file.originalname)}`)
    }
});

const uploadImage = multer({
    storage
});

module.exports = {
    uploadImage
}