export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white px-12 py-16 mt-20">
      
      <div className="grid md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Solit 03</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Toko Laptop Second Berkualitas Rasa Baru. 
            Menyediakan berbagai pilihan laptop terbaik dengan harga terjangkau 
            dan kualitas terjamin.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="font-semibold mb-4">Menu</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Katalog</li>
            <li className="hover:text-white cursor-pointer">Jual-Beli Laptop</li>
            <li className="hover:text-white cursor-pointer">Tentang</li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="font-semibold mb-4">Kontak</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>WhatsApp: 08xxxxxxx</li>
            <li>Email: solit@gmail.com</li>
            <li>Depok, Indonesia</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <a href="https://instagram.com/solit.comp" target="_blank">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://tiktok.com/@solusi_it03" target="_blank">
                TikTok
              </a>
            </li>
            <li>
              <a href="https://shopee.co.id" target="_blank">
                Shopee
              </a>
            </li>
            <li>
              <a href="https://tokopedia.com" target="_blank">
                Tokopedia
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-blue-800 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Solit 03. All rights reserved.
      </div>

    </footer>
  );
}