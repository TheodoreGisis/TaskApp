const express = require('express')
router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/Task')
 
router.get('/tasks', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; 
        const skip = parseInt(req.query.skip) || 0;  
        const user = req.user;
        const completed= req.query.completed

        if(completed === undefined){
            const tasks = await Task.find({ owner: user._id}).limit(limit).skip(skip)
            res.status(200).send(tasks); 
        }else{
            const tasks = await Task.find({ owner: user._id,completed:completed }).limit(limit).skip(skip)
            res.status(200).send(tasks); 
            res.status(200).send(tasks); 
        }

        
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/tasks/:id',auth,async(req,res) =>{
    _id = req.params.id

    try{
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.send("No Task Found").status(404)
        }
        res.send(task).status(200)
    }catch(e){
        res.status(404).send()
    }
})

router.post('/tasks',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.send(task).status(201)
    }catch(e){
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id; 
    console.log(`Task ID to delete: ${_id}`);
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.status(200).send({ message: 'Task deleted successfully', task });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while deleting the task', details: error });
    }
});

router.patch('/tasks/:id',auth,async(req,res) =>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedValues = ['description','completed']
    const isValid = updates.every((update) => allowedValues.includes(update))

    if(!isValid){
        return res.status(400).send("Errod: Invalid updates....")
    }
    try{

        const task = await Task.findOne({_id:req.params.id,owner:req.user._id}) 
        
        if(!task) {
            return res.status(404).send()
        }
                
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()  
        res.send(task).status(200)
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router