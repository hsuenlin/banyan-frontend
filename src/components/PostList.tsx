import { useEffect, useState } from "react";
import { fetchPosts } from "@/utils/api";
import Post from "@/components/Post";

export interface PostType {
  content: string;
  username: string;
  time: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    fetchPosts().then((data) => setPosts(data));
  }, []);

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <Post 
          key={index} 
          content={post.content} 
          username={post.username} 
          time={post.time} 
        />
      ))}
    </div>
  );
}