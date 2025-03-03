import { useState } from "react";
import { rephraseContent } from "@/utils/api";

interface RephraseToggleProps {
  originalText: string;
}

export default function RephraseToggle({ originalText }: RephraseToggleProps) {
  const [text, setText] = useState<string>(originalText);
  const [isRephrased, setIsRephrased] = useState<boolean>(false);

  const handleRephrase = async () => {
    if (!isRephrased) {
      const response = await rephraseContent(originalText);
      setText(response.rephrased);
      
      // 更新狀態標籤
      const postMode = document.getElementById("post-mode");
      if (postMode) {
        postMode.textContent = "替代說法";
        postMode.className = "text-xs py-1 px-2 border border-black bg-[#E0E0E0]";
      }
    } else {
      setText(originalText);
      
      // 更新狀態標籤
      const postMode = document.getElementById("post-mode");
      if (postMode) {
        postMode.textContent = "原文";
        postMode.className = "text-xs py-1 px-2 border border-black bg-white";
      }
    }
    setIsRephrased(!isRephrased);
  };

  return (
    <div>
      <p className="mb-4">{text}</p>
      <button 
        onClick={handleRephrase} 
        className="flex items-center mr-4 py-1 px-3 text-sm bg-[#4ECDC4] border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        {isRephrased ? "切換回原文" : "換句話說"}
      </button>
    </div>
  );
}