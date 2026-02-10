import { useState } from 'react';

interface Props {
  question: string;
  answer: string;
}

export default function FAQCompactItem({ question, answer }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item-compact">
      <button 
        className="faq-question-compact"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Toggle answer for: ${question}`}
      >
        <span className="question-text">{question}</span>
        <span className={`faq-icon-compact ${isOpen ? 'open' : ''}`} aria-hidden="true">
          ▶
        </span>
      </button>
      
      {isOpen && (
        <div className="faq-answer-compact">
          {answer}
        </div>
      )}
    </div>
  );
}
