const express = require("express");
const { parse } = require("handlebars");
const mongoose = require("mongoose");
const Users = require("./user");
const app = express();

//Database Connection=====================

mongoose.connect("mongodb://localhost/paginated").then((req,res)=>
{
    console.log("Connection is Okk..");
})

//==================== Inserting Documents into Database====================

const db = mongoose.connection
db.once("open",async()=>{
    if(await Users.countDocuments().exec() > 0)return
    
    Promise.all(
        [ 
                Users.create({ name: 'User 1' }),
                Users.create({ name: 'User 2' }),
                Users.create({ name: 'User 3' }),
                Users.create({ name: 'User 4' }),
                Users.create({ name: 'User 5' }),
                Users.create({ name: 'User 6' }),
                Users.create({ name: 'User 7' }),
                Users.create({ name: 'User 8' }),
                Users.create({ name: 'User 9' }),
                Users.create({ name: 'User 10' }),
                Users.create({ name: 'User 11' }),
                Users.create({ name: 'User 12' })
        ]
    ).then(()=>
    {
        console.log("User Added Successfully.........!")
    })
})


app.get("/posts",paginatedResults(Users),(req,res)=>{
    res.json(res.paginatedResults)
})

app.get("/users",paginatedResults(Users),(req,res)=>{
    res.json(res.paginatedResults)
})

function paginatedResults(model){
    return async(req,res,next)=>{
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if(endIndex < await model.countDocuments().exec())
        {
            results.next = {
                page:page + 1,
                limit:limit
            }
        }
       
        if(startIndex > 0){
            results.previous = {
                page:page - 1,
                limit:limit
            }
        }
        
       try
       {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        console.log("hiiiiiiiiiiii")
        next()
       }catch(e)
       {
           res.status(500).json({ messa: e.message })
       }
    }
}

app.listen(3000,(req,res)=>{
    console.log("Server Is Running At 3000")
});