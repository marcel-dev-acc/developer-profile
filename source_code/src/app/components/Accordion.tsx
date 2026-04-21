import { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: LucideIcon;
}

export function Accordion({ title, children, defaultOpen = false, icon: Icon }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-purple-500/30 rounded-lg overflow-hidden bg-purple-950/20 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left bg-purple-900/30 hover:bg-purple-900/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-purple-400" />}
          <span className="text-purple-100">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 py-4 text-purple-200/90">{children}</div>
      </div>
    </div>
  );
}
