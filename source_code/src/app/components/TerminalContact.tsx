import { useState, useRef, useEffect } from 'react';

interface Message {
  type: 'system' | 'user' | 'error' | 'success';
  text: string;
}

interface TerminalContactProps {
  isModal?: boolean;
  onClose?: () => void;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactApiResponse {
  ok?: boolean;
  message?: string;
}

const CONTACT_API_BASE_URL = import.meta.env.VITE_CONTACT_API_BASE_URL ?? '';
const CONTACT_ENDPOINT = `${CONTACT_API_BASE_URL.replace(/\/$/, '')}/contact`;

const initialMessages: Message[] = [
  { type: 'system', text: 'CONTACT TERMINAL v2.1.0' },
  { type: 'system', text: 'Type /help for available commands' },
  { type: 'system', text: '> Ready for input...' },
];

const initialFormData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
};

export function TerminalContact({ isModal = false, onClose }: TerminalContactProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const commands = [
    '/name',
    '/email',
    '/phone',
    '/message',
    '/send',
    '/clear',
    '/help',
    '/matrix',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Matrix Effect
  useEffect(() => {
    if (!isMatrixMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Auto-stop after 10 seconds
    const timeout = setTimeout(() => {
      setIsMatrixMode(false);
    }, 10000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeout);
    };
  }, [isMatrixMode]);

  useEffect(() => {
    if (input.startsWith('/')) {
      const matches = commands.filter(cmd => cmd.startsWith(input.toLowerCase()));
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const sendContactMessage = async () => {
    const missingFields = [
      ['First name', formData.firstName],
      ['Last name', formData.lastName],
      ['Email', formData.email],
      ['Message', formData.message],
    ].filter(([, value]) => !value.trim());

    if (missingFields.length > 0) {
      setMessages(prev => [
        ...prev,
        { type: 'error', text: 'Error: Missing required fields' },
        ...missingFields.map(([label]) => ({ type: 'system' as const, text: `${label}: NOT SET` })),
      ]);
      return;
    }

    setIsSending(true);
    setMessages(prev => [...prev, { type: 'system', text: `Sending message to ${CONTACT_ENDPOINT}...` }]);

    try {
      const payload: Record<string, string> = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        organisation_id: '2c4d46bb-611b-463a-9cd4-1486a755850a',
        email: formData.email,
        enquiry_type: 'general',
        message: formData.message,
      };

      if (formData.phone.trim()) {
        payload.phone = formData.phone;
      }

      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let responseBody: ContactApiResponse = {};
      try {
        responseBody = (await response.json()) as ContactApiResponse;
      } catch {
        // Ignore JSON parse errors and fall back to status-based messages.
      }

      if (!response.ok || !responseBody.ok) {
        const errorMessage = responseBody.message || `Request failed with status ${response.status}`;
        setMessages(prev => [...prev, { type: 'error', text: `Error: ${errorMessage}` }]);
        return;
      }

      setMessages(prev => [
        ...prev,
        { type: 'success', text: '✓ Message sent successfully!' },
        { type: 'system', text: responseBody.message || 'Contact form submitted successfully.' },
      ]);
      setFormData(initialFormData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unexpected network error';
      setMessages(prev => [...prev, { type: 'error', text: `Error: ${errorMessage}` }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    // Add user input to messages
    setMessages(prev => [...prev, { type: 'user', text: `> ${input}` }]);

    const trimmedInput = input.trim();
    const parts = trimmedInput.split(' ');
    const command = parts[0].toLowerCase();
    const value = parts.slice(1).join(' ');

    switch (command) {
      case '/help':
        setMessages(prev => [
          ...prev,
          { type: 'system', text: 'Available commands:' },
          { type: 'system', text: '  /name <full name> - Set first and last name' },
          { type: 'system', text: '  /email <your email> - Set your email' },
          { type: 'system', text: '  /phone <phone number> - Set your phone number' },
          { type: 'system', text: '  /message <your message> - Set your message' },
          { type: 'system', text: '  /send - Send message' },
          { type: 'system', text: '  /clear - Clear the terminal' },
          { type: 'system', text: '  /help - Show this help' },
          { type: 'system', text: '  /matrix - Enter the Matrix' },
        ]);
        break;

      case '/name':
        if (!value) {
          setMessages(prev => [...prev, { type: 'error', text: 'Error: Please provide a name' }]);
        } else {
          const nameParts = value.trim().split(/\s+/);
          const firstName = nameParts[0] || '';
          const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'not given';

          if (!firstName) {
            setMessages(prev => [...prev, { type: 'error', text: 'Error: Please provide at least a first name' }]);
          } else {
            setFormData(prev => ({ ...prev, firstName, lastName }));
            setMessages(prev => [...prev, { type: 'success', text: `✓ Name set to: ${firstName} ${lastName}` }]);
          }
        }
        break;

      case '/email':
        if (!value) {
          setMessages(prev => [...prev, { type: 'error', text: 'Error: Please provide an email' }]);
        } else if (!value.includes('@')) {
          setMessages(prev => [...prev, { type: 'error', text: 'Error: Invalid email format' }]);
        } else {
          setFormData(prev => ({ ...prev, email: value }));
          setMessages(prev => [...prev, { type: 'success', text: `✓ Email set to: ${value}` }]);
        }
        break;

      case '/phone':
        if (!value) {
          setMessages(prev => [...prev, { type: 'error', text: 'Error: Please provide a phone number' }]);
        } else {
          setFormData(prev => ({ ...prev, phone: value }));
          setMessages(prev => [...prev, { type: 'success', text: `✓ Phone set to: ${value}` }]);
        }
        break;

      case '/message':
        if (!value) {
          setMessages(prev => [...prev, { type: 'error', text: 'Error: Please provide a message' }]);
        } else {
          setFormData(prev => ({ ...prev, message: value }));
          setMessages(prev => [...prev, { type: 'success', text: `✓ Message set: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}` }]);
        }
        break;

      case '/send':
        if (isSending) {
          setMessages(prev => [...prev, { type: 'system', text: 'Request already in progress...' }]);
        } else {
          await sendContactMessage();
        }
        break;

      case '/clear':
        setMessages(initialMessages);
        setFormData(initialFormData);
        break;

      case '/matrix':
        setMessages(prev => [
          ...prev,
          { type: 'success', text: '🕶️ Entering the Matrix...' },
          { type: 'system', text: 'Wake up, Neo...' },
        ]);
        setIsMatrixMode(true);
        break;

      default:
        setMessages(prev => [
          ...prev,
          { type: 'error', text: `Error: Unknown command "${command}"` },
          { type: 'system', text: 'Type /help for available commands' },
        ]);
    }

    setInput('');
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion + ' ');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'system':
        return 'text-purple-300';
      case 'user':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-300';
    }
  };

  const terminalContent = (
    <div className={`${isModal ? 'w-full max-w-4xl' : 'w-full max-w-4xl mx-auto'}`}>
      <div className="relative bg-black/80 backdrop-blur-sm border border-purple-500/40 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        {/* Matrix Effect Canvas */}
        {isMatrixMode && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-50 pointer-events-none"
          />
        )}

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-10">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-[scanline_8s_linear_infinite]" />
        </div>

        {/* Terminal Header */}
        <div className="bg-purple-900/40 px-4 py-2 flex items-center gap-2 border-b border-purple-500/30">
          <div
            className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:brightness-125 transition-all"
            onClick={isModal ? onClose : undefined}
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-purple-300 text-xs sm:text-sm font-mono">contact@terminal</span>
        </div>

        {/* Terminal Content */}
        <div className="p-3 sm:p-6 h-[40vh] sm:h-[500px] max-h-[600px] overflow-y-auto font-mono text-xs sm:text-sm">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-1 ${getMessageColor(msg.type)}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Autocomplete Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-3 sm:px-6 pb-2">
            <div className="bg-purple-900/40 border border-purple-500/30 rounded p-2">
              <div className="text-purple-400 text-xs font-mono mb-1">Suggestions:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-2 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-green-400 text-xs font-mono rounded border border-purple-500/30 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-purple-500/30 bg-purple-900/20 px-3 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono">{'>'}</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-transparent text-green-400 font-mono outline-none placeholder-green-600/50 caret-transparent"
                placeholder={isSending ? 'Sending...' : 'Type a command...'}
                autoFocus
                disabled={isSending}
                style={{ caretColor: 'transparent' }}
              />
              <span
                className={`absolute top-0 left-0 text-green-400 font-mono pointer-events-none transition-opacity duration-100 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  transform: `translateX(${input.length * 0.6}em)`,
                }}
              >
                ▊
              </span>
            </div>
          </div>
        </form>

        <style>{`
          @keyframes scanline {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(100%);
            }
          }
        `}</style>
      </div>

      {/* Quick Reference */}
      {!isModal && (
        <div className="mt-4 text-center">
          <p className="text-purple-400/60 text-sm font-mono">
            Quick tip: Start typing "/" to see available commands
          </p>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Terminal Content */}
        <div className="relative z-10 w-full max-w-4xl animate-[fadeIn_0.3s_ease-out]">
          {terminalContent}
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  return terminalContent;
}
