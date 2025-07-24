import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../js/config/api';

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface Chat {
  id: number;
  listing: {
    id: number;
    make: string;
    model: string;
    images: any[];
  };
  buyer: {
    id: number;
    email: string;
  };
  seller: {
    id: number;
    email: string;
  };
  last_message_at: string;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null
};

export const createChat = createAsyncThunk(
    'chat/createChat',
    async (data: { listing_id: number; buyer_id: number; seller_id: number }) => {
      const response = await fetch(`${API_BASE_URL}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create chat');
      }
  
      return await response.json();
    }
  );

export const fetchUserChats = createAsyncThunk(
  'chat/fetchUserChats',
  async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/chats?user_id=${userId}`);
    return await response.json();
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async (chatId: number) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`);
    return await response.json();
  }
);

export const fetchChatById = createAsyncThunk(
    'chat/fetchChatById',
    async (chatId: number) => {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat');
      }
      return await response.json();
    }
  );

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, senderId, content }: { chatId: number; senderId: number; content: string }) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_id: senderId, content })
    });
    return await response.json();
  }
);

export const fetchUnreadCount = createAsyncThunk(
    'chat/fetchUnreadCount',
    async (userId: number) => {
      const response = await fetch(`${API_BASE_URL}/messages/unread-count/${userId}`);
      const data = await response.json();
      return data.unread_count;
    }
  );
  
  export const markMessagesRead = createAsyncThunk(
    'chat/markMessagesRead',
    async ({ chatId, userId }: { chatId: number; userId: number }) => {
      const response = await fetch(`${API_BASE_URL}/messages/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, user_id: userId })
      });
      return await response.json();
    }
  );

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(createChat.fulfilled, (state, action) => {
        console.log('Chat created:', action.payload);
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markMessagesRead.fulfilled, (state, action) => {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        const chatId = action.meta.arg.chatId;
        const userId = action.meta.arg.userId;
        
        const chat = state.chats.find(c => c.id === chatId);
        if (chat) {
          chat.messages = chat.messages.map(msg => ({
            ...msg,
            read_at: msg.sender_id !== userId ? new Date().toISOString() : msg.read_at
          }));
        }
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.currentChat = action.payload;
        state.loading = false;
      });
  }
});

export default chatSlice.reducer;