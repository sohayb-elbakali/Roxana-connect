'use client';

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getPosts } from "../../lib/redux/modules/posts";
import { fetchInternships } from "../../lib/redux/modules/internships";
import PostItem from "../Posts/PostItem";
import InternshipCard from "../Internships/InternshipCard";

const HomeFeed = ({
  getPosts,
  fetchInternships,
  posts: { posts, loading: postsLoading },
  internships: { items: internships, loading: internshipsLoading },
}) => {
  const [feedType, setFeedType] = useState("all");

  useEffect(() => {
    getPosts();
    fetchInternships({ sort: "-date", limit: 10 });
  }, [getPosts, fetchInternships]);

  const getCombinedFeed = () => {
    const combined = [];

    if (posts && Array.isArray(posts)) {
      posts.forEach((post) => {
        combined.push({
          type: "post",
          data: post,
          date: new Date(post.date),
        });
      });
    }

    if (internships && Array.isArray(internships)) {
      internships.forEach((internship) => {
        combined.push({
          type: "internship",
          data: internship,
          date: new Date(internship.date),
        });
      });
    }

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

  const tabs = [
    { id: "all", label: "All", icon: "fa-th-large" },
    { id: "posts", label: "Posts", count: posts?.length || 0, icon: "fa-comments" },
    { id: "internships", label: "Jobs", count: internships?.length || 0, icon: "fa-briefcase" }
  ];

  return (
    <div className="space-y-4">
      {/* Feed Header */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Feed</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Latest from the community
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <i className="fas fa-rss text-blue-600"></i>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-5 pb-4 pt-3 bg-gray-50 border-t border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFeedType(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${feedType === tab.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              <i className={`fas ${tab.icon} text-xs`}></i>
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${feedType === tab.id ? "bg-white/20" : "bg-gray-100"
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4 font-medium">Loading your feed...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFeed.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-inbox text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {feedType === "posts" ? "No posts yet" : feedType === "internships" ? "No opportunities yet" : "Feed is empty"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {feedType === "posts"
              ? "Be the first to share something with the community!"
              : feedType === "internships"
                ? "Check back later for new opportunities."
                : "Content will appear here as people post."}
          </p>
          {feedType !== "internships" && (
            <a href="/posts" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
              <i className="fas fa-plus"></i>
              Create First Post
            </a>
          )}
        </div>
      )}

      {/* Feed Items */}
      {!loading && filteredFeed.length > 0 && (
        <div className="space-y-4">
          {filteredFeed.map((item, index) => (
            <div key={`${item.type}-${item.data._id}-${index}`}>
              {item.type === "post" ? (
                <PostItem post={item.data} />
              ) : (
                <InternshipCard internship={item.data} />
              )}
            </div>
          ))}
        </div>
      )}
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
