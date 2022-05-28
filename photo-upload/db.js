var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/photo-upload");

var Shema = mongoose.Schema;

var photoShema = new Shema({
    ad : String,
    image : String,
});

mongoose.model("photos",photoShema);
module.exports = mongoose;