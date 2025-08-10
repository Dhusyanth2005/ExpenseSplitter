import { Plus, User, Trash2, Users } from 'lucide-react';

const Participants = ({ participants, participantName, setParticipantName, addParticipant, removeParticipant }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
        Participants
      </h2>
      <div className="text-sm text-gray-400">
        {participants.length} {participants.length === 1 ? 'person' : 'people'}
      </div>
    </div>
    <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-2xl p-4 sm:p-6">
      {/* Mobile: Stack vertically, Desktop: Horizontal */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          placeholder="Enter participant name"
          className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400/80 transition-colors text-base"
          onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
        />
        <button
          onClick={addParticipant}
          className="bg-gradient-to-r from-white to-gray-100 text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} />
          <span className="hidden xs:inline sm:inline">Add</span>
          <span className="xs:hidden sm:hidden">Add Participant</span>
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {participants.map((participant) => (
        <div key={participant.id} className="bg-gradient-to-br from-gray-800/30 via-gray-900/30 to-black/30 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 flex items-center justify-between group hover:border-gray-500/50 transition-colors">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-white" />
            </div>
            <span className="text-white font-medium truncate">{participant.name}</span>
          </div>
          <button
            onClick={() => removeParticipant(participant.id)}
            className="opacity-70 sm:opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-2 hover:bg-red-400/10 rounded-lg flex-shrink-0 ml-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
    {participants.length === 0 && (
      <div className="text-center py-12 text-gray-400">
        <Users size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-sm sm:text-base px-4">No participants added yet. Add some people to get started!</p>
      </div>
    )}
  </div>
);

export default Participants;