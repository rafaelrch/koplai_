import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  MoreVertical,
  Paperclip,
  Smile,
  Mic
} from 'lucide-react';

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Olá! Como posso ajudar você hoje?',
      timestamp: '10:30',
      avatar: '🤖'
    },
    {
      id: 2,
      type: 'user',
      content: 'Preciso de ajuda com o projeto de marketing digital',
      timestamp: '10:31',
      avatar: '👤'
    },
    {
      id: 3,
      type: 'bot',
      content: 'Claro! Posso ajudar você com estratégias de marketing digital. Que tipo de projeto você está desenvolvendo?',
      timestamp: '10:32',
      avatar: '🤖'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user' as const,
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '👤'
      };
      
      setMessages([...messages, newMessage]);
      setInputMessage('');

      // Simular resposta do bot
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot' as const,
          content: 'Entendi! Vou analisar sua solicitação e te ajudar com as melhores estratégias para seu projeto de marketing digital.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: '🤖'
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex bg-[#f6f6f6] font-inter min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start py-10 px-2 sm:px-8 lg:ml-[260px] w-full max-w-full">
        <div className="w-full max-w-4xl flex flex-col items-center h-[calc(100vh-5rem)]">
          {/* Header */}
          <div className="w-full bg-white rounded-2xl shadow mb-6 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Chat com IA</h1>
                  <p className="text-sm text-gray-600">Converse com nossos assistentes inteligentes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Online</Badge>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="w-full bg-white rounded-2xl shadow flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {message.avatar}
                    </div>
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl max-w-full ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 px-1">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="pr-20 resize-none"
                    multiline
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="h-10 px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 