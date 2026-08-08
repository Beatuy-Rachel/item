import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import Items from '@/pages/Items';
import NewItem from '@/pages/NewItem';
import ItemDetail from '@/pages/ItemDetail';
import Wishes from '@/pages/Wishes';
import NewWish from '@/pages/NewWish';
import WishDetail from '@/pages/WishDetail';
import Stats from '@/pages/Stats';
import Settings from '@/pages/Settings';
import { useItemStore } from '@/store/useItemStore';
import { useWishStore } from '@/store/useWishStore';

function AppContent() {
  const location = useLocation();
  const initItemStore = useItemStore((state) => state.init);
  const initWishStore = useWishStore((state) => state.init);
  const itemLoading = useItemStore((state) => state.isLoading);
  const wishLoading = useWishStore((state) => state.isLoading);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    Promise.all([initItemStore(), initWishStore()]).then(() => {
      setDbReady(true);
    });
  }, [initItemStore, initWishStore]);
  
  const showBottomNav = !['/items/new', '/wishes/new'].some(p => 
    location.pathname.startsWith(p)
  ) && !location.pathname.match(/\/items\/[^/]+/) && !location.pathname.match(/\/wishes\/[^/]+/);

  if (!dbReady || itemLoading || wishLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-cream-100 dark:bg-ink-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink-300 border-t-ink-800 dark:border-ink-600 dark:border-t-cream-100 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-ink-500 dark:text-ink-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/new" element={<NewItem />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items/:id/edit" element={<NewItem />} />
        <Route path="/wishes" element={<Wishes />} />
        <Route path="/wishes/new" element={<NewWish />} />
        <Route path="/wishes/:id" element={<WishDetail />} />
        <Route path="/wishes/:id/edit" element={<NewWish />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
          <BottomNav />
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
