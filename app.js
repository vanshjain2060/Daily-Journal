//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Click on the Compose Button to post your new Blog on this page.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const dbURI = 'mongodb+srv://admin-vansh:vanshjain2060@cluster0.ki3p5of.mongodb.net/blogDB';
// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true});

const postSchema = {
  title : String,
  content : String
}

const Post = mongoose.model("Post" , postSchema);

app.get('/', async function(req, res) {
  try {
    const posts = await Post.find(); // Fetch all posts
    res.render('home', {StartingContent : homeStartingContent , posts : posts}); // Render 'home.ejs' with the data
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/about" , function(req, res) {
  res.render("about", {aboutContent : aboutContent});
});


app.get("/contact" , function(req, res) {
  res.render("contact", {contactContent :contactContent});
});


// this is a general route with using express routing params
app.get("/posts/:postId" ,async function(req, res) {
  let element = req.params.postId;
  const post = await Post.findOne({ _id: element});
  if(post) {
    res.render("post", {title : post.title, content : post.content});
  }
});



app.get("/compose" , function(req, res) {
  res.render("compose")
});

app.post("/compose", async (req, res) => {
  try {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
    });
    await post.save(); // Save the post to the database
    res.redirect("/");
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server started on port 3000");
});
