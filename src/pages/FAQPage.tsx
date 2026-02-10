import { useState, useMemo } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import FAQSwipeCategories from '../components/FAQ/FAQSwipeCategories';
import FAQCompactItem from '../components/FAQ/FAQCompactItem';
import FAQSearch from '../components/FAQ/FAQSearch';
import { FAQ_DATA, CATEGORIES } from '../data/faqData';
import './FAQPage.css';

export default function FAQPage() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = CATEGORIES[activeCategoryIndex].id;

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA
      .filter(faq => faq.category === activeCategory)
      .filter(faq => 
        !searchQuery || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [activeCategory, searchQuery]);

  return (
    <div className="faq-page-wrapper">
      <AnimatedBackground />
      <Header />
      
      <div className="faq-page-compact">
        {/* Compact Header */}
        <div className="faq-header-compact">
          <h1><span aria-hidden="true">❓</span> FAQ</h1>
        </div>

        {/* Search */}
        <FAQSearch value={searchQuery} onChange={setSearchQuery} />

        {/* Swipeable Categories */}
        <FAQSwipeCategories 
          categories={CATEGORIES}
          activeIndex={activeCategoryIndex}
          onCategoryChange={setActiveCategoryIndex}
        />

        {/* FAQ List */}
        <div className="faq-list-compact">
          {filteredFAQs.length === 0 ? (
            <div className="faq-empty">
              <p>No questions found</p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <FAQCompactItem 
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
              />
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
