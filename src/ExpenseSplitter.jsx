import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calculator, 
  Home,
  Receipt
} from 'lucide-react';
import Header from './components/mobHeader';
import Sidebar from './components/Sidebar';
import DesktopNav from './components/DesktopNav';
import TabBar from './components/TabBar';
import Welcome from './components/Welcome';
import Participants from './components/Participants';
import Expenses from './components/Expenses';
import Results from './components/Results';

const ExpenseSplitter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
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
      const expense = {
        id: Date.now(),
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        payer: parseInt(expenseForm.payer),
        participants: participants.map(p => p.id),
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
    participants.forEach(p => {
      balances[p.id] = 0;
    });
    expenses.forEach(expense => {
      const shareAmount = expense.amount / expense.participants.length;
      balances[expense.payer] += expense.amount;
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
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'participants', icon: Users, label: 'Participants' },
    { id: 'expenses', icon: Receipt, label: 'Expenses' },
    { id: 'results', icon: Calculator, label: 'Results' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
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
      <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} />
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        menuItems={menuItems} 
        participants={participants} 
        expenses={expenses} 
        clearAllData={clearAllData} 
        formatCurrency={formatCurrency} 
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {activeTab === 'home' && (expenses.length === 0 ? <Welcome /> : <Results 
            expenses={expenses} 
            participants={participants} 
            clearAllData={clearAllData} 
            formatCurrency={formatCurrency} 
            calculateBalances={calculateBalances} 
            optimizeTransactions={optimizeTransactions} 
            getParticipantName={getParticipantName} 
          />)}
          {activeTab === 'participants' && <Participants 
            participants={participants} 
            participantName={participantName} 
            setParticipantName={setParticipantName} 
            addParticipant={addParticipant} 
            removeParticipant={removeParticipant} 
          />}
          {activeTab === 'expenses' && <Expenses 
            participants={participants} 
            expenseForm={expenseForm} 
            setExpenseForm={setExpenseForm} 
            addExpense={addExpense} 
            expenses={expenses} 
            removeExpense={removeExpense} 
            getParticipantName={getParticipantName} 
            formatCurrency={formatCurrency} 
          />}
          {activeTab === 'results' && <Results 
            expenses={expenses} 
            participants={participants} 
            clearAllData={clearAllData} 
            formatCurrency={formatCurrency} 
            calculateBalances={calculateBalances} 
            optimizeTransactions={optimizeTransactions} 
            getParticipantName={getParticipantName} 
          />}
        </div>
      </div>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} menuItems={menuItems} />
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