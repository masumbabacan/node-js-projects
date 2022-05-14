const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const passport = require("passport");

//user model
const User = require("../models/User");

//login page
router.get("/login",(req,res) => res.render("login"));

//register page
router.get("/register",(req,res) => res.render("register"));

// register handle
router.post("/register", (req,res) => {
    const {name,email,password,password2} = req.body;
    let errors = []
    if (!name || !email || !password || !password2) {
        errors.push({message : "Lütfen tüm alanları doldurun"});
    }
    if (password !== password2) {
        errors.push({message : "Şifreler birbiriyle eşleşmedi"});
    }
    if (password.length < 6) {
        errors.push({message : "Şifre en az 6 karakter olmalıdır"});
    }

    if (errors.length > 0) {
        res.render("register",{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        User.findOne({ email : email })
            .then(user => {
                if (user) {
                    errors.push({message : "Böyle bir email zaten kayıtlı"})
                    console.log(errors);
                    res.render("register",{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password,salt,(err,hash) => {
                            if (err) {
                                throw err;
                            }else{
                                newUser.password = hash;
                                newUser.save()
                                    .then(user => {
                                        req.flash("success_msg","Kayıt başarılı şimdi giriş yapabilirsin");
                                        res.redirect("/users/login")
                                    })
                                    .catch(err => console.log(err));
                            }
                    }))
                }
            });
    }
})

//login
router.post("/login", (req,res,next) => {
    passport.authenticate("local",{
        successRedirect : "/dashboard",
        failureRedirect : "/users/login",
        failureFlash : true
    })(req,res,next);
})

//logout
router.get("/logout", (req,res) => {
    req.logOut();
    req.flash("success_msg","başarıyla çıkış yaptınız");
    res.redirect("/users/login");
})
module.exports = router;