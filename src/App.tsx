import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WizardProvider } from './context/WizardContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyWizards from './pages/MyWizards';
import WizardDetail from './pages/WizardDetail';
import Marketplace from './pages/Marketplace';
import Academy from './pages/Academy';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <WizardProvider>
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-wizards" element={<MyWizards />} />
              <Route path="/wizard/:id" element={<WizardDetail />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/academy" element={<Academy />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WizardProvider>
    </Router>
  );
}

export default App;