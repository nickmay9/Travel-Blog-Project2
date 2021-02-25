const router = require('express').Router();
const { Post, User, Comment, Favorite } = require('../../models');
const axios = require('axios');
require('dotenv').config();

const getMapquestData = async function(city, country){
    try{
        return await axios.get(`https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MapqquestApiKey}=${city}+${country}`)
        .then(data => {
            return [data.data.results[0].locations[0].latLng.lat, data.data.results[0].locations[0].latLng.lng]
        });
    } catch (error) {
        console.error(error);
    }
}

router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',  
            'title', 
            'post_text',
            'city',
            'country',
            'long',
            'lat',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        console.log(dbPostData);
        res.json(dbPostData);
    })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        order: [['created_at', 'DESC']],
        attributes: [
            'id', 
            'title',
            'post_text',
            'city',
            'country',
            'long',
            'lat',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM favorite WHERE post.id = favorite.post_id)'), 'favorite_count']

        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id.' });
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



router.post('/', (req, res, next) => {
    const cityData = getMapquestData(req.body.city, req.body.country)
        .then(data => {
            [req.body.latitude, req.body.longitude] = data;
            next();
        });
    
}, function(req, res){
    Post.create({
        title: req.body.title,
        post_text: req.body.post_text,
        city: req.body.city,
        country: req.body.country,
        long: req.body.longitude,
        lat: req.body.latitude,
        user_id: req.session.user_id
    }).then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

//This is the one you want
router.put('/favorite', (req, res) => {

    if (req.session.loggedIn) {
    // custom static method created in models/Post.js
        Post.upvote({post_id: req.body.post_id, user_id: req.session.user_id}, { Favorite })
            .then(updatedPostData => res.json(updatedPostData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});

router.put('/:id', (req, res, next) => {
    const cityData = getMapquestData(req.body.city, req.body.country)
    .then(data => {
        [req.body.latitude, req.body.longitude] = data;
        next();
    });
}, function(req, res){
    Post.update(
        {
            title: req.body.title,
            post_text: req.body.post_text,
            city: req.body.city,
            country: req.body.country,
            lat: req.body.latitude,
            long: req.body.longitude,
            user_id: req.session.user_id

        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id.' });
            return;
        }
        res.json(dbPostData);

    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});




router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({ message: 'No post found with this id.' });
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});



module.exports = router;
