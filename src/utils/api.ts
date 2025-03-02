// src/utils/api.ts
export interface Post {
  id: string;
  content: string;
  username: string;
  time: string;
  user_id?: string;
}

// Fix the API_URL by ensuring it doesn't have a trailing slash
const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
  : "https://banyan-api-production.up.railway.app";

// For testing when API has CORS issues
const MOCK_POSTS: Post[] = [
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

export async function fetchPosts(): Promise<Post[]> {
  try {
    // Try to fetch from the real API
    const res = await fetch(`${API_URL}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`API returned status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    // Return mock data if the API call fails
    return MOCK_POSTS;
  }
}

export async function createPost(user_id: string, content: string): Promise<{ message: string }> {
  try {
    // Try to fetch from the real API
    console.log("Posting with payload:", { user_id, content });
    
    const res = await fetch(`${API_URL}/post`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ user_id, content }),
    });
    
    // Even if the response isn't ok, let's log what came back
    const responseText = await res.text();
    console.log(`API response ${res.status}:`, responseText);
    
    if (!res.ok) {
      throw new Error(`API returned status: ${res.status}`);
    }
    
    // Try to parse response as JSON
    let responseJson;
    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      console.warn("Response wasn't valid JSON");
      responseJson = { message: "操作成功" };
    }
    
    return responseJson;
  } catch (error) {
    console.warn('Using mock response for createPost:', error);
    // Simulate successful post creation with mock data
    const newPost = {
      id: `mock-${Date.now()}`,
      content,
      username: "測試使用者",
      time: "剛剛",
      user_id
    };
    
    // Add to the beginning of the mock posts array
    MOCK_POSTS.unshift(newPost);
    
    // Return success response
    return { message: "發文成功！(本地模擬)" };
  }
}

export async function rephraseContent(content: string): Promise<{ rephrased: string }> {
  try {
    const res = await fetch(`${API_URL}/rephrase`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ content }),
    });
    
    if (!res.ok) {
      throw new Error(`API returned status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.warn('Using mock rephrase function:', error);
    // Simple mock rephrase function
    return { 
      rephrased: mockRephrase(content)
    };
  }
}

// Mock function to simulate rephrasing
function mockRephrase(text: string): string {
  // Some basic replacements to make the text more polite and rational
  return text
    .replace(/完全是在開倒車/g, '可能未能達到理想效果')
    .replace(/把學生當成考試機器/g, '過於注重考試成績')
    .replace(/愚蠢的政策/g, '需要重新思考的政策')
    .replace(/限制AI的發展/g, '平衡科技發展與就業保障')
    .replace(/失業潦倒/g, '面臨就業轉型的挑戰')
    .replace(/!+/g, '。')
    .replace(/！+/g, '。')
    .replace(/立即停止/g, '建議重新評估')
    .replace(/只會扼殺創意/g, '可能會限制創意發展')
    .replace(/讓人又愛又恨/g, '帶來雙面影響')
    .replace(/只有科技巨頭賺錢/g, '需要確保技術發展成果能更廣泛地惠及社會');
}