import { Plus, Trash2, Users, Receipt } from 'lucide-react';
const Expenses = ({ participants, expenseForm, setExpenseForm, addExpense, expenses, removeExpense, getParticipantName, formatCurrency }) => (
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
export default Expenses;