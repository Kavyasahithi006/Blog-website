const exp=require('express');
const authorApp=exp.Router();
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor=require("./createUserOrAuthor");
const article=require('../models/articleModel');
const {requireAuth,clerkMiddleware}=require("@clerk/express")
require('dotenv').config()
authorApp.use(clerkMiddleware())
//create new author
authorApp.post("/author",expressAsyncHandler(createUserOrAuthor));
//create new article
// Create new article (only for authenticated users)
authorApp.post("/article", requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
    try {
        const newArticleObj = req.body;
        const newArticle = new article(newArticleObj);
        const articleObj = await newArticle.save();
        res.status(201).send({ message: "Article published", payload: articleObj });
    } catch (error) {
        res.status(500).send({ message: "Error publishing article", error: error.message });
    }
}));


//read all articles
authorApp.get('/articles',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //read all articles from db
    const listOfArticles=await article.find({isArticleActive:true});
    res.status(200).send({"message":"articles",payload:listOfArticles})
}))
authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"unauthorized request"})
})

//modify article by articleid

authorApp.put(
    '/article/:articleId',
    requireAuth({ signInUrl: "unauthorized" }),
    expressAsyncHandler(async (req, res) => {
      try {
        const articleIdParam = req.params.articleId;
  
        // Copy the request body to remove immutable fields
        const modifiedArticle = { ...req.body };
        delete modifiedArticle.articleId;
        delete modifiedArticle._id;
  
        // Update the article by matching the custom articleId
        const updatedArticle = await article.findOneAndUpdate(
          { articleId: articleIdParam },
          modifiedArticle,
          { new: true, runValidators: true }
        );
  
        if (!updatedArticle) {
          return res.status(404).send({ message: "Article not found" });
        }
  
        res.status(200).send({ message: "Article modified", payload: updatedArticle });
      } catch (error) {
        console.error("Error modifying article:", error);
        res.status(500).send({ message: "Error modifying article", error: error.message });
      }
    })
  );
  



//dlete(soft delete) article by articleid
authorApp.put('/articles/:articleId', requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
    try {
        const articleId = req.params.articleId;
        const latestArticle = await article.findByIdAndUpdate(articleId, 
            { isArticleActive: false }, 
            { new: true }  // Ensures updated document is returned
        );

        if (!latestArticle) {
            return res.status(404).send({ message: "Article not found" });
        }

        res.status(200).send({ message: "Article deleted", payload: latestArticle });
    } catch (error) {
        res.status(500).send({ message: "Error deleting article", error: error.message });
    }
}));


module.exports=authorApp;