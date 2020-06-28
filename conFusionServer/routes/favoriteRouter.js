const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
const user = require('../models/user');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser,(req,res,next) => {
    console.log(req.user)
    Favorites.findOne({user : req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then((favorite)=>{
        if(favorite!=null){
            var comdishes = [];
            var num = 0
            // Compair req.body and dishes array and remove alrady included dishes and push new dish to dishes
            for(let i in req.body){
                var flag = 0;
                for(let j in favorite.dishes){
                    if(new String(req.body[i]._id).valueOf() == new String(favorite.dishes[j]).valueOf() ){
                        flag = flag+1;
                    }
                }
                if(flag == 0){
                    comdishes[num] = req.body[i]._id
                    num = num + 1;
                }
            }
            if(comdishes.length > 0){
            Favorites.update({user : req.user._id},{$push:{dishes:comdishes}})
            .then((newFav)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newFav);
            },(err) => next(err))
        }else{
            err = new Error('You have add alrady these Favorite dishes ');
            err.status = 404;
            return next(err); 
        }
    }
        else{
            var fav = {
                user : req.user._id,
                dishes : req.body
            }
            Favorites.create(fav)
            .then((fav) => {
                console.log('Favorites Created ', fav);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    })
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Favorites.findOne({user: req.user._id})
    .then((fav)=>{
        if(fav!=null){
            fav.deleteOne({user:req.user._id}).then((newFav)=>{
                console.log('Successfully deleted!', newFav);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newFav);
            })
        }else{
            err = new Error('You have not any Favorite dishes ');
            err.status = 404;
            return next(err); 
        }
    },(err) => next(err))
})

favoriteRouter.route('/:dishId')

.post(authenticate.verifyUser,(req, res, next) => {

    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        if (favorite != null) {
            Favorites.findOne({dishes:req.params.dishId})
            .then((doc)=>{
                if(doc){
                    res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(doc);
                    console.log('This dish is already in your favorites');
                }
                else{
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                    }, (err) => next(err) )     
                }
            })
        }
        else{
            var fav = {
                    user : req.user._id,
                    dishes : req.params.dishId
                }
                Favorites.create(fav)
                .then((fav) => {
                    console.log('Favorites Created ', fav);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                }, (err) => next(err))
                .catch((err) => next(err));
              }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user: req.user._id})
    .then((favorite) => {
        if (favorite != null) {
            Favorites.findOne({dishes:req.params.dishId})
            .then((doc)=>{
                if(doc){
                    
                    Favorites.update({user:req.user._id},{$pullAll: {dishes:[req.params.dishId]}})
                    .then((fav)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(fav);
                    }, (err) => next(err))

                }
                else {
                    err = new Error('Favorite dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);            
                    }
            },(err) => next(err))
        }
    },(err) => next(err))
});
module.exports = favoriteRouter;