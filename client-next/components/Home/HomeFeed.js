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
    <div className="space-y-5">
      {/* Feed Header */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100/50">
        <div className="p-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Feed</h2>
              <p className="text-sm text-gray-500 mt-1">
                Latest from the community
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
              <i className="fas fa-rss text-blue-600 text-lg"></i>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-6 pb-5 pt-4 bg-gradient-to-b from-gray-50/50 to-transparent border-t border-gray-100/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFeedType(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:cursor-pointer ${feedType === tab.id
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/50 shadow-sm hover:shadow"
                }`}
            >
              <i className={`fas ${tab.icon} text-xs`}></i>
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${feedType === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-16">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-5 font-semibold">Loading your feed...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFeed.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <i className="fas fa-inbox text-gray-400 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {feedType === "posts" ? "No posts yet" : feedType === "internships" ? "No opportunities yet" : "Feed is empty"}
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            {feedType === "posts"
              ? "Be the first to share something with the community!"
              : feedType === "internships"
                ? "Check back later for new opportunities."
                : "Content will appear here as people post."}
          </p>
          {feedType !== "internships" && (
            <a href="/posts" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg hover:cursor-pointer hover:scale-105 transform">
              <i className="fas fa-plus"></i>
              Create First Post
            </a>
          )}
        </div>
      )}

      {/* Feed Items */}
      {!loading && filteredFeed.length > 0 && (
        <div className="space-y-5">
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
