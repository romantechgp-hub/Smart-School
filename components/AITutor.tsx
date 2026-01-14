
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, User } from '../types';

interface AITutorProps {
  currentUser: User;
}

const AITutor: React.FC<AITutorProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: input.trim() }]
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...messages, userMessage],
        config: {
          systemInstruction: `You are "Smart Tutor", a friendly and helpful AI assistant for students of a school in Bangladesh. 
          Your name is "স্মার্ট টিউটর". 
          Always reply in Bengali (বাংলা). 
          Explain educational concepts in simple terms suitable for students. 
          The student you are talking to is ${currentUser.name}, who is in class ${currentUser.className || 'N/A'}. 
          Encourage them and be polite.`,
        },
      });

      let fullResponse = '';
      const modelMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: '' }]
      };
      
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of response) {
        const text = chunk.text;
        fullResponse += text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'model',
            parts: [{ text: fullResponse }]
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। আবার চেষ্টা করুন।" }]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[40px] shadow-2xl border overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-indigo-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            🤖
          </div>
          <div>
            <h3 className="text-white font-black text-xl">স্মার্ট টিউটর</h3>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">AI এআই শিক্ষক সর্বদা সক্রিয়</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-5xl mb-6 shadow-xl animate-bounce">
              🎓
            </div>
            <h4 className="text-2xl font-black text-gray-800 mb-2">হ্যালো {currentUser.name}!</h4>
            <p className="text-gray-500 font-medium">আমি তোমার স্মার্ট টিউটর। গণিত, বিজ্ঞান বা যেকোনো বিষয় সম্পর্কে আমাকে প্রশ্ন করতে পারো।</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button onClick={() => setInput("সালোকসংশ্লেষণ কী?")} className="px-4 py-2 bg-white border rounded-full text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">সালোকসংশ্লেষণ কী?</button>
              <button onClick={() => setInput("পিথাগোরাসের উপপাদ্য বুঝিয়ে দাও")} className="px-4 py-2 bg-white border rounded-full text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">পিথাগোরাস বুঝিয়ে দাও</button>
              <button onClick={() => setInput("ইংরেজি গ্রামার শিখতে চাই")} className="px-4 py-2 bg-white border rounded-full text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">গ্রামার টিপস</button>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${
              msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white border text-gray-800 rounded-tl-none'
            }`}>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1]?.role === 'user' && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border p-4 rounded-3xl rounded-tl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            className="flex-1 bg-gray-100 border-none px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            placeholder="আপনার প্রশ্নটি এখানে লিখুন..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-3 font-bold uppercase tracking-widest">Powered by Gemini AI Technology</p>
      </div>
    </div>
  );
};

export default AITutor;
