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

// Ensure URL uses HTTPS and remove trailing slashes with more aggressive handling
function cleanAndSecureUrl(url: string): string {
  try {
    // Remove any existing protocol and ensure HTTPS
    const cleanedUrl = url.trim().replace(/^https?:\/\//, '');
    return `https://${cleanedUrl.replace(/\/$/, '')}`;
  } catch (error) {
    console.error('URL parsing error:', error);
    return `https://${url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  }
}

// Fix the API_URL by ensuring it's a clean HTTPS URL
const API_URL = cleanAndSecureUrl(
  process.env.NEXT_PUBLIC_API_URL || "banyan-api-production.up.railway.app"
);

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
    const baseUrl = cleanAndSecureUrl(
      process.env.NEXT_PUBLIC_API_URL || "banyan-api-production.up.railway.app"
    );
    const url = `${baseUrl}/posts`;
    
    console.log("Constructed HTTPS URL:", url);
    console.log("Original API_URL:", process.env.NEXT_PUBLIC_API_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
    
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log("Fetch response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API error: ${res.status} - ${errorText}`);
        throw new Error(`API returned status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Successfully fetched API data:", data);
      
      saveLocalPosts(data);
      
      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch specific error:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('Complete fetch error:', error);
    console.warn('Falling back to local storage posts');
    return getLocalPosts();
  }
}

/**
 * Create a new post
 */
export async function createPost(user_id: string, content: string): Promise<{ success: boolean }> {
  try {
    const baseUrl = cleanAndSecureUrl(
      process.env.NEXT_PUBLIC_API_URL || "banyan-api-production.up.railway.app"
    );
    const url = `${baseUrl}/post`;
    
    const payload = {
      content: content,
      user_id: user_id
    };
    
    console.log("Create post URL:", url);
    console.log("Payload:", payload);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Post creation error: ${response.status} - ${errorText}`);
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log("Post creation response:", responseData);
      
      // Add new post to local storage
      const localPosts = getLocalPosts();
      const newPost: Post = {
        id: `${Date.now()}`,
        content,
        username: "You",
        time: "Just now",
        user_id
      };
      saveLocalPosts([newPost, ...localPosts]);
      
      return { success: true };
    } catch (postError) {
      clearTimeout(timeoutId);
      console.error('Post creation error:', postError);
      
      // Fallback to local storage
      const localPosts = getLocalPosts();
      const newPost: Post = {
        id: `local-${Date.now()}`,
        content,
        username: "You",
        time: "Just now",
        user_id
      };
      
      saveLocalPosts([newPost, ...localPosts]);
      
      return { success: true };
    }
  } catch (error) {
    console.error('Overall post creation error:', error);
    return { success: false };
  }
}

/**
 * Get rephrased content
 */
export async function rephraseContent(content: string): Promise<{ rephrased: string }> {
  try {
    const baseUrl = cleanAndSecureUrl(
      process.env.NEXT_PUBLIC_API_URL || "banyan-api-production.up.railway.app"
    );
    const url = `${baseUrl}/rephrase`;
    
    console.log("Rephrase URL:", url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ content }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Rephrase error: ${res.status} - ${errorText}`);
        throw new Error(`API returned status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Successfully got rephrased content:", data);
      return data;
    } catch (rephraseError) {
      clearTimeout(timeoutId);
      console.error('Rephrase fetch error:', rephraseError);
      
      // Fallback to local rephrase
      return { rephrased: mockRephrase(content) };
    }
  } catch (error) {
    console.error('Overall rephrase error:', error);
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