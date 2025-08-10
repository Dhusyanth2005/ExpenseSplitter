import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Plus, 
  Users, 
  CreditCard, 
  Calculator, 
  Settings, 
  Home,
  Trash2,
  ArrowRight,
  DollarSign,
  User,
  Receipt,
  TrendingUp,
  PieChart,
  RefreshCw
} from 'lucide-react';

const ExpenseSplitter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Form states
  const [participantName, setParticipantName] = useState('');
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    payer: ''
  });

  useEffect(() => {
    setIsLoaded(true);
    loadData();
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Only save data if we have participants or expenses to avoid overwriting with empty arrays on initial load
    if (participants.length > 0 || expenses.length > 0) {
      saveData();
    }
  }, [participants, expenses]);

  const loadData = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedParticipants = localStorage.getItem('expense-splitter-participants');
        const savedExpenses = localStorage.getItem('expense-splitter-expenses');
        
        if (savedParticipants && savedParticipants !== 'undefined' && savedParticipants !== 'null') {
          const parsedParticipants = JSON.parse(savedParticipants);
          if (Array.isArray(parsedParticipants)) {
            setParticipants(parsedParticipants);
          }
        }
        if (savedExpenses && savedExpenses !== 'undefined' && savedExpenses !== 'null') {
          const parsedExpenses = JSON.parse(savedExpenses);
          if (Array.isArray(parsedExpenses)) {
            setExpenses(parsedExpenses);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Reset to empty arrays if there's an error
      setParticipants([]);
      setExpenses([]);
    }
  };

  const saveData = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('expense-splitter-participants', JSON.stringify(participants));
        localStorage.setItem('expense-splitter-expenses', JSON.stringify(expenses));
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const clearAllData = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('expense-splitter-participants');
        localStorage.removeItem('expense-splitter-expenses');
      }
      setParticipants([]);
      setExpenses([]);
      setParticipantName('');
      setExpenseForm({
        description: '',
        amount: '',
        payer: ''
      });
      setActiveTab('home');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const addParticipant = () => {
    if (participantName.trim() && !participants.find(p => p.name.toLowerCase() === participantName.toLowerCase())) {
      setParticipants([...participants, { 
        id: Date.now(), 
        name: participantName.trim() 
      }]);
      setParticipantName('');
    }
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
    setExpenses(expenses.filter(e => e.payer !== id));
  };

  const addExpense = () => {
    if (expenseForm.description && expenseForm.amount && expenseForm.payer && participants.length > 0) {
      // Automatically include all participants
      const expense = {
        id: Date.now(),
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        payer: parseInt(expenseForm.payer),
        participants: participants.map(p => p.id), // Include all participants
        date: new Date().toISOString()
      };
      
      setExpenses([...expenses, expense]);
      setExpenseForm({
        description: '',
        amount: '',
        payer: ''
      });
    }
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const calculateBalances = () => {
    const balances = {};
    
    // Initialize balances
    participants.forEach(p => {
      balances[p.id] = 0;
    });

    // Calculate balances based on expenses
    expenses.forEach(expense => {
      const shareAmount = expense.amount / expense.participants.length;
      
      // Payer gets credited
      balances[expense.payer] += expense.amount;
      
      // Each participant (including payer if they're in the list) gets debited
      expense.participants.forEach(participantId => {
        balances[participantId] -= shareAmount;
      });
    });

    return balances;
  };

  const optimizeTransactions = () => {
    const balances = calculateBalances();
    const creditors = [];
    const debtors = [];
    
    Object.entries(balances).forEach(([id, balance]) => {
      if (balance > 0.01) {
        creditors.push({ id: parseInt(id), amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ id: parseInt(id), amount: -balance });
      }
    });

    const transactions = [];
    let i = 0, j = 0;
    
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const amount = Math.min(creditor.amount, debtor.amount);
      
      if (amount > 0.01) {
        transactions.push({
          from: debtor.id,
          to: creditor.id,
          amount: amount
        });
      }
      
      creditor.amount -= amount;
      debtor.amount -= amount;
      
      if (creditor.amount <= 0.01) i++;
      if (debtor.amount <= 0.01) j++;
    }
    
    return transactions;
  };

  const getParticipantName = (id) => {
    const participant = participants.find(p => p.id === id);
    return participant ? participant.name : 'Unknown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'participants', icon: Users, label: 'Participants' },
    { id: 'expenses', icon: Receipt, label: 'Expenses' },
    { id: 'results', icon: Calculator, label: 'Results' },
  ];

  const renderWelcome = () => (
    <div className="text-center py-20">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Calculator size={40} className="text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
          Welcome to SplitWise
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Effortlessly split expenses among friends, family, or colleagues. Add participants, track expenses, and let us calculate who owes what with optimal settlement suggestions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: Users, title: "Add Participants", desc: "Start by adding people to your expense group" },
          { icon: CreditCard, title: "Track Expenses", desc: "Record expenses - all participants will be included automatically" },
          { icon: TrendingUp, title: "Get Results", desc: "See optimized settlement suggestions" }
        ].map((step, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <step.icon size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderParticipants = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Participants
        </h2>
        <div className="text-sm text-gray-400">
          {participants.length} {participants.length === 1 ? 'person' : 'people'}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter participant name"
            className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400/80 transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
          />
          <button
            onClick={addParticipant}
            className="bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {participants.map((participant) => (
          <div key={participant.id} className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 flex items-center justify-between group hover:border-gray-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span className="text-white font-medium">{participant.name}</span>
            </div>
            <button
              onClick={() => removeParticipant(participant.id)}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-2 hover:bg-red-400/10 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>No participants added yet. Add some people to get started!</p>
        </div>
      )}
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Expenses
        </h2>
        <div className="text-sm text-gray-400">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </div>
      </div>

      {participants.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-white mb-4">Add New Expense</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              placeholder="Expense description"
              className="bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400/80 transition-colors"
            />
            <input
              type="number"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              placeholder="Amount"
              step="0.01"
              className="bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400/80 transition-colors"
            />
          </div>

          <select
            value={expenseForm.payer}
            onChange={(e) => setExpenseForm({ ...expenseForm, payer: e.target.value })}
            className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-400/80 transition-colors"
          >
            <option value="">Select who paid</option>
            {participants.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
            <p className="text-blue-300 text-sm font-medium mb-2">✓ Auto-split among all participants</p>
            <p className="text-blue-200/70 text-sm">
              This expense will be automatically split equally among all {participants.length} participants: {participants.map(p => p.name).join(', ')}
            </p>
          </div>

          <button
            onClick={addExpense}
            className="w-full bg-gradient-to-r from-white to-gray-100 text-black py-3 rounded-xl font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Expense
          </button>
        </div>
      )}

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-6 group hover:border-gray-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{expense.description}</h3>
                <p className="text-gray-400 text-sm">
                  Paid by {getParticipantName(expense.payer)} • {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-xl font-bold">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {formatCurrency(expense.amount / expense.participants.length)} per person
                  </div>
                </div>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-2 hover:bg-red-400/10 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-gray-300 text-sm mb-2">Split among all participants:</p>
              <div className="flex flex-wrap gap-2">
                {expense.participants.map(pId => (
                  <span key={pId} className="bg-gray-700/50 text-gray-200 px-3 py-1 rounded-full text-sm">
                    {getParticipantName(pId)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>Add participants first to start tracking expenses</p>
        </div>
      )}

      {participants.length > 0 && expenses.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Receipt size={48} className="mx-auto mb-4 opacity-50" />
          <p>No expenses recorded yet. Add your first expense above!</p>
        </div>
      )}
    </div>
  );

  const renderResults = () => {
    if (expenses.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          <PieChart size={48} className="mx-auto mb-4 opacity-50" />
          <p>Add some expenses to see the settlement results</p>
        </div>
      );
    }

    const balances = calculateBalances();
    const transactions = optimizeTransactions();
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Settlement Results
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Total: {formatCurrency(totalAmount)}
            </div>
            <button
              onClick={clearAllData}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-medium hover:scale-105 transition-all flex items-center gap-2 text-sm"
            >
              <RefreshCw size={16} />
              Clear All
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-6 text-center">
            <DollarSign size={24} className="mx-auto mb-2 text-gray-400" />
            <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-2xl font-bold">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-gray-400 text-sm">Total Expenses</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-6 text-center">
            <Users size={24} className="mx-auto mb-2 text-gray-400" />
            <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-2xl font-bold">
              {participants.length}
            </div>
            <div className="text-gray-400 text-sm">Participants</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-6 text-center">
            <Calculator size={24} className="mx-auto mb-2 text-gray-400" />
            <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent text-2xl font-bold">
              {transactions.length}
            </div>
            <div className="text-gray-400 text-sm">Transactions</div>
          </div>
        </div>

        {/* Individual Balances */}
        <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Individual Balances</h3>
          <div className="space-y-3">
            {Object.entries(balances).map(([id, balance]) => (
              <div key={id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <span className="text-white font-medium">{getParticipantName(parseInt(id))}</span>
                </div>
                <div className={`font-bold ${balance > 0.01 ? 'text-green-400' : balance < -0.01 ? 'text-red-400' : 'text-gray-400'}`}>
                  {balance > 0.01 ? '+' : ''}{formatCurrency(balance)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimized Transactions */}
        {transactions.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Optimized Settlements</h3>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      <span className="text-white font-medium">{getParticipantName(transaction.from)}</span>
                    </div>
                    
                    <ArrowRight size={20} className="text-gray-400" />
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      <span className="text-white font-medium">{getParticipantName(transaction.to)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent font-bold text-lg">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear All Notice */}
        <div className="bg-gradient-to-br from-yellow-900/20 via-yellow-800/20 to-orange-900/20 border border-yellow-700/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm font-medium mb-1">💡 Settlement Complete?</p>
          <p className="text-yellow-200/70 text-sm">
            Once everyone has settled their debts, use the "Clear All" button above to start fresh with a new expense group.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] opacity-30 transition-all duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(148,163,184,0.4) 0%, rgba(71,85,105,0.2) 40%, transparent 70%)',
            left: mousePosition.x * 0.02 - 400,
            top: mousePosition.y * 0.02 - 400,
            filter: 'blur(60px)'
          }}
        />
        
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-600/20 via-slate-500/20 to-gray-700/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-slate-600/20 via-gray-500/20 to-slate-700/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Desktop Navigation - Always Visible */}
      <div className="hidden md:block relative z-50 w-full">
        <nav className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-900/90 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  <span className="text-white">
                    Split
                  </span>
                  <span className="text-gray-300 ml-1">Wise</span>
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

      {/* Mobile Header */}
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

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${sidebarOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
             onClick={() => setSidebarOpen(false)} />
        
        <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-md border-l border-white/10 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-bold">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                  Split
                </span>
                <span className="text-gray-400 ml-1">Wise</span>
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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {activeTab === 'home' && (expenses.length === 0 ? renderWelcome() : renderResults())}
          {activeTab === 'participants' && renderParticipants()}
          {activeTab === 'expenses' && renderExpenses()}
          {activeTab === 'results' && renderResults()}
        </div>
      </div>

      {/* Mobile Tab Bar */}
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

      <style jsx>{`
        @keyframes border-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ExpenseSplitter;