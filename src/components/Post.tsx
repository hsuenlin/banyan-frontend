import RephraseToggle from "@/components/RephraseToggle";

interface PostProps {
  content: string;
  username: string;
  time: string;
}

export default function Post({ content, username, time }: PostProps) {
  return (
    <div className="p-4 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center bg-[#6B5CA5] text-white border border-black mr-3">
            {username.charAt(0)}
          </div>
          <div className="font-bold">{username}</div>
          <div className="text-gray-500 text-sm ml-2">{time}</div>
        </div>
        <div id="post-mode" className="text-xs py-1 px-2 border border-black bg-white">
          原文
        </div>
      </div>
      <RephraseToggle originalText={content} />
    </div>
  );
}