export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white px-4 sm:px-6 py-8 md:py-10 mt-10 md:mt-12">
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Brand */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-3">Solit 03</h2>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Toko Laptop Second Berkualitas Rasa Baru. 
              Menyediakan berbagai pilihan laptop terbaik dengan harga terjangkau 
              dan kualitas terjamin.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-3">Menu</h3>
            <ul className="space-y-1.5 text-gray-300 text-xs md:text-sm">
              <li><a href="/" className="hover:text-white transition-colors cursor-pointer">Home</a></li>
              <li><a href="/katalog" className="hover:text-white transition-colors cursor-pointer">Katalog</a></li>
              <li><a href="/jual-beli" className="hover:text-white transition-colors cursor-pointer">Jual-Beli Laptop</a></li>
              <li><a href="/tentang" className="hover:text-white transition-colors cursor-pointer">Tentang</a></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-3">Kontak</h3>
            <ul className="space-y-1.5 text-gray-300 text-xs md:text-sm">
              <li className="break-words">WhatsApp: +62 852-1064-7047</li>
              <li className="break-words">Email: solit03@gmail.com</li>
              <li>Depok, Indonesia</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-3">Follow Us</h3>
            <ul className="space-y-1.5 text-gray-300 text-xs md:text-sm">
              <li>
                <a href="https://instagram.com/solit.comp" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://tiktok.com/@solusi_it03" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://shopee.co.id/solit_03?entryPoint=ShopBySearch&searchKeyword=solit03" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Shopee
                </a>
              </li>
              <li>
                <a href="https://www.tokopedia.com/solit03" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Tokopedia
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 mt-6 md:mt-8 pt-4 md:pt-5 text-center text-gray-400 text-[10px] md:text-xs">
          © {currentYear} Solit 03. All rights reserved.
        </div>
      </div>
    </footer>
  );
}