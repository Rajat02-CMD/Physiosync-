
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, X, Bot, User, Loader2, Sparkles, HelpCircle } from 'lucide-react';

const HealthChat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "I'm your PhysioSync curiosity assistant. Ask me anything about your recovery, why certain exercises help, or how your body heals!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: 'You are the PhysioSync Health Assistant. Your goal is to satisfy patient curiosity. Explain complex medical concepts (like muscle repair or joint mechanics) in simple, encouraging terms. Be professional, but approachable. If asked for medical advice, provide general info and remind them to check with their assigned doctor.',
        },
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'I encountered an error processing your question.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my knowledge base right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-xl">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight">Recovery Curiosity</h3>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">AI Powered</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-100' 
                : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'
            }`}>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span className="text-xs font-bold text-slate-400 animate-pulse">Consulting knowledge base...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t bg-white">
        <div className="flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Why does my shoulder click? ..."
            className="flex-grow bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthChat;
