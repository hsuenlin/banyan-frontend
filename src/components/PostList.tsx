import { useEffect, useState } from "react";
import { fetchPosts } from "@/utils/api";
import Post from "@/components/Post";

export interface PostType {
  content: string;
  username: string;
  time: string;
}

export default function PostList(): JSX.Element {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    fetchPosts().then((data) => setPosts(data));
  }, []);

  return (
    <div>
      {posts.map((post, index) => (
        <Post key={index} content={post.content} username={post.username} time={post.time} />
      ))}
    </div>
  );
}
