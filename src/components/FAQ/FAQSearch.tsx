interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function FAQSearch({ value, onChange }: Props) {
  return (
    <div className="faq-search-compact">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input 
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input-compact"
        aria-label="Search FAQ questions"
      />
    </div>
  );
}
