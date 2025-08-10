import { Menu } from 'lucide-react';

const MobileHeader = ({ sidebarOpen, setSidebarOpen }) => (
  <div className="md:hidden relative z-10 p-4">
    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Split
          </span>
          <span className="text-gray-400 ml-1">Wise</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  </div>
);
export default MobileHeader;