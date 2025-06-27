import  { useState } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Star,
} from 'lucide-react';



const conversations = [
  {
    id: 1,
    participant: {
      name: 'Marcus Johnson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      status: 'online'
    },
    lastMessage: 'Great! I\'ll send you the portfolio examples by tomorrow.',
    timestamp: '2 min ago',
    unreadCount: 2,
    skillRequest: 'React Development Project',
    isStarred: true
  },
  {
    id: 2,
    participant: {
      name: 'Elena Rodriguez',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      status: 'online'
    },
    lastMessage: 'The brand guidelines look perfect. When can we start?',
    timestamp: '1 hour ago',
    unreadCount: 0,
    skillRequest: 'Brand Identity Design',
    isStarred: false
  },
  {
    id: 3,
    participant: {
      name: 'David Park',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      status: 'away'
    },
    lastMessage: '¡Perfecto! Nos vemos mañana para la lección.',
    timestamp: '3 hours ago',
    unreadCount: 1,
    skillRequest: 'Spanish Conversation Practice',
    isStarred: false
  },
  {
    id: 4,
    participant: {
      name: 'Maya Thompson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      status: 'offline'
    },
    lastMessage: 'Thanks for the workout plan! I\'ll start this week.',
    timestamp: '1 day ago',
    unreadCount: 0,
    skillRequest: 'Fitness Training Program',
    isStarred: true
  },
  {
    id: 5,
    participant: {
      name: 'Alex Kumar',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      status: 'online'
    },
    lastMessage: 'The music production session was amazing!',
    timestamp: '2 days ago',
    unreadCount: 0,
    skillRequest: 'Music Production Basics',
    isStarred: false
  }
];

const messages = [
  {
    id: 1,
    senderId: 1,
    content: 'Hi Sarah! I saw your application for the React development project. Your portfolio looks impressive!',
    timestamp: '10:30 AM',
    isOwn: false
  },
  {
    id: 2,
    senderId: 'me',
    content: 'Thank you! I\'m really excited about this opportunity. I have extensive experience with React and TypeScript.',
    timestamp: '10:32 AM',
    isOwn: true
  },
  {
    id: 3,
    senderId: 1,
    content: 'Perfect! I\'d love to see some examples of your recent work. Do you have any portfolio pieces that showcase modern React patterns?',
    timestamp: '10:35 AM',
    isOwn: false
  },
  {
    id: 4,
    senderId: 'me',
    content: 'Absolutely! I\'ll send you links to my three most recent projects. They showcase hooks, context API, and custom components.',
    timestamp: '10:37 AM',
    isOwn: true
  },
  {
    id: 5,
    senderId: 1,
    content: 'Great! I\'ll send you the portfolio examples by tomorrow.',
    timestamp: '10:40 AM',
    isOwn: false
  }
];

type Status = 'online' | 'away' | 'offline';

const statusColors: Record<Status, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400'
};

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.skillRequest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add message logic here
      setMessageText('');
    }
  };

  

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 flex">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation.id === conversation.id ? 'bg-emerald-50 border-r-2 border-r-emerald-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={conversation.participant.avatar}
                    alt={conversation.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[conversation.participant.status as Status] } rounded-full border-2 border-white`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.participant.name}</h3>
                    <div className="flex items-center space-x-1">
                      {conversation.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{conversation.skillRequest}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={selectedConversation.participant.avatar}
                alt={selectedConversation.participant.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[selectedConversation.participant.status as Status]} rounded-full border-2 border-white`}></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedConversation.participant.name}</h3>
              <p className="text-sm text-gray-600">{selectedConversation.skillRequest}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Info className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isOwn 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isOwn ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Smile className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}