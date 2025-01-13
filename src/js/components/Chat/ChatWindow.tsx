import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchChatById, fetchChatMessages } from '../../../store/slices/chatSlice';
import dayjs from 'dayjs';

interface ChatWindowProps {
  chatId: number;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, currentChat, loading } = useSelector((state: RootState) => state.chat);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchChatById(chatId));
    dispatch(fetchChatMessages(chatId));
  }, [dispatch, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b p-4 flex">
        <img
            src={currentChat?.listing.images[0].url}
            alt={`${currentChat?.listing.make} ${currentChat?.listing.model}`}
            className="w-16 h-16 object-cover rounded mr-3"
        />
        <div className="flex items-center">
            <h2 className="font-semibold">
                {currentChat?.listing.make} {currentChat?.listing.model}
            </h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === userId;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
                <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                    isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                >
                    <p>{message.content}</p>
                </div>
                <span className="text-xs opacity-70">
                    {dayjs(message.created_at).fromNow()}
                </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;