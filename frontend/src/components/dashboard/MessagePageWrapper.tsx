// src/components/dashboard/MessagesPageWrapper.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import ConversationList from './ConversationList'; // Ensure correct path
import Messages from './Messages'; // Ensure correct path
import { MessageCircle } from 'lucide-react';

export default function MessagesPageWrapper() {
  const { conversationId, otherParticipantId } = useParams<{ conversationId?: string; otherParticipantId?: string }>();

  return (
    <div className="flex h-full min-h-0 bg-gray-50"> {/* Add min-h-0 to allow scrolling */}
      {/* Conversation List (always visible) */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm overflow-hidden rounded-lg mr-4">
        <ConversationList />
      </div>

      {/* Messages Component (conditionally rendered or always there with default text) */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm">
        {conversationId && otherParticipantId ? (
          <Messages />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            <MessageCircle className="w-16 h-16 mb-4 text-emerald-400" />
            <h2 className="text-xl font-semibold mb-2">Select a Conversation</h2>
            <p className="text-center text-gray-600">
              Choose a chat from the list on the left to view messages.
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              If you don't see any, you can start one from a user's profile or a skill request.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}