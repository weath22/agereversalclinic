import fs from 'fs';

let content = fs.readFileSync('src/components/FloatingMenu.tsx', 'utf8');

const importReplacement = `import React, { useState, useEffect } from 'react';
import { getFloatingMenuConfig, getChatSessions, saveChatSessions } from '../lib/adminStore';
import { ChatSession, ChatMessage } from '../types';`;

content = content.replace(/import React, \{ useState, useEffect \} from 'react';\nimport \{ getFloatingMenuConfig \} from '\.\.\/lib\/adminStore';/, importReplacement);

const newLogic = `
  const [sessionId, setSessionId] = useState<string>('');
  
  useEffect(() => {
    // Check for existing session ID in localStorage
    let storedSessionId = window.localStorage.getItem('current_client_chat_session_id');
    if (!storedSessionId) {
      storedSessionId = Date.now().toString();
      window.localStorage.setItem('current_client_chat_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
    
    // Poll for messages to receive replies from admin
    const interval = setInterval(() => {
      const sessions = getChatSessions();
      const mySession = sessions.find(s => s.id === storedSessionId);
      if (mySession) {
        setMessages(mySession.messages);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputValue("");
    
    // Save to global admin store
    const sessions = getChatSessions();
    const existingSessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (existingSessionIndex >= 0) {
      sessions[existingSessionIndex].messages = newMessages;
      sessions[existingSessionIndex].lastUpdated = newMessage.timestamp;
      sessions[existingSessionIndex].unreadCountAdmin += 1;
    } else {
      sessions.push({
        id: sessionId,
        clientName: 'Visitor ' + sessionId.substring(sessionId.length - 4),
        messages: [{
          id: 'welcome-' + sessionId,
          text: config.welcomeMessage || "Hello! How can we help you today?",
          isUser: false,
          timestamp: new Date().toISOString()
        }, newMessage],
        lastUpdated: newMessage.timestamp,
        unreadCountAdmin: 1
      });
    }
    saveChatSessions(sessions);
  };
`;

content = content.replace(/const handleSendMessage \= \(e: React\.FormEvent\) \=\> \{[\s\S]*?\}\, 1000\);\n  \};\n/, newLogic + '\n');

fs.writeFileSync('src/components/FloatingMenu.tsx', content);
