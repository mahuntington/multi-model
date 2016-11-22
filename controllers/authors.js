var express = require('express');
var Author = require('../models/authors.js');
var Article = require('../models/articles.js');
var router = express.Router();

router.get('/', function(req, res){
	Author.find({}, function(err, foundAuthors){
		res.render('authors/index.ejs', {
			authors: foundAuthors
		});
	})
});

router.post('/', function(req, res){
	Author.create(req.body, function(err, createdAuthor){
		res.redirect('/authors');
	});
});

router.get('/new', function(req, res){
	res.render('authors/new.ejs');
});

router.get('/:id', function(req, res){
	Author.findById(req.params.id, function(err, foundAuthor){
		res.render('authors/show.ejs', {
			author: foundAuthor
		});
	});
});

router.delete('/:id', function(req, res){
	Author.findByIdAndRemove(req.params.id, function(){
		res.redirect('/authors');
	});
});

router.put('/:id', function(req, res){
	Author.findByIdAndUpdate(req.params.id, req.body, function(){
		res.redirect('/authors');
	});
});

router.get('/:id/edit', function(req, res){
	Article.find({}, function(err, foundArticles){
		Author.findById(req.params.id, function(err, foundAuthor){
			res.render('authors/edit.ejs', {
				author: foundAuthor,
				articles: foundArticles
			});
		});
	});
});

router.post('/:id/articles', function(req, res){
	Article.findById(req.body.articleId, function(err, foundArticle){
		Author.findById(req.params.id, function(err, foundAuthor){
			foundAuthor.articles.push(foundArticle);
			foundAuthor.save(function(){
				res.redirect('/authors/' + req.params.id + '/edit');
			})
		});
	});
});

module.exports = router;
