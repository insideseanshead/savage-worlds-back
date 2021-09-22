const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuthStatus = request => {
    if(!request.headers.authorization) {
        return false;
    };
    token = request.headers.authorization.split(' ')[1]
    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET, (err,data) =>{
        if(err) {
            return false
        }
        else {
            return data
        }
    });
    console.log(loggedInUser)
    console.log(token)
    return loggedInUser
}


router.get('/',(req,res)=>{
    db.User.findAll().then(dbUsers=>{
        res.json(dbUsers);
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    })
})

router.post('/',(req,res)=>{
    db.User.create({
        email:req.body.email,
        name:req.body.name,
        password:req.body.password
    }).then(newUser=>{
        res.json(newUser);
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    })
})

router.post('/login',(req,res)=>{
    db.User.findOne({
        where:{
            email:req.body.email,
        }
    }).then(foundUser=>{
        if(!foundUser){
            return res.status(404).send("USER NOT FOUND")
        }
        if(bcrypt.compareSync(req.body.password, foundUser.password)) {
            const userTokenInfo = {
                email:foundUser.email,
                id:foundUser.id,
                name:foundUser.name
            }
            const token = jwt.sign(userTokenInfo,process.env.JWT_SECRET,{expiresin:'6h'});
            return res.status(200).json({token:token})
        } else {
            return res.status(403).send('Login Failed')
        }
    })
})

router.get('/secretProfile',(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    console.log(loggedInUser)
    if(!loggedInUser){
        return res.status(401).send("invalid token")
    }
    db.User.findOne({
        where:{
            id:loggedInUser.id,
        },
        include:[{
            model:db.Campaign,
            include:[db.Character]
        },
    db.Character]
    }).then(dbUser=>{
        res.json(dbUser)
    }).catch(err=>{
        console.log(err)
        res.status(500).send('error occured')
    })
})

module.exports = router