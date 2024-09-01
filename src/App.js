import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUpFormStep1 from './Components/Signup';
import SignUpFormStep2 from './Components/Signup2';
import LoginForm from './Components/Login';
import MainScreen from './Components/Mainpage/MainScreen';
import HistoryPage from './Components/Patient_History/HistoryPage';
import HealthInfoPage from './Components/Patient_Info/HealthInfoPage';
import Navbar from './Components/Navbar';
import AuthProvider from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import PublicRoute from './Components/PublicRoute';
import Test from './Components/Test';
import HistoryDetail from './Components/Patient_History/HistoryDetail';
import HistoryProvider from './Components/Patient_History/HistoryContext';
import MedicationPage from './Components/Patient_History/MedicationPage';
import HospitalMembers from './Components/Hospital_Manage/HospitalMembers'; // HospitalMembers 컴포넌트 추가

const App = () => {
  return (
    <AuthProvider>
      <HistoryProvider>
        <Router>
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route element={<PublicRoute />}>
                {/* 회원가입을 단계별로 나눔 */}
                <Route path="/signup" element={<SignUpFormStep1 />} />
                <Route path="/signup-step2" element={<SignUpFormStep2 />} />
                
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<LoginForm />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/history/:id" element={<HistoryDetail />} />
                <Route path="/history/:id/medication" element={<MedicationPage />} />
                <Route path="/health-info/:id" element={<HealthInfoPage />} />
                <Route path="/test" element={<Test />} />
                <Route path="/mainscreen" element={<MainScreen />} />
                <Route path="/hospital" element={<HospitalMembers />} /> {/* HospitalMembers 라우트 추가 */}
              </Route>
            </Routes>
          </div>
        </Router>
      </HistoryProvider>
    </AuthProvider>
  );
};

export default App;
