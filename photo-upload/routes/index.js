var express = require('express');
var router = express.Router();
const multer = require("multer");
const uuid = require("uuid").v4;

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      callback(null, 'images/blogimages')
  },
  filename: (req, file, callback) => {
      const { originalname } = file;
      callback(null, `${uuid()}-${originalname}`);
  }
})
const upload = multer({storage});


router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', upload.single("image"), function(req, res, next) {
  console.log(req.file.filename);
  return res.status(200).jsonp({status : "OK"});
});

module.exports = router;
