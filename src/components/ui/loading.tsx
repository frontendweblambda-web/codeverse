import { SiFeedly } from "react-icons/si";

export default function PageLoader() {
  return (
    <div className="fixed bg-slate-900 inset-0 z-50 flex items-center justify-center text-white backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 text-gray-700">
        <SiFeedly className="animate-spin text-4xl text-white" />
        <span className="text-sm text-white font-medium">Loading...</span>
      </div>
    </div>
  );
}
