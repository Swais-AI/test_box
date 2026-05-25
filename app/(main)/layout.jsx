import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      <Navbar />
      <main className="flex-grow pb-20">{children}</main>
      <Footer />
    </div>
  );
}
