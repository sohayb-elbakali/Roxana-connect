import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getPosts } from "../../redux/modules/posts";
import { fetchInternships } from "../../redux/modules/internships";
import PostItem from "../Posts/PostItem";
import InternshipCard from "../Internships/InternshipCard";

const HomeFeed = ({
  getPosts,
  fetchInternships,
  posts: { posts, loading: postsLoading },
  internships: { items: internships, loading: internshipsLoading },
}) => {
  const [feedType, setFeedType] = useState("all"); // all, posts, internships

  useEffect(() => {
    getPosts();
    fetchInternships({ sort: "-date", limit: 10 });
  }, [getPosts, fetchInternships]);

  // Combine and sort posts and internships by date
  const getCombinedFeed = () => {
    const combined = [];

    // Add posts with type identifier
    if (posts && Array.isArray(posts)) {
      posts.forEach((post) => {
        combined.push({
          type: "post",
          data: post,
          date: new Date(post.date),
        });
      });
    }

    // Add internships with type identifier
    if (internships && Array.isArray(internships)) {
      internships.forEach((internship) => {
        combined.push({
          type: "internship",
          data: internship,
          date: new Date(internship.date),
        });
      });
    }

    // Sort by date (newest first)
    return combined.sort((a, b) => b.date - a.date);
  };

  const getFilteredFeed = () => {
    const combined = getCombinedFeed();
    
    if (feedType === "posts") {
      return combined.filter((item) => item.type === "post");
    } else if (feedType === "internships") {
      return combined.filter((item) => item.type === "internship");
    }
    
    return combined;
  };

  const filteredFeed = getFilteredFeed();
  const loading = postsLoading || internshipsLoading;

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Feed</h2>
            <p className="text-sm text-gray-600 mt-1">
              Latest posts and opportunities from the community
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-t pt-4">
          <button
            onClick={() => setFeedType("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              feedType === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <i className="fas fa-th-large mr-2"></i>
            All
          </button>
          <button
            onClick={() => setFeedType("posts")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              feedType === "posts"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <i className="fas fa-comments mr-2"></i>
            Posts ({posts?.length || 0})
          </button>
          <button
            onClick={() => setFeedType("internships")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              feedType === "internships"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <i className="fas fa-briefcase mr-2"></i>
            Opportunities ({internships?.length || 0})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading feed...</p>
        </div>
      )}

      {/* Feed Items */}
      {!loading && filteredFeed.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-inbox text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No content yet</h3>
          <p className="text-gray-600 mb-6">
            {feedType === "posts"
              ? "No posts have been shared yet. Be the first to post!"
              : feedType === "internships"
              ? "No internships available at the moment."
              : "No posts or internships to display."}
          </p>
        </div>
      )}

      {!loading &&
        filteredFeed.map((item, index) => (
          <div key={`${item.type}-${item.data._id}-${index}`}>
            {item.type === "post" ? (
              <PostItem post={item.data} />
            ) : (
              <InternshipCard internship={item.data} />
            )}
          </div>
        ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  internships: state.internships,
});

export default connect(mapStateToProps, { getPosts, fetchInternships })(
  HomeFeed
);
