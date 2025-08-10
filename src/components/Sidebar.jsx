import { X, RefreshCw } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, menuItems, participants, expenses, clearAllData, formatCurrency }) => (
  <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${sidebarOpen ? 'visible' : 'invisible'}`}>
    <div
      className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={() => setSidebarOpen(false)}
    />
    <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-md border-l border-white/10 transition-transform duration-300 ${
      sidebarOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                Expense
            </span>
            <span className="text-gray-400 ml-1">Splitter</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-white/10 text-white border border-white/20' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 p-4 bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl">
          <h3 className="text-white font-semibold mb-2">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Participants</span>
              <span>{participants.length}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Expenses</span>
              <span>{expenses.length}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Total Amount</span>
              <span>{formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}</span>
            </div>
          </div>
          {expenses.length > 0 && (
            <button
              onClick={() => {
                clearAllData();
                setSidebarOpen(false);
              }}
              className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg font-medium hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw size={14} />
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);
export default Sidebar;