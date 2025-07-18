const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const dataFilePath = path.join(__dirname, "data.json");

function readPosts() {
  const data = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(data);
}

function writePosts(posts) {
  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
}

app.get("/", (req, res) => {
  const posts = readPosts();
  res.render("home", { posts: posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const posts = readPosts();
  const newPost = {
    id: Date.now().toString(),
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(newPost);
  writePosts(posts);
  res.redirect("/");
});

app.get("/posts/:id", (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.render("post", { title: post.title, content: post.content });
  } else {
    res.send("Post not found");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});