const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface Post {
  content: string;
  username: string;
  time: string;
}

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts/`);
  return res.json();
}

export async function createPost(user_id: string, content: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/post/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, content }),
  });
  return res.json();
}

export async function rephraseContent(content: string): Promise<{ rephrased: string }> {
  const res = await fetch(`${API_URL}/rephrase/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.json();
}
