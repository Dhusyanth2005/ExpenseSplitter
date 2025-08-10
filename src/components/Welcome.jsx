import { Calculator, Users, CreditCard, TrendingUp } from 'lucide-react';
const Welcome = () => (
  <div className="text-center py-20">
    <div className="mb-8">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
        <Calculator size={40} className="text-white" />
      </div>
      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
        Welcome to Expense Splitter
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
export default Welcome;