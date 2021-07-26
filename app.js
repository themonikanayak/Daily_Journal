//jshint esversion:6
require('custom-env').env();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Create a blog and share your voice in minutes. DAILY JOURNAL makes it easy for you to start your own blog. Navigate to /compose url to compose a new blog. So what are you waiting for? Start sharing your ideas.";
const aboutContent = "Powerful website building features to help you publish anything, anywhere. So, the team consists of a single person, me, Monika Nayak. I am an undergraduate student at Indian Institute of Technology (BHU),Varanasi. Building projects like this blog website is my passion. So, that's about us, i mean about me.";
const contactContent = "Always there for any queries or feedback. Feel free to contact @monikanayak on LinkedIn.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@cluster0.jozu6.mongodb.net/blogDB?retryWrites=true&w=majority", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
