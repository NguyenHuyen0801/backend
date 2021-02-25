var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.listen(3000);

//access momgo
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://BookShop:huyen080100@cluster0.bnnnm.mongodb.net/BookShop?retryWrites=true&w=majority', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log("Mongo connect error " + err);
    } else {
        console.log("Mongo connected successfull!");
    }
});

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//model
var Book = require("./model/book");

//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("imgBook");

app.get("/", function (req, res) {
    res.redirect("list");
});

app.get("/add", function (req, res) {
    res.render("add");
});

app.post("/add", function (req, res) {

    //upload file
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log({ "kq": 0, "errMsg": "A Multer error occurred when uploading" });
        } else if (err) {
            console.log({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
        } else {
            // res.send(req.file.filename);
            var book = Book({
                Name: req.body.textName,
                Author: req.body.textAuthor,
                Image: req.file.filename,
                Cost: req.body.textCost,
            });

            book.save(function (err) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err })
                }
                else {
                    res.redirect("./list");
                }
            });
        }
    });
});

//List
app.get("/list", function (req, res) {
    Book.find(function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("list", { danhsach: data });
        }
    });
});

//edit
app.get("/edit/:id", function (req, res) {

    Book.findById(req.params.id, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            console.log(data);
            res.render("edit", { book: data });
        }
    })

    // lấy thông tin chi tiết của :id

});
app.post("/edit", function (req, res) {
    //khach hang chon file hinh moi
    //upload file
    upload(req, res, function (err) {
        //khach hang khong upload file moi
        if (!req.file) {
            Book.updateOne({ _id: req.body.idBook }, {
                Name: req.body.textName,
                Author: req.body.textAuthor,
                Cost: req.body.textCost,
            }, function (err) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {
                    res.redirect("./list");
                }
            })
        } else {
            if (err instanceof multer.MulterError) {
                console.log({ "kq": 0, "errMsg": "A Multer error occurred when uploading" });
            } else if (err) {
                console.log({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
            } else {
                // res.send(req.file.filename);
                Book.updateOne({ _id: req.body.idBook }, {
                    Name: req.body.textName,
                    Author: req.body.textAuthor,
                    Image: req.file.filename,
                    Cost: req.body.textCost,
                }, function (err) {
                    if (err) {
                        res.json({ "kq": 0, "errMsg": err });
                    } else {
                        res.redirect("./list");
                    }
                })
            }
        }
    });

})

app.get("/delete/:id", function (req, res) {
    Book.deleteOne({ _id: req.params.id }, function (err) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.redirect("../list");
        }
    })
})