import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchUserChats, markMessagesRead, Chat } from '../../../store/slices/chatSlice';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const ChatList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { chats, loading } = useSelector((state: RootState) => state.chat) as { chats: Chat[], loading: boolean };
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  dayjs.extend(relativeTime);

  const handleChatClick = async (chatId: number) => {
    if (userId) {
      await dispatch(markMessagesRead({ chatId, userId })).unwrap();
      await dispatch(fetchUserChats(userId)).unwrap();
      navigate(`/chats/${chatId}`);
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserChats(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return <div>Loading chats...</div>;
  }

  return (
    <div className="divide-y divide-gray-200">
      {chats.map((chat) => {
       const hasUnreadMessages = chat.messages && chat.messages.length > 0 
       ? chat.messages.some(msg => !msg.read_at && msg.sender_id !== userId)
       : false;        
        
        return (
        <div onClick={() => handleChatClick(chat.id)} key={chat.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${
            hasUnreadMessages ? 'bg-blue-50' : ''
          }`}>
          <div className="flex items-center gap-4">
            {chat.listing.images?.[0] && (
              <img
                src={chat.listing.images[0].url}
                alt={`${chat.listing.make} ${chat.listing.model}`}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-medium">
                {chat.listing.make} {chat.listing.model}
              </h3>
              <p className="text-sm text-gray-500">
                {chat.buyer.id === userId ? 'You' : chat.buyer.email} →{' '}
                {chat.seller.id === userId ? 'You' : chat.seller.email}
              </p>
              <p className="text-xs text-gray-400">
                {dayjs(chat.last_message_at).fromNow()}
              </p>
            </div>
            {hasUnreadMessages && (
                <div className='flex justify-end grow pr-3'>
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                </div>
            )}
          </div>
        </div>
      )})}
    </div>
  );
};

export default ChatList;