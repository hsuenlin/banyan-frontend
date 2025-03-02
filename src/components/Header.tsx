import React from "react";

interface HeaderProps {
  activeTab: "posts" | "login";
  setActiveTab: React.Dispatch<React.SetStateAction<"posts" | "login">>;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <div className="flex border-b">
      <button
        className={`p-4 ${activeTab === "login" ? "font-bold border-b-2" : ""}`}
        onClick={() => setActiveTab("login")}
      >
        登入
      </button>
      <button
        className={`p-4 ${activeTab === "posts" ? "font-bold border-b-2" : ""}`}
        onClick={() => setActiveTab("posts")}
      >
        貼文
      </button>
    </div>
  );
}
