import { useState, useEffect } from 'react';
import { PremiumSidebar } from './components/PremiumSidebar';
import { TopHeader } from './components/TopHeader';
import { Login } from './components/Login';
import { UrgentReviewModal } from './components/UrgentReviewModal';
import { PremiumDashboard } from './components/PremiumDashboard';
import { PremiumReviewsPage } from './components/PremiumReviewsPage';
import { ReviewResponses } from './components/ReviewResponses';
import { EnhancedAnalytics } from './components/EnhancedAnalytics';
import { mockReviews } from './data/mockReviews';
import { Review, User } from './types';
import { toast, Toaster } from 'sonner';

type Section = 'dashboard' | 'insights' | 'responses' | 'analytics';
type Language = 'ru' | 'kk';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [language, setLanguage] = useState<Language>('ru');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showUrgentModal, setShowUrgentModal] = useState(false);

  const urgentReviews = reviews.filter(
    (r) => r.urgency === 'high' && r.responseStatus === 'pending'
  );

  useEffect(() => {
    if (user && urgentReviews.length > 0) {
      setShowUrgentModal(true);
    }
  }, [user]);

  const handleLogin = (email: string, businessName: string) => {
    setUser({ email, businessName });
    toast.success('Добро пожаловать в ReviewAI!');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSection('dashboard');
    toast.info('Вы вышли из системы');
  };

  const handleRespond = (reviewId: string, response?: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              responseStatus: 'responded' as const,
              response: response || '',
              respondedAt: new Date().toISOString()
            }
          : review
      )
    );
    toast.success('Ответ успешно отправлен!');
    setCurrentSection('responses');
    setShowUrgentModal(false);
  };

  const handleArchive = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, responseStatus: 'archived' as const }
          : review
      )
    );
    toast.info('Отзыв архивирован');
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(reviews, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reviews-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      toast.success('JSON файл успешно экспортирован!');
    } else {
      const headers = ['ID', 'Платформа', 'Рейтинг', 'Дата', 'Текст', 'Настроение', 'Срочность', 'Статус'];
      const rows = reviews.map(r => [
        r.id,
        r.platform,
        r.rating,
        r.date,
        `"${r.text.replace(/"/g, '""')}"`,
        r.sentiment,
        r.urgency,
        r.responseStatus
      ]);
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success('CSV файл успешно экспортирован!');
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F5F6F8]">
      <Toaster position="top-right" richColors />
      
      <PremiumSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={handleLogout}
        urgentCount={urgentReviews.length}
        businessName={user.businessName}
        userName={user.email.split('@')[0]}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader language={language} onLanguageChange={setLanguage} />
        
        {currentSection === 'dashboard' && <PremiumDashboard reviews={reviews} language={language} />}
        {currentSection === 'insights' && (
          <PremiumReviewsPage reviews={reviews} onExport={handleExport} language={language} />
        )}
        {currentSection === 'responses' && (
          <ReviewResponses
            reviews={reviews}
            onRespond={handleRespond}
            onArchive={handleArchive}
          />
        )}
        {currentSection === 'analytics' && <EnhancedAnalytics reviews={reviews} language={language} />}
      </div>

      {showUrgentModal && urgentReviews.length > 0 && (
        <UrgentReviewModal
          reviews={urgentReviews}
          onClose={() => setShowUrgentModal(false)}
          onRespond={handleRespond}
        />
      )}
    </div>
  );
}

export default App;