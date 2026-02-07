const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Post = require("../models/Post");

/*
1. POST /posts
2. GET /posts
3. GET /posts/:id
4. DELETE /posts/:id
5. PUT /posts/like/:id
6. PUT /posts/unlike/:id
7. POST /posts/comment/:id
8. DELETE /posts/comment/:id/:comment_id
*/

router.post(
  "/",
  auth,
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      return res.status(500).send("Server error creating post");
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const Profile = require("../models/Profile");
    
    const posts = await Post.find()
      .select("-__v")
      .sort({ date: -1 })
      .limit(50);
    
    // Populate user profiles with avatars
    const postsWithProfiles = await Promise.all(
      posts.map(async (post) => {
        const profile = await Profile.findOne({ user: post.user }).select("avatar");
        return {
          ...post.toObject(),
          userProfile: profile
        };
      })
    );
    
    res.json(postsWithProfiles);
  } catch (err) {
    res.status(500).send("Server error fetching posts");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const Profile = require("../models/Profile");
    
    const post = await Post.findById(req.params.id)
      .select("-__v");

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Populate post author profile
    const postProfile = await Profile.findOne({ user: post.user }).select("avatar");
    
    // Populate comment authors' profiles
    const commentsWithProfiles = await Promise.all(
      post.comments.map(async (comment) => {
        const profile = await Profile.findOne({ user: comment.user }).select("avatar");
        return {
          ...comment.toObject(),
          userProfile: profile
        };
      })
    );

    const postWithProfile = {
      ...post.toObject(),
      userProfile: postProfile,
      comments: commentsWithProfiles
    };

    res.json(postWithProfile);
  } catch (err) {
    res.status(500).send("Server error fetching post");
  }
});

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if user has already liked the post
    const alreadyLiked = post.likes.some((like) => like.user.toString() === req.user.id);

    if (alreadyLiked) {
      // Remove the like (toggle off)
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );
    } else {
      // Remove from unlikes if user had unliked it
      post.unlikes = post.unlikes.filter(
        (unlike) => unlike.user.toString() !== req.user.id
      );

      // Add to likes
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();

    return res.json({ likes: post.likes, unlikes: post.unlikes });
  } catch (err) {
    res.status(500).send("Server error updating post");
  }
});

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if user has already unliked the post
    const alreadyUnliked = post.unlikes.some((unlike) => unlike.user.toString() === req.user.id);

    if (alreadyUnliked) {
      // Remove the unlike (toggle off)
      post.unlikes = post.unlikes.filter(
        (unlike) => unlike.user.toString() !== req.user.id
      );
    } else {
      // Remove from likes if user had liked it
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );

      // Add to unlikes
      post.unlikes.unshift({ user: req.user.id });
    }

    await post.save();

    return res.json({ likes: post.likes, unlikes: post.unlikes });
  } catch (err) {
    res.status(500).send("Server error updating post");
  }
});

router.post(
  "/comment/:id",
  auth,
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      res.status(500).send("Server error adding comment");
    }
  }
);

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find((comment) => {
      return comment.id === req.params.comment_id;
    });

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User is not authorized" });
    }

    post.comments = post.comments.filter((comment) => {
      return comment.id !== req.params.comment_id;
    });

    await post.save();
    return res.json(post.comments);
  } catch (err) {
    res.status(500).send("Server error deleting comment");
  }
});

router.put(
  "/:id",
  auth,
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User is not authorized to update this post" });
      }

      // Update post text and mark as edited
      post.text = req.body.text;
      post.edited = true;
      post.editedAt = new Date();

      await post.save();

      // Populate user profile
      const Profile = require("../models/Profile");
      const profile = await Profile.findOne({ user: post.user }).select("avatar");
      
      const postWithProfile = {
        ...post.toObject(),
        userProfile: profile
      };

      res.json(postWithProfile);
    } catch (err) {
      res.status(500).send("Server error updating post");
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "User is not authorized to remove this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ msg: "Post is removed" });
  } catch (err) {
    res.status(500).send("Server error deleting post");
  }
});

module.exports = router;
