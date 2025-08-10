import { DollarSign, Users, Calculator, User, ArrowRight, RefreshCw, PieChart, ArrowDown } from 'lucide-react';

const Results = ({ expenses, participants, clearAllData, formatCurrency, calculateBalances, optimizeTransactions, getParticipantName }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <PieChart size={48} className="mx-auto mb-4 opacity-50" />
        <p className="px-4 text-sm sm:text-base">Add some expenses to see the settlement results</p>
      </div>
    );
  }

  const balances = calculateBalances();
  const transactions = optimizeTransactions();
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header section - mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Settlement Results
        </h2>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-sm text-gray-400">
            Total: {formatCurrency(totalAmount)}
          </div>
          <button
            onClick={clearAllData}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 text-white px-4 py-2 rounded-xl font-medium hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm touch-manipulation"
          >
            <RefreshCw size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* Stats cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 sm:p-6 text-center">
          <DollarSign size={24} className="mx-auto mb-2 text-gray-400" />
          <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-xl sm:text-2xl font-bold">
            {formatCurrency(totalAmount)}
          </div>
          <div className="text-gray-400 text-sm">Total Expenses</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 sm:p-6 text-center">
          <Users size={24} className="mx-auto mb-2 text-gray-400" />
          <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-xl sm:text-2xl font-bold">
            {participants.length}
          </div>
          <div className="text-gray-400 text-sm">Participants</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 sm:p-6 text-center">
          <Calculator size={24} className="mx-auto mb-2 text-gray-400" />
          <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-xl sm:text-2xl font-bold">
            {transactions.length}
          </div>
          <div className="text-gray-400 text-sm">Transactions</div>
        </div>
      </div>

      {/* Individual Balances */}
      <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Individual Balances</h3>
        <div className="space-y-3">
          {Object.entries(balances).map(([id, balance]) => (
            <div key={id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-white font-medium truncate">{getParticipantName(parseInt(id))}</span>
              </div>
              <div className={`font-bold text-sm sm:text-base flex-shrink-0 ml-2 ${balance > 0.01 ? 'text-green-400' : balance < -0.01 ? 'text-red-400' : 'text-gray-400'}`}>
                {balance > 0.01 ? '+' : ''}{formatCurrency(balance)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimized Settlements - Mobile Responsive */}
      {transactions.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Optimized Settlements</h3>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={index} className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
                {/* Mobile: Stack vertically, Desktop: Side by side */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  
                  {/* Transaction flow */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-1">
                    
                    {/* From person */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" />
                      </div>
                      <span className="text-white font-medium truncate flex-1 sm:flex-none text-center sm:text-left">
                        {getParticipantName(transaction.from)}
                      </span>
                    </div>
                    
                    {/* Arrow - horizontal on desktop, vertical on mobile */}
                    <div className="flex items-center justify-center flex-shrink-0">
                      <ArrowRight size={20} className="text-gray-400 hidden sm:block" />
                      <ArrowDown size={20} className="text-gray-400 block sm:hidden" />
                    </div>
                    
                    {/* To person */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" />
                      </div>
                      <span className="text-white font-medium truncate flex-1 sm:flex-none text-center sm:text-left">
                        {getParticipantName(transaction.to)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent font-bold text-lg sm:text-xl text-center sm:text-right flex-shrink-0">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settlement tip */}
      <div className="bg-gradient-to-br from-yellow-900/20 via-yellow-800/20 to-orange-900/20 border border-yellow-700/30 rounded-xl p-4">
        <p className="text-yellow-300 text-sm font-medium mb-1">💡 Settlement Complete?</p>
        <p className="text-yellow-200/70 text-xs sm:text-sm">
          Once everyone has settled their debts, use the "Clear All" button above to start fresh with a new expense group.
        </p>
      </div>
    </div>
  );
};

export default Results;