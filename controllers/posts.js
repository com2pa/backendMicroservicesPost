const postRouter = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

// obtemos todos los post

postRouter.get('/', async (request, response) => {
  try {
    // const { user }= request.user
    const posts = await Post.find({}).populate('user', 'name');
    // console.log(posts)
    return response.json(posts);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Server error' });
  }
});

// crear un posts
postRouter.post('/', async (request, response) => {
  const { title, content, userId } = request.body;
  console.log(title, content, userId);

  try {   
    // Crear el nuevo post
    const newPost = new Post({ title, content, user: userId });
    console.log('Nuevo post:', newPost);

    // Guardar el post en la base de datos
    await newPost.save();

    // Agregar el ID del nuevo post al array de posts del usuario
    user.posts.push(newPost._id);

    // Guardar el usuario con el nuevo post
    await user.save();

    // Retornar el nuevo post como respuesta
    return response.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Error en el servidor' });
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
  return response
    .status(201)
    .json({ msg: 'Post y comentarios eliminados exitosamente' });
});

module.exports = postRouter;
