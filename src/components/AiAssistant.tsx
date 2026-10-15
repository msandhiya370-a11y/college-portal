import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Code, 
  BookOpen, 
  Lightbulb, 
  Clock, 
  HelpCircle,
  Cpu,
  Layers,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage } from '../types';

interface AiAssistantProps {
  currentSubjectContext?: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ currentSubjectContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `### Welcome to ApexEdu AI Academic Tutor 🎓

I am your 24/7 college academic assistant, powered by Google's **Gemini 3.8 Flash**. I am tailored for engineering coursework, university examinations, lab coding, and technical viva preparation.

#### How I can assist you today:
- 💡 **Explain Complex Concepts:** Pointers in C, B-Trees, Normalization (3NF/BCNF), Dijkstra's Algorithm, TCP/IP Flow Control, Paging & Segmentation.
- 💻 **Code & Debug:** C, C++, Java, Python, SQL queries, and full-stack web code with line-by-line explanations.
- 📅 **Study & Revision Schedules:** Custom multi-day preparation plans for upcoming internal and semester exams.
- 🎯 **Exam Prep & Viva Questions:** Top 2-mark definitions, 16-mark essay answers, and lab viva question banks.
- 🚀 **Project Guidance:** Mini-project ideas, system architecture, database schema design, and project report formatting.

Select any suggestion below or ask your question in the chat!`,
      timestamp: '09:00 AM',
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{ isLive: boolean; source: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const categories = [
    'All',
    'C / C++ / Java',
    'DBMS & SQL',
    'Computer Networks',
    'Operating Systems',
    'Algorithms & DSA',
    'Exam Question Bank',
    'Project Ideas',
    'College FAQs'
  ];

  const promptSuggestions = [
    {
      label: "Explain Pointers & Memory in C",
      category: 'C / C++ / Java',
      prompt: "Can you explain how pointers work in C with a simple memory diagram and code example? Also explain wild pointers and dangling pointers."
    },
    {
      label: "3NF vs BCNF Normalization",
      category: 'DBMS & SQL',
      prompt: "Explain the difference between 3NF and BCNF normalization in DBMS with a clear real-world university database example."
    },
    {
      label: "Dijkstra's Algorithm with Code",
      category: 'Algorithms & DSA',
      prompt: "Explain Dijkstra's shortest path algorithm step by step. Provide a clean C or C++ implementation and state its time complexity."
    },
    {
      label: "5-Day Exam Revision Schedule",
      category: 'Exam Question Bank',
      prompt: "Create an effective 5-day revision timetable for my upcoming Operating Systems and Computer Networks internal exams."
    },
    {
      label: "TCP 3-Way Handshake Explained",
      category: 'Computer Networks',
      prompt: "Explain the TCP 3-way handshake process (SYN, SYN-ACK, ACK) and explain why a 2-way handshake is insufficient."
    },
    {
      label: "Deadlocks & Banker's Algorithm",
      category: 'Operating Systems',
      prompt: "Explain the 4 necessary conditions for Deadlock in OS. How does the Banker's Algorithm ensure deadlock avoidance?"
    },
    {
      label: "B.Tech IT Mini Project Ideas",
      category: 'Project Ideas',
      prompt: "Give me 4 innovative, practical mini-project ideas for 3rd year B.Tech IT students with recommended tech stacks and architecture outlines."
    },
    {
      label: "Attendance Condonation Rules",
      category: 'College FAQs',
      prompt: "What are the Anna University / AICTE regulations regarding the 75% attendance rule and medical condonation requirements?"
    }
  ];

  const filteredSuggestions = activeCategory === 'All' 
    ? promptSuggestions 
    : promptSuggestions.filter(p => p.category === activeCategory);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await api.sendAiMessage(
        query.trim(), 
        messages, 
        currentSubjectContext
      );

      setApiStatus({ isLive: response.isLive, source: response.source });

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `I encountered an issue connecting to the academic server: ${err.message || 'Network error'}. Please check your connection or retry.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportNotes = () => {
    const content = messages
      .map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n\n-------------------------\n`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexEdu_Study_Notes_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear this study session chat?')) {
      setMessages([
        {
          id: 'cleared-1',
          sender: 'assistant',
          text: 'Chat history cleared. What topic or doubt would you like to explore next?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Bot className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">ApexEdu AI Academic Tutor</h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30 rounded-md">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized 1-on-1 tutoring for B.Tech IT engineering subjects, lab code &amp; exam prep
            </p>
          </div>
        </div>

        {/* Action icons & status indicator */}
        <div className="flex items-center gap-2">
          {/* Status pill */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Academic Tutor Ready</span>
          </div>

          <button
            onClick={handleExportNotes}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Download Study Notes"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompt Suggestion Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {filteredSuggestions.slice(0, 4).map((sugg, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sugg.prompt)}
            className="p-3 bg-white hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 rounded-2xl text-left transition-all hover:scale-[1.01] shadow-xs cursor-pointer group"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1 flex items-center justify-between">
              <span>{sugg.category}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-xs font-semibold text-slate-800 line-clamp-1">{sugg.label}</div>
            <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">{sugg.prompt}</div>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-900 text-cyan-400 border border-slate-800 shadow-xs'
                }`}>
                  {isUser ? 'ME' : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`relative group max-w-2xl sm:max-w-3xl rounded-2xl p-4 sm:p-5 text-sm ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/10' 
                    : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
                }`}>
                  {/* Copy button for Assistant */}
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Copy response text"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Render content */}
                  <div className={`prose prose-sm max-w-none ${isUser ? 'text-white' : 'text-slate-800'}`}>
                    {renderFormattedText(msg.text, isUser)}
                  </div>

                  <div className={`text-[10px] mt-2 text-right ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  ApexEdu AI is synthesizing an academic explanation...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any academic question, doubt, code debugging, or revision plan..."
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                input.trim() && !loading
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Engineering Tutor: C/C++, Java, Python, SQL, DBMS, OS, Networks, Algorithms</span>
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Formats Markdown headings, bullet points, and code blocks
function renderFormattedText(text: string, isUserMessage: boolean) {
  if (isUserMessage) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  // Split code blocks from normal text
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = firstLine && !firstLine.includes(' ') && firstLine.length < 15;
          const language = hasLang ? firstLine : 'code';
          const codeContent = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={index} className="my-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-200">
              <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono font-medium text-slate-400 flex items-center justify-between">
                <span className="uppercase text-cyan-400 font-semibold">{language}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(codeContent)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Copy code
                </button>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // Parse standard text lines
        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={lIdx} className="text-base font-bold text-slate-900 mt-3 mb-1">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={lIdx} className="text-sm font-bold text-slate-900 mt-2 mb-1">
                    {trimmed.replace('#### ', '')}
                  </h4>
                );
              }
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 text-slate-700 ml-1">
                    <span className="text-blue-600 font-bold mt-1 text-xs">•</span>
                    <span>{parseInlineMarkdown(trimmed.substring(2))}</span>
                  </div>
                );
              }
              if (/^\d+\.\s/.test(trimmed)) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 text-slate-700 ml-1">
                    <span className="font-semibold text-blue-600">{trimmed.split(' ')[0]}</span>
                    <span>{parseInlineMarkdown(trimmed.replace(/^\d+\.\s/, ''))}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="leading-relaxed text-slate-700">
                  {parseInlineMarkdown(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function parseInlineMarkdown(str: string): React.ReactNode {
  // Bold **text**
  const boldParts = str.split(/(\*\*.*?\*\*)/g);
  return boldParts.map((bPart, bIdx) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      return <strong key={bIdx} className="font-bold text-slate-900">{bPart.slice(2, -2)}</strong>;
    }
    // Inline code `code`
    const codeParts = bPart.split(/(`.*?`)/g);
    return codeParts.map((cPart, cIdx) => {
      if (cPart.startsWith('`') && cPart.endsWith('`')) {
        return (
          <code key={cIdx} className="px-1.5 py-0.5 rounded bg-slate-100 text-blue-700 font-mono text-xs font-medium">
            {cPart.slice(1, -1)}
          </code>
        );
      }
      return cPart;
    });
  });
}
