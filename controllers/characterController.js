const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken');
const db = require('../models');

const checkAuthStatus = request => {
    if(!request.headers.authorization) {
        return false
    }
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
    return loggedInUser
}

router.get('/',(req,res)=>{
    db.Character.findAll().then(characters=>{
        res.json(characters);
    }).catch(err=>{
        console.log(err)
        res.status(500).send('something went wrong')
    })
})

router.get('/:id',(req,res)=>{
    db.Character.findOne({
        where:{
            id:req.params.id
        }
    }).then(dbCharacter=>{
        res.json(dbCharacter);
    }).catch(err=>{
        console.log(err)
        res.status(500).send('something went wrong')
    })
})

// Edit so people can add characters to different users campaigns.
router.post('/',(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser){
        return res.status(401).send('login first')
    }
    console.log(loggedInUser)
    db.Campaign.findOne({
        where:{
            id:req.body.campaignId
        }
    }).then(campaignData=>{
        if(campaignData.UserId===loggedInUser.id){
            db.Character.create({
                name:req.body.name,
                player:req.body.player,
                UserId:loggedInUser.id,
                CampaignId:req.body.campaignId
            }).then(newCharacter=>{
                return res.json(newCharacter)
            }).catch(err=>{
                console.log(err)
                return res.status(500).send('something went wrong')
            })
        }else{
           return res.status(401).send('not your Campaign') 
        }
    })
    
})

router.put("/:id",(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser){
        return res.status(401).send('login first')
    }
    db.Character.findOne({
        where:{
            id:req.params.id
        }
    }).then(character=>{
        if(loggedInUser.id===character.UserId){
            db.Character.update({
                name:req.body.name,
                player:req.body.player,
                CampaignId:req.body.CampaignId
            },{
                where:{
                    id:character.id
                }
            }).then(editCharacter =>{
                res.json(editCharacter)
            }).catch(err=>{
                console.log(err)
                res.status(500).send('something went wrong')
            })
        } else {
            return res.status(401).send("not your Character!")
        }
    })
})

router.delete("/:id",(req,res)=>{
    const loggedInUser = checkAuthStatus(req);
    if(!loggedInUser){
        return res.status(401).send('login first')
    }
    db.Character.findOne({
        where:{
            id:req.params.id
        }
    }).then(character=>{
        if(loggedInUser.id===character.UserId){
            db.Character.destroy({
                where:{
                    id:character.id
                }
            }).then(delCharacter =>{
                res.json(delCharacter)
            }).catch(err=>{
                console.log(err)
                res.status(500).send('something went wrong')
            })
        } else {
            return res.status(401).send("not your Character!")
        }
    })
})


module.exports = router