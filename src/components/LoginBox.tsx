export default function LoginBox() {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-6 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-center mb-6">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
          <rect x="45" y="60" width="10" height="30" fill="#000000"/>
          <circle cx="50" cy="35" r="25" fill="#000000"/>
          <circle cx="30" cy="45" r="12" fill="#000000"/>
          <circle cx="70" cy="45" r="12" fill="#000000"/>
          <circle cx="40" cy="90" r="3" fill="#FFFFFF"/>
          <circle cx="60" cy="90" r="3" fill="#FFFFFF"/>
          <line x1="44" y1="90" x2="56" y2="90" stroke="#FFFFFF" strokeWidth="1"/>
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-6">Banyan</h1>
      <button className="flex items-center gap-2 py-3 px-6 bg-[#FFD166] border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 186.69 190.5">
          <g transform="translate(1184.583 765.171)">
            <path d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" fill="#4285f4"/>
            <path d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" fill="#34a853"/>
            <path d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.65-24.592 31.65-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" fill="#fbbc05"/>
            <path d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.65 24.592c7.533-22.514 28.575-39.226 53.382-39.226z" fill="#ea4335"/>
          </g>
        </svg>
        使用 Google 帳號登入
      </button>
    </div>
  );
}