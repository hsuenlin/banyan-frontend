// src/pages/index.tsx
import { useState, useEffect } from "react";
import { useAuth } from "./_app";
import Head from "next/head";
import { fetchPosts, createPost, rephraseContent } from "@/utils/api";

type Post = {
  id: string;
  content: string;
  username: string;
  time: string;
  original_content?: string;
  rephrased_content?: string;
  isRephrased?: boolean;
  replies?: Post[];
  userId?: string;
};

export default function Home() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch posts when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !isAuthenticated) return;

    try {
      setIsLoading(true);
      await createPost(user?.id || "", newPostContent);
      setNewPostContent("");
      await loadPosts(); // Reload posts after submission
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRephrase = async (post: Post) => {
    // If we already have the rephrased content, just toggle it
    if (post.rephrased_content) {
      const updatedPosts = posts.map(p => 
        p.id === post.id ? { ...p, isRephrased: !p.isRephrased } : p
      );
      setPosts(updatedPosts);
      return;
    }
    
    // Otherwise, fetch the rephrased content
    try {
      setIsLoading(true);
      const response = await rephraseContent(post.content);
      
      const updatedPosts = posts.map(p => 
        p.id === post.id ? 
          { 
            ...p, 
            rephrased_content: response.rephrased,
            original_content: p.content,
            isRephrased: true 
          } : p
      );
      
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error rephrasing content:", error);
      setError("Failed to rephrase content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock login (in a real app, this would integrate with Google OAuth)
  const handleMockLogin = () => {
    login({
      id: "user-" + Math.random().toString(36).substring(2, 9),
      name: "測試使用者",
      email: "test@example.com"
    });
  };

  return (
    <>
      <Head>
        <title>Banyan 社群平台</title>
        <meta name="description" content="Banyan 社群平台 - 讓討論更理性" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container mx-auto max-w-3xl p-4">
        <div className="tabs flex border-b mb-6">
          <div className="tab py-2 px-4 border-b-2 border-black font-bold">
            {isAuthenticated ? "貼文頁面" : "登入頁面"}
          </div>
        </div>

        {!isAuthenticated ? (
          // Login Page
          <div className="login-page shadow-md border border-black p-8 flex flex-col items-center">
            <div className="login-box max-w-md w-full">
              <div className="flex justify-center mb-8">
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
                  <rect x="45" y="60" width="10" height="30" fill="#000000"/>
                  <circle cx="50" cy="35" r="25" fill="#000000"/>
                  <circle cx="30" cy="45" r="12" fill="#000000"/>
                  <circle cx="70" cy="45" r="12" fill="#000000"/>
                  <circle cx="40" cy="90" r="3" fill="#FFFFFF"/>
                  <circle cx="60" cy="90" r="3" fill="#FFFFFF"/>
                  <line x1="44" y1="90" x2="56" y2="90" stroke="#FFFFFF" strokeWidth="1"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-center mb-8">Banyan</h1>
              <button 
                onClick={handleMockLogin}
                className="w-full py-3 px-4 bg-yellow-400 border border-black flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-md transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 186.69 190.5">
                  <g transform="translate(1184.583 765.171)">
                    <path d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" fill="#4285f4"/>
                    <path d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" fill="#34a853"/>
                    <path d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.65-24.592 31.65-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" fill="#fbbc05"/>
                    <path d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.65 24.592c7.533-22.514 28.575-39.226 53.382-39.226z" fill="#ea4335"/>
                  </g>
                </svg>
                使用 Google 帳號登入
              </button>
            </div>
          </div>
        ) : (
          // Post Page
          <div className="post-page">
            {/* Post Compose */}
            <div className="post-compose border border-black shadow-md p-5 mb-8">
              <textarea 
                className="post-textarea w-full border border-black p-4 mb-4 min-h-[100px]"
                placeholder="分享你的想法..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              ></textarea>
              <div className="post-actions flex justify-end">
                <button 
                  className="bg-black text-white px-5 py-2 hover:translate-y-[-2px] hover:shadow-md transition-all"
                  onClick={handleSubmitPost}
                  disabled={isLoading}
                >
                  {isLoading ? "處理中..." : "發布"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
                {error}
                <button 
                  className="float-right"
                  onClick={() => setError("")}
                >
                  &times;
                </button>
              </div>
            )}

            {/* Post List */}
            <div className="post-list space-y-6">
              {isLoading && !posts.length ? (
                <div className="text-center py-8">載入中...</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">尚無貼文</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="post border border-black shadow-md p-5">
                    <div className="post-header flex justify-between mb-4">
                      <div className="post-header-left flex items-center">
                        <div className="post-avatar bg-purple-600 text-white w-10 h-10 flex items-center justify-center font-bold mr-3 border border-black">
                          {post.username.charAt(0)}
                        </div>
                        <div className="post-username font-bold">{post.username}</div>
                        <div className="post-time text-gray-500 text-sm ml-2">{post.time}</div>
                      </div>
                      <div className={`post-mode px-2 py-1 border border-black ${post.isRephrased ? "bg-teal-400" : ""}`}>
                        {post.isRephrased ? "替代說法" : "原文"}
                      </div>
                    </div>
                    
                    <div className="post-content mb-4">
                      {post.isRephrased && post.rephrased_content 
                        ? post.rephrased_content 
                        : post.content}
                    </div>
                    
                    <div className="post-footer flex gap-4">
                      <button 
                        className="rephrase-btn flex items-center gap-1 px-3 py-1 bg-teal-400 border border-black hover:translate-y-[-2px] hover:shadow-md transition-all"
                        onClick={() => handleToggleRephrase(post)}
                      >
                        換句話說
                      </button>
                      
                      <div className="post-action flex items-center gap-1 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>0</span>
                      </div>
                      
                      <div className="post-action flex items-center gap-1 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Logout Button */}
            <div className="mt-8 text-center">
              <button 
                onClick={logout}
                className="text-gray-500 hover:text-black"
              >
                登出
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}