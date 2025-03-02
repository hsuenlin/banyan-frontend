export default function PostForm(): JSX.Element {
    return (
      <div className="p-4 border shadow-md">
        <textarea className="w-full p-2 border" placeholder="發表你的想法..."></textarea>
        <button className="mt-3 bg-black text-white px-4 py-2">發布</button>
      </div>
    );
  }
  