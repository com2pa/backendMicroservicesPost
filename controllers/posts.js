const postRouter =require('express').Router()
const Post = require('../models/post')
const User =require('../models/user')

// obtemos todos los post

postRouter.get('/', async(request,response)=>{
    try{
        const posts = await Post.find({})
        return response.json(posts)
    }catch(error){
        console.error(error)
        return response.status(500).json({message: 'Server error'})
    }
})

// crear un posts 
postRouter.post('/', async(request,response)=>{
    try{
        const {title, content, userId} = request.body
        console.log(title, content, userId)
        const user = await User.findById(userId)
        if(!user){
            return response.status(404).json({message: 'Usuario no encontrado'})
        }
        // creamos el post
        const newPost = new Post({title, content, user: userId})
        // guardamos el post
        await newPost.save()
        
     
        

        // añadiendo el post al usuario
        user.posts.push(newPost._id)
        await user.save()



        // retornamos el nuevo post
        return response.status(201).json(newPost)
    }catch(error){
        console.error(error)
        return response.status(500).json({message: 'Server error'})
    }
})


module.exports = postRouter;
