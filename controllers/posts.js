const postRouter = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment =require('../models/comment')
const { usertExtractor } = require('../middleware/auth');

// obtemos todos los post

postRouter.get('/', async (request, response) => {
    try {
        // const { user }= request.user
    const posts = await Post.find({}).populate('user','name');
    return response.json(posts);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Server error' });
  }
});

// crear un posts
 postRouter.post('/', usertExtractor, async (request, response) => {   
   const { title, content } = request.body;
   const user = request.user;

   if (user.role !== 'user') {
     return response.status(401).json({ message: 'User not authorized' });
   }

   try {
     const userId = await User.findById(user.id); 
     if (!userId) {
       return response.status(404).json({ message: 'Usuario no encontrado' });
     }

     const newPost = new Post({ title, content, user: userId });
     await newPost.save();

     userId.posts.push(newPost._id); 
     await userId.save();

     return response.status(201).json(newPost);
   } catch (error) {
     console.error(error);
     return response.status(500).json({ message: 'Server error' });
   }
 });


// eliminar post
postRouter.delete('/:id', async (request, response) => {
  
    const post = await Post.findByIdAndDelete(request.params.id);
    console.log(post);
    if (!post) return response.status(404).json({ message: 'Post not found' });

    // eliminar le post del usuario
    const user = await User.findByIdAndUpdate(post.user, {
      $pull: { posts: request.params.id },
    });
    // buscamos el usuario
    if (!user)
      return response.status(404).json({ message: 'Usuario no encontrado' });

    // Eliminar comentarios asociados al post
    await Comment.deleteMany({ postId: request.params.id });

    // actualizamos el usuario en la base de datos
    await user.save();

    // Eliminamos el post
    return response.status(201).json({ msg: 'Post y comentarios eliminados exitosamente' });

});

module.exports = postRouter;
