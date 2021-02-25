const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

class Post extends Model {
    static upvote(body, models) {
      return models.Favorite.create({
        user_id: body.user_id,
        post_id: body.post_id
      }).then(() => {
        return Post.findOne({
          where: {
            id: body.post_id
          },
          attributes: [
            'id',
            'title',
            'post_text',
            'city',
            'country',
            [
              sequelize.literal('(SELECT COUNT(*) FROM favorite WHERE post.id = favorite.post_id)'),
              'favorite_count'
            ]
          ]
        });
      });
    }
  }
  

Post.init( 
    {   
        id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4, 200]
            }
        },
        post_text: {
            type: DataTypes.STRING,
            allowNull: false,    

        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        long: {
          type: DataTypes.FLOAT
        },
        lat: {
          type: DataTypes.FLOAT
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
    
);

module.exports = Post;
