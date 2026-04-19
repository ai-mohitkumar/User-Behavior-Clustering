import { BrowserRouter as Router } from 'react-router-dom';
import DashboardNew from './MLAnalyticsDirect';
import { AuthProvider } from './AuthContext';

function App() {
  const renderPage = () => {
    return <DashboardNew />;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
          {renderPage()}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

