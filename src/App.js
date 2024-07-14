import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './Components/Signup';
import LoginForm from './Components/Login';
import MainScreen from './Components/MainScreen';
import HistoryPage from './Components/HistoryPage';
import HealthInfoPage from './Components/HealthInfoPage';
import Navbar from './Components/Navbar';
import AuthProvider from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import PublicRoute from './Components/PublicRoute';
import Test from './Components/Test';
import HistoryDetail from './Components/HistoryDetail';
import HistoryProvider from './Components/HistoryContext';
import MedicationPage from './Components/MedicationPage';

const App = () => {
  return (
    <AuthProvider>
      <HistoryProvider>
        <Router>
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<LoginForm />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/history/:id" element={<HistoryDetail />} />
                <Route path="/history/:id/medication" element={<MedicationPage />} />
                <Route path="/health-info" element={<HealthInfoPage />} />
                <Route path="/test" element={<Test />} />
                <Route path="/mainscreen" element={<MainScreen />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </HistoryProvider>
    </AuthProvider>
  );
};

export default App;
