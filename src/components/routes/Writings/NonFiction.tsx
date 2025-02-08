import React, { useEffect, useState } from "react";
import "../../../assets/styles/non-fiction.css";
import NavBar from "../../NavBar";
import PostCard from "../../PostCard";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../assets/env-var";
import insideIntestineImage from "../../../assets/images/inside_intestine.webp";

type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

const NonFiction: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(apiUrl + "/posts/tag/non-fiction");
      const data = await response.json();
      console.log(data);
      setPosts(data);
    };
    fetchPosts();
  });

  return (
    <>
      <NavBar />
      <div className="container-non-fiction">
        <img
          src={insideIntestineImage}
          alt="nonfiction"
          className="nonfiction-image"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        />
        <button
          onClick={() => navigate(-1)}
          className="back-button-non-fiction"
          style={{
            position: "fixed",
            top: "90px",
            left: "15px",
          }}
        >
          {Array.from("Return  to  my  body").map((char, index) => {
            if (char === " ") {
              return <span key={index}>&nbsp;</span>;
            } else {
              return (
                <span
                  key={index}
                  className="wobble-letter"
                  style={
                    {
                      "--char-index": index,
                      "--random-x": Math.random() * 0.5,
                      "--random-y": Math.random() * 0.5,
                      "--random-duration": `${Math.random() + 1}s`,
                    } as React.CSSProperties
                  }
                >
                  {char}
                </span>
              );
            }
          })}
        </button>
        <div
          className={`${isMobile ? "text-6xl" : "text-9xl"} header-non-fiction wobble-letter`}
          style={
            {
              "--random-x": Math.random() * 0.5 + 1,
              "--random-y": Math.random() * 0.5 + 1,
              "--random-duration": `${Math.random() * 1 + 1}s`,
              cursor: "default",
            } as React.CSSProperties
          }
        >
          NonFiction
        </div>
        <div className="posts-container-non-fiction">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              date={post.date}
              tags={post.tags}
              type="blog"
              variant="nonFiction"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default NonFiction;
