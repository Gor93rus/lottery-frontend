import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Props {
  categories: Category[];
  activeIndex: number;
  onCategoryChange: (index: number) => void;
}

export default function FAQSwipeCategories({ categories, activeIndex, onCategoryChange }: Props) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < categories.length - 1) {
      onCategoryChange(activeIndex + 1);
    }
    
    if (isRightSwipe && activeIndex > 0) {
      onCategoryChange(activeIndex - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div 
      className="faq-swipe-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="faq-category-slider"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className={`category-slide ${index === activeIndex ? 'active' : ''}`}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
          </div>
        ))}
      </div>
      
      <div className="category-dots">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => onCategoryChange(index)}
            aria-label={`Go to ${category.name} category`}
          />
        ))}
      </div>
    </div>
  );
}
