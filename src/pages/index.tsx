// src/pages/index.tsx
import { useState, useEffect } from "react";
import { useAuth } from "./_app";
import Head from "next/head";
import { fetchPosts, createPost, rephraseContent, Post as PostType } from "@/utils/api";

export default function Home() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 當組件載入和登入狀態改變時獲取貼文
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  // 獲取貼文列表
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("獲取貼文時出錯:", error);
      setError("無法載入貼文。請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  // 處理發布新貼文
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !isAuthenticated) return;

    try {
      setIsLoading(true);
      setError("");
      
      const result = await createPost(user?.id || "", newPostContent);
      console.log("發文結果:", result);
      
      // 顯示成功訊息
      setSuccess(result.message || "發文成功！");
      setTimeout(() => setSuccess(""), 3000); // 3秒後消失
      
      // 清空輸入框
      setNewPostContent("");
      
      // 在本地貼文列表中新增該貼文而不重新載入
      const newPost: PostType = {
        id: `local-${Date.now()}`,
        content: newPostContent,
        username: user?.name || "測試使用者",
        time: "剛剛",
        user_id: user?.id
      };
      
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("發布貼文時出錯:", error);
      setError("發布貼文失敗。請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  // 處理替代說法切換
  const handleToggleRephrase = async (post: PostType) => {
    // 如果已經有替代說法內容，只需切換顯示
    if (post.rephrased_content) {
      const updatedPosts = posts.map(p => 
        p.id === post.id ? { ...p, isRephrased: !p.isRephrased } : p
      );
      setPosts(updatedPosts);
      return;
    }
    
    // 否則，獲取替代說法
    try {
      setIsLoading(true);
      const response = await rephraseContent(post.content);
      
      const updatedPosts = posts.map(p => 
        p.id === post.id ? 
          { 
            ...p, 
            rephrased_content: response.rephrased,
            isRephrased: true 
          } : p
      );
      
      setPosts(updatedPosts);
    } catch (error) {
      console.error("獲取替代說法時出錯:", error);
      setError("無法獲取替代說法。請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  // 模擬登入（實際應用中會使用 Google OAuth）
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
      </Head>

      <div className="container mx-auto max-w-3xl p-4">
        <div className="tabs flex border-b mb-6">
          <div className="tab py-2 px-4 border-b-2 border-black font-bold">
            {isAuthenticated ? "貼文頁面" : "登入頁面"}
          </div>
        </div>

        {!isAuthenticated ? (
          // 登入頁面
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
              <div className="mt-4 text-sm text-gray-500 max-w-xs mx-auto">
                <strong>注意：</strong> 這是模擬登入，目前尚未連接真正的 Google 帳號驗證服務。
              </div>
            </div>
          </div>
        ) : (
          // 貼文頁面
          <div className="post-page">
            {/* 發文區域 */}
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

            {/* 成功訊息 */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded relative">
                <span className="block sm:inline">{success}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccess("")}>
                  <svg className="fill-current h-6 w-6 text-green-500" role="button" viewBox="0 0 20 20">
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </span>
              </div>
            )}

            {/* 錯誤訊息 */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded relative">
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError("")}>
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20">
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </span>
              </div>
            )}

            {/* 貼文列表 */}
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
                          {post.username?.charAt(0) || 'U'}
                        </div>
                        <div className="post-username font-bold">{post.username}</div>
                        <div className="post-time text-gray-500 text-sm ml-2">{post.time}</div>
                      </div>
                      <div className={`post-mode border border-black p-1 px-2 text-sm ${
                        post.isRephrased 
                          ? "bg-teal-500 text-white font-bold" 
                          : "bg-white"
                      }`}>
                        {post.isRephrased ? "替代說法" : "原文"}
                      </div>
                    </div>
                    
                    {/* 貼文內容 */}
                    {post.isRephrased && post.rephrased_content ? (
                      <div className="post-content mb-4">
                        <div className="original-content opacity-50 mb-2 line-through">
                          <div className="text-xs text-gray-500 font-bold mb-1">原文：</div>
                          {post.content}
                        </div>
                        <div className="rephrased-content bg-teal-50 p-3 border-l-4 border-teal-500 rounded">
                          <div className="text-xs text-teal-700 font-bold mb-1">替代說法：</div>
                          <div className="text-teal-800">
                            {post.rephrased_content}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="post-content mb-4">
                        {post.content}
                      </div>
                    )}
                    
                    {/* 貼文操作 */}
                    <div className="post-footer flex gap-4">
                      <button 
                        className={`flex items-center gap-1 px-3 py-1 border border-black hover:translate-y-[-2px] hover:shadow-md transition-all ${
                          post.isRephrased 
                            ? "bg-white" 
                            : "bg-teal-400"
                        }`}
                        onClick={() => handleToggleRephrase(post)}
                      >
                        {post.isRephrased ? "查看原文" : "換句話說"}
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

            {/* 登出按鈕 */}
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