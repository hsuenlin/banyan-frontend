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

// 修正 API_URL 的格式問題
const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
  : "https://banyan-api-production.up.railway.app";

// 範例貼文資料
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

/**
 * 取得貼文列表
 */
export async function fetchPosts(): Promise<Post[]> {
  try {
    console.log("嘗試從 API 獲取貼文:", `${API_URL}/posts`);
    
    const res = await fetch(`${API_URL}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 嘗試不同的模式解決 CORS 問題
      mode: 'cors',
    });
    
    if (!res.ok) {
      console.error(`API 回傳錯誤狀態: ${res.status}`);
      throw new Error(`API 回傳狀態: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("成功取得貼文:", data);
    return data;
  } catch (error) {
    console.warn('使用本地模擬資料, API 錯誤:', error);
    // 失敗時回傳模擬資料
    return MOCK_POSTS;
  }
}

/**
 * 建立新貼文
 */
export async function createPost(user_id: string, content: string): Promise<{ message: string }> {
  try {
    // 確保格式正確
    const payload = {
      content: content,
      user_id: user_id
    };
    
    console.log("嘗試發送貼文, 資料:", payload);
    console.log("目標 API 網址:", `${API_URL}/post`);
    
    // 改用 FormData 嘗試解決格式問題
    const formData = new FormData();
    formData.append('content', content);
    formData.append('user_id', user_id);
    
    // 嘗試兩種方式呼叫 API
    let response;
    try {
      // 方式 1: JSON 格式
      response = await fetch(`${API_URL}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch {
      console.log("JSON 方式失敗，嘗試 FormData 格式");
      // 方式 2: FormData 格式
      response = await fetch(`${API_URL}/post`, {
        method: 'POST',
        body: formData
      });
    }
    
    // 讀取回應文字，無論成功與否
    const responseText = await response.text();
    console.log(`API 回應 ${response.status}:`, responseText);
    
    if (!response.ok) {
      throw new Error(`API 回傳狀態: ${response.status}`);
    }
    
    // 嘗試解析 JSON 回應
    let responseJson;
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      console.warn("回應不是有效的 JSON 格式");
      responseJson = { message: "操作成功" };
    }
    
    return responseJson;
  } catch (error) {
    console.warn('使用本地模擬回應:', error);
    
    // 使用本地模擬資料
    const newPost = {
      id: `mock-${Date.now()}`,
      content,
      username: "測試使用者",
      time: "剛剛",
      user_id
    };
    
    // 添加到本地模擬貼文列表
    MOCK_POSTS.unshift(newPost);
    
    return { message: "發文成功！(本地模擬)" };
  }
}

/**
 * 獲取替代說法
 */
export async function rephraseContent(content: string): Promise<{ rephrased: string }> {
  try {
    console.log("嘗試獲取替代說法:", content);
    
    const res = await fetch(`${API_URL}/rephrase`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ content }),
    });
    
    if (!res.ok) {
      throw new Error(`API 回傳狀態: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("成功獲取替代說法:", data);
    return data;
  } catch (error) {
    console.warn('使用本地模擬替代說法:', error);
    
    // 使用本地替代說法功能
    return { rephrased: mockRephrase(content) };
  }
}

/**
 * 本地替代說法功能
 */
function mockRephrase(text: string): string {
  // 基本替換以模擬改寫
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