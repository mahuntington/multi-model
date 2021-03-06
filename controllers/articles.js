var express = require('express');
var router = express.Router();
var Article = require('../models/articles.js');
var Author = require('../models/authors.js');

router.get('/', function(req, res){
	Article.find({}, function(err, foundArticles){
		res.render('articles/index.ejs', {
			articles: foundArticles
		});
	})
});

router.get('/new', function(req, res){
	res.render('articles/new.ejs');
});

router.post('/', function(req, res){
	Article.create(req.body, function(err, createdArticle){
		res.redirect('/articles');
	})
});

router.get('/:id', function(req,res){
	Article.findById(req.params.id, function(err, foundArticle){
		res.render('articles/show.ejs', {
			article: foundArticle
		});
	});
});

router.delete('/:id', function(req, res){
	Author.find({'articles._id':req.params.id}, function(err, foundAuthors){
		for(var i = 0; i < foundAuthors.length; i++){
			foundAuthors[i].articles.id(req.params.id).remove();
			foundAuthors[i].save();
		}
		Article.findByIdAndRemove(req.params.id, function(){
			res.redirect('/articles');
		})
	});
});

router.get('/:id/edit', function(req, res){
	Article.findById(req.params.id, function(err, foundArticle){
		res.render('articles/edit.ejs', {
			article: foundArticle
		});
	});
});

router.put('/:id', function(req, res){
	Article.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err, updatedArticle){
		Author.find({'articles._id':req.params.id}, function(err, foundAuthors){
			for(var i = 0; i < foundAuthors.length; i++){
				foundAuthors[i].articles.id(req.params.id).remove();
				foundAuthors[i].articles.push(updatedArticle);
				foundAuthors[i].save();
			}
			res.redirect('/articles');
		});
	});
});


module.exports = router;
