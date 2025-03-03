// src/utils/api.ts
export interface Post {
  id: string;
  content: string;
  username: string;
  time: string;
  user_id?: string;
  rephrased_content?: string;
  isRephrased?: boolean;
}

// 确保 URL 使用 HTTPS 的辅助函数
function ensureHttps(url: string): string {
  const parsedUrl = new URL(url);
  parsedUrl.protocol = 'https:';
  return parsedUrl.toString();
}

// Fix the API_URL by ensuring it doesn't have a trailing slash and uses HTTPS
const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? ensureHttps(process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''))
  : "https://banyan-api-production.up.railway.app";

// LocalStorage Key for posts
const POSTS_STORAGE_KEY = 'banyan_posts';

// Initial example posts for first-time users
const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    content: "我認為目前的教育改革完全是在開倒車！把學生當成考試機器，老師只能照本宣科，完全違背教育的本質。這種方式只會扼殺創意，讓學生失去學習熱情。應該要立即停止這種愚蠢的政策！",
    username: "林小明",
    time: "2 小時前",
    user_id: "user-1"
  },
  {
    id: "2",
    content: "AI技術真的是讓人又愛又恨。一方面它能大幅提升工作效率，另一方面又讓很多人面臨被取代的危機。我覺得政府應該立法限制AI的發展，保護工作機會！否則未來只有科技巨頭賺錢，普通人將失業潦倒。",
    username: "陳小婷",
    time: "昨天",
    user_id: "user-2"
  }
];

// Helper function to load posts from localStorage
function getLocalPosts(): Post[] {
  if (typeof window === 'undefined') return INITIAL_POSTS;
  
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    return storedPosts ? JSON.parse(storedPosts) : INITIAL_POSTS;
  } catch (error) {
    console.error("Error loading posts from localStorage:", error);
    return INITIAL_POSTS;
  }
}

// Helper function to save posts to localStorage
function saveLocalPosts(posts: Post[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving posts to localStorage:", error);
  }
}

/**
 * Fetch posts from API or localStorage
 */
export async function fetchPosts(): Promise<Post[]> {
  try {
    console.log("Attempting to fetch posts from API:", `${API_URL}/posts`);
    
    const res = await fetch(ensureHttps(`${API_URL}/posts`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    
    if (!res.ok) {
      console.warn(`API returned error status: ${res.status}`);
      throw new Error(`API returned status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Successfully fetched posts from API:", data);
    
    // Update local storage with API data
    saveLocalPosts(data);
    
    return data;
  } catch (error) {
    console.warn('Using local storage posts, API error:', error);
    // Return posts from localStorage
    return getLocalPosts();
  }
}

/**
 * Create a new post
 */
export async function createPost(user_id: string, content: string): Promise<{ success: boolean }> {
  try {
    const payload = {
      content: content,
      user_id: user_id
    };
    
    console.log("Attempting to post, data:", payload);
    console.log("Target API URL:", `${API_URL}/post`);
    
    // Try with standard JSON format
    const response = await fetch(ensureHttps(`${API_URL}/post`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log("API post response:", responseData);
    
    // Add new post to local storage after API success
    const localPosts = getLocalPosts();
    const newPost: Post = {
      id: `${Date.now()}`,
      content,
      username: "You", // Better to pull from user context
      time: "Just now",
      user_id
    };
    saveLocalPosts([newPost, ...localPosts]);
    
    return { success: true };
  } catch (error) {
    console.warn('API error, using local storage only:', error);
    
    // Create post in local storage only
    const localPosts = getLocalPosts();
    const newPost: Post = {
      id: `local-${Date.now()}`,
      content,
      username: "You", // Better to pull from user context
      time: "Just now",
      user_id
    };
    
    saveLocalPosts([newPost, ...localPosts]);
    
    return { success: true };
  }
}

/**
 * Get rephrased content
 */
export async function rephraseContent(content: string): Promise<{ rephrased: string }> {
  try {
    console.log("Attempting to get rephrased content:", content);
    
    const res = await fetch(ensureHttps(`${API_URL}/rephrase`), {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ content }),
    });
    
    if (!res.ok) {
      throw new Error(`API returned status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Successfully got rephrased content:", data);
    return data;
  } catch (error) {
    console.warn('Using local rephrase function:', error);
    
    // Use local rephrase function
    return { rephrased: mockRephrase(content) };
  }
}

/**
 * Save rephrased content to local storage
 */
export function saveRephrasedContent(postId: string, rephrasedContent: string): void {
  const posts = getLocalPosts();
  const updatedPosts = posts.map(post => 
    post.id === postId 
      ? { ...post, rephrased_content: rephrasedContent }
      : post
  );
  saveLocalPosts(updatedPosts);
}

/**
 * Local rephrase function
 */
function mockRephrase(text: string): string {
  // Basic replacements to simulate rephrasing
  const replacements: Record<string, string> = {
    "完全是在開倒車": "可能未能達到理想效果",
    "把學生當成考試機器": "過於注重考試成績",
    "老師只能照本宣科": "老師教學自由度受限",
    "愚蠢的政策": "需要重新思考的政策",
    "限制AI的發展": "平衡科技發展與就業保障",
    "失業潦倒": "面臨就業轉型的挑戰",
    "立即停止": "建議重新評估",
    "只會扼殺創意": "可能會限制創意發展",
    "讓人又愛又恨": "帶來雙面影響",
    "只有科技巨頭賺錢": "需要確保技術發展成果能更廣泛地惠及社會",
    "完全違背教育的本質": "有違教育多元發展的理念",
    "!": "。",
    "！": "。"
  };
  
  let result = text;
  for (const [original, replacement] of Object.entries(replacements)) {
    result = result.replace(new RegExp(original, 'g'), replacement);
  }
  
  return result;
}

/**
 * Toggle the rephrased state of a post
 */
export function toggleRephrasedState(postId: string, isRephrased: boolean): void {
  const posts = getLocalPosts();
  const updatedPosts = posts.map(post => 
    post.id === postId 
      ? { ...post, isRephrased }
      : post
  );
  saveLocalPosts(updatedPosts);
}