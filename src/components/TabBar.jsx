const TabBar = ({ activeTab, setActiveTab, menuItems }) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-white/10">
    <div className="grid grid-cols-4">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 p-3 transition-all duration-300 ${
            activeTab === item.id 
              ? 'text-white bg-white/10' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <item.icon size={20} />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default TabBar;