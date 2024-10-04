const express = require('express')
router = new express.Router()
const sharp = require('sharp')
const User = require('../models/User')
const Task = require('../models/Task')
const auth = require('../middleware/auth')
const multer = require('multer')
const SendWelcomeEmail = require('../emails/account')

const storage = multer.memoryStorage(); 

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter(req, file, cb) {
        if (file.mimetype !== 'image/jpeg') {
            return cb(new Error('Only JPG images are allowed'));
        }
        cb(null, true);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users', async (req, res) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already in use' });
        }

        const user = new User(req.body);

        SendWelcomeEmail(user.email,user.name)

        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
});

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']

    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if (!isValid) {
        return res.status(400).send("Error: Invalid updates....")
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user._id)

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Delete all tasks associated with the user
        await Task.deleteMany({ owner: user._id });  // Assuming tasks have 'owner' as user ID reference

        // Delete the user
        await user.deleteOne();  // Use deleteOne instead of remove

        res.status(200).send({ message: 'User and associated tasks deleted successfully' });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ error: 'An error occurred while deleting the user and tasks', details: error.message });
    }
});

router.post('/users/login', async (req, res) => {
    try {
        console.log("LOGIN")
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res) =>{
    const user = req.user
    try{
        req.user.tokens = []; // Assign an empty array to clear it
        await user.save();
        res.send(); // Send a success response
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logout',auth,async(req,res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).jpeg().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send(`Image uploaded successfully!`);
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar',auth,async(req,res) =>{
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)

    }catch(e){
        res.status(500).send()
    }
})


module.exports = router
