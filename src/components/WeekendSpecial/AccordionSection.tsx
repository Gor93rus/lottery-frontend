import { useState } from 'react';
import './AccordionSection.css';

interface AccordionSectionProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSection({ 
  icon, 
  title, 
  children, 
  defaultOpen = false 
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="ws-accordion-section">
      <button
        className={`ws-accordion-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="ws-accordion-icon">{icon}</span>
        <span className="ws-accordion-title">{title}</span>
        <span className={`ws-accordion-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="ws-accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}
