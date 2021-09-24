const express = require('express');
const router = express.Router()

const userRoutes = require('./userController');
const campaignRoutes = require('./campaignController');
const characterRoutes = require('./characterController');

router.get('/',(req,res)=>{
    res.send('Now Entering Savage Worlds')
})

router.use('/api/users',userRoutes);
router.use('/api/campaigns',campaignRoutes);
router.use('/api/characters',characterRoutes);

module.exports = router