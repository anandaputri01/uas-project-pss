export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">&copy; 2026 Helmet Washing Service. </p>
        <div className="flex justify-center space-x-4">
          <a href="https://instagram.com/wash_helmet.id" target="_blank" rel="noopener noreferrer" className="hover:text-white" aria-label="Instagram wash_helmet.id">
            <i className="fab fa-instagram" />
          </a>
          <a href="https://wa.me/6282232653256" className="hover:text-white" aria-label="WhatsApp">
            <i className="fab fa-whatsapp" />
          </a>
          <a
            href="mailto:wash_helmet.id@gmail.com?subject=Order%20Cuci%20Helm&body=Halo%20HelmetWash,%20saya%20ingin%20booking%20layanan.%20Nama:%20%2C%20No%20HP:%20%2C%20Detail:%20"
            className="hover:text-white"
            aria-label="Email wash_helmet.id@gmail.com"
          >
            <i className="fas fa-envelope" />
          </a>
        </div>
      </div>
    </footer>
  );
}
