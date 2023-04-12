import express from 'express'
const router = express.Router();

router.use('/user', (req, res)=>{
    res.send("hello am user")
})


export default router