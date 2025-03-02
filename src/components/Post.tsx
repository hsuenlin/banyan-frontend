import RephraseToggle from "@/components/RephraseToggle";

interface PostProps {
  content: string;
  username: string;
  time: string;
}

export default function Post({ content, username, time }: PostProps): JSX.Element {
  return (
    <div className="p-4 border shadow-md mb-4">
      <div className="flex justify-between">
        <div>{username}</div>
        <div>{time}</div>
      </div>
      <RephraseToggle originalText={content} />
    </div>
  );
}
