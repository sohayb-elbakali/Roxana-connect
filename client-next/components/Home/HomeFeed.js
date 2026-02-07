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
  const [sortBy, setSortBy] = useState("recent"); // recent, popular, deadline

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
          likes: post.likes?.length || 0,
        });
      });
    }

    if (internships && Array.isArray(internships)) {
      internships.forEach((internship) => {
        combined.push({
          type: "internship",
          data: internship,
          date: new Date(internship.date),
          likes: internship.likes?.length || 0,
          deadline: internship.applicationDeadline ? new Date(internship.applicationDeadline) : null,
        });
      });
    }

    return combined;
  };

  const getSortedFeed = (feed) => {
    const sorted = [...feed];
    
    switch (sortBy) {
      case "popular":
        return sorted.sort((a, b) => b.likes - a.likes);
      case "deadline":
        // Only for internships, sort by deadline
        return sorted.sort((a, b) => {
          if (a.type === "internship" && b.type === "internship") {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return a.deadline - b.deadline;
          }
          return b.date - a.date;
        });
      case "recent":
      default:
        return sorted.sort((a, b) => b.date - a.date);
    }
  };

  const getFilteredFeed = () => {
    const combined = getCombinedFeed();

    if (feedType === "posts") {
      return getSortedFeed(combined.filter((item) => item.type === "post"));
    } else if (feedType === "internships") {
      return getSortedFeed(combined.filter((item) => item.type === "internship"));
    }

    return getSortedFeed(combined);
  };

  const filteredFeed = getFilteredFeed();
  const loading = postsLoading || internshipsLoading;

  const tabs = [
    { id: "all", label: "All", icon: "fa-th-large" },
    { id: "posts", label: "Posts", count: posts?.length || 0, icon: "fa-comments" },
    { id: "internships", label: "Jobs", count: internships?.length || 0, icon: "fa-briefcase" }
  ];

  const sortOptions = [
    { id: "recent", label: "Recent", icon: "fa-clock" },
    { id: "popular", label: "Popular", icon: "fa-fire" },
    { id: "deadline", label: "Deadline", icon: "fa-calendar", onlyFor: "internships" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Feed Header */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100/50">
        <div className="p-4 sm:p-6 pb-4 sm:pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Your Feed</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Latest from the community
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm">
              <i className="fas fa-rss text-blue-600 text-base sm:text-lg"></i>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 pb-3 sm:pb-4 pt-2 sm:pt-3 bg-gradient-to-b from-gray-50/50 to-transparent border-t border-gray-100/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFeedType(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 hover:cursor-pointer whitespace-nowrap ${feedType === tab.id
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/50 shadow-sm hover:shadow"
                }`}
            >
              <i className={`fas ${tab.icon} text-[10px] sm:text-xs`}></i>
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold ${feedType === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 pb-4 sm:pb-5 overflow-x-auto">
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap mr-1">Sort by:</span>
          {sortOptions
            .filter(option => !option.onlyFor || feedType === option.onlyFor || feedType === "all")
            .map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:cursor-pointer whitespace-nowrap ${sortBy === option.id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                <i className={`fas ${option.icon} text-[10px]`}></i>
                {option.label}
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
        <div className="space-y-4 sm:space-y-5">
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
