const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Favorite = require('./Favorite');


User.hasMany(Post, {
    foreignKey: 'user_id'
});
  
Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

User.belongsToMany(Post, {
    through: Favorite,
    as: 'favorite_posts',
    foreignKey: 'user_id'
});
  
Post.belongsToMany(User, {
    through: Favorite,
    as: 'favorite_posts',
    foreignKey: 'post_id'
});

Favorite.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Favorite.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Favorite, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Favorite, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Comment, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

module.exports = { User, Post, Comment, Favorite };