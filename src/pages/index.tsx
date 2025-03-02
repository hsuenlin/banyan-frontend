import { useState } from "react";
import Header from "@/components/Header";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import LoginBox from "@/components/LoginBox";

type Tab = "posts" | "login";

export default function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  return (
    <div>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "posts" ? (
        <>
          <PostForm />
          <PostList />
        </>
      ) : (
        <LoginBox />
      )}
    </div>
  );
}