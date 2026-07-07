import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
