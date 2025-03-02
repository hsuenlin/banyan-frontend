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
    } else {
      setText(originalText);
    }
    setIsRephrased(!isRephrased);
  };

  return (
    <div>
      <p>{text}</p>
      <button onClick={handleRephrase} className="rephrase-btn mt-2">
        {isRephrased ? "切換回原文" : "換句話說"}
      </button>
    </div>
  );
}
