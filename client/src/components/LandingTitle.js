import React, { useEffect, useState } from "react";

const TITLES = [
  "Discover internship opportunities shared by your trusted network",
  "Track your applications and manage deadlines in one place",
  "Share insights and collaborate with friends on your internship journey",
];

const LandingTitle = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    let timeout = null;
    let titleInterval = null;
    titleInterval = setInterval(() => {
      const index = (titleIndex + 1) % TITLES.length;
      setTitleIndex(index);
      setFadeIn(true);
      timeout = setTimeout(() => {
        setFadeIn(false);
      }, 2000);
    }, 4000);

    timeout = setTimeout(() => {
      setFadeIn(false);
    }, 2000);

    return function cleanup() {
      clearInterval(titleInterval);
      clearTimeout(timeout);
    };
  }, [titleIndex]);

  return (
    <p className={fadeIn ? "title-fade-in" : "title-fade-out"}>
      {TITLES[titleIndex]}
    </p>
  );
};

export default LandingTitle;
