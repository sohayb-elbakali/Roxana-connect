import React, { useEffect } from "react"
import { connect } from "react-redux"
import { getPosts } from "../../redux/modules/posts"
import PostForm from "./PostForm"
import PostItem from "./PostItem"

function Posts({ getPosts, posts }) {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="pt-16 min-h-screen bg-gray-50 lg:ml-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="space-y-6">
          <PostForm />
          <div className="space-y-6">
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  posts: state.posts.posts,
});

export default connect(mapStateToProps, { getPosts })(Posts);
