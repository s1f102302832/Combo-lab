import React, { useEffect, useState } from 'react';
import { useAppStore } from './store';
import { DashboardPage } from './pages/DashboardPage';
import { TreePage } from './pages/TreePage';
import { AuthPage } from './pages/AuthPage';
import { ComboLabApp } from './Combo-lab/ComboLabApp';
import { supabase } from './utils/supabaseClient';

/**
 * App.tsx — アプリのエントリポイント。
 * ログイン状態（user）に応じて、未ログインならAuthPage、ログイン済ならDashboard/TreePageを切り替える。
 */
function App() {
  const view = useAppStore((s) => s.view);
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const [showComboLab, setShowComboLab] = useState(false);

  // アプリ起動時およびセッション変更時にSupabaseの認証状態を同期
  useEffect(() => {
    // 現在のセッションを一度だけ取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 認証状態の変化（ログイン・ログアウト等）をリアルタイムに検知して同期
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (!user) {
    return <AuthPage />;
  }

  if (showComboLab) {
    return <ComboLabApp onGoBack={() => setShowComboLab(false)} />;
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 9999 }}>
        <button 
          onClick={() => setShowComboLab(true)}
          style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          🎮 コンボラボを開く
        </button>
      </div>
      {view === 'dashboard' ? <DashboardPage /> : <TreePage />}
    </div>
  );
}

export default App;