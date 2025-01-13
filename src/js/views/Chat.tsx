import React from 'react';
import ChatList from '@/components/Chat/ChatList';
import ChatWindow from '@/components/Chat/ChatWindow';
import MessageInput from '@/components/Chat/MessageInput';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] flex">
      {/* Sidebar with chat list */}
      <div className="w-1/3 border-r">
        <ChatList />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {chatId ? (
          <>
            <ChatWindow chatId={parseInt(chatId)} />
            <MessageInput chatId={parseInt(chatId)} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;