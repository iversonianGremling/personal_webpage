// A detail page for a specific tag containing all posts with that tag
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../types";
import PostCard from "./PostCard";
import NavBar from "./NavBar";
import BackgroundText from "./BackgroundText";
import { apiUrl } from "../assets/env-var";

export const TagDetail: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const { tag } = useParams<{ tag: string }>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(apiUrl + `/posts/tag/${tag}`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [tag]);

  return (
    <div>
      <NavBar />
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Back
      </button>
      {isMobile ? "" : <BackgroundText text={tag} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            date={post.date}
            tags={post.tags}
            type="blog"
          />
        ))}
      </div>
    </div>
  );
};
