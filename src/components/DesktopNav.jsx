

const DesktopNav = ({ activeTab, setActiveTab, menuItems }) => (
  <div className="hidden md:block relative z-50 w-full">
    <nav className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900/90 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-4 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              <span className="text-white">Expense</span>
              <span className="text-gray-300 ml-1">Splitter</span>
            </div>
            <div className="flex space-x-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 relative group font-medium ${
                    activeTab === item.id 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
);
export default DesktopNav;