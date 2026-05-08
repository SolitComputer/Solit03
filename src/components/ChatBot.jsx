import { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabase";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Laptop,
  Truck,
  Shield,
  MessageSquare,
  DollarSign,
  Package,
  Sparkles,
  Minus,
  Plus,
  Search,
  TrendingUp,
  Info,
  Store
} from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadDataFromDatabase();
  }, []);

  const loadDataFromDatabase = async () => {
    try {
      // Load products
      const { data: productsData } = await supabase
        .from("products")
        .select(`
          *,
          brands(name, color),
          categories(name)
        `)
        .eq("is_active", true)
        .limit(10);

      // Load brands
      const { data: brandsData } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      // Load categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      setProducts(productsData || []);
      setBrands(brandsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: "bot",
          text: "Halo! 👋 Saya Asisten Virtual Solit 03. Ada yang bisa saya bantu?",
          timestamp: new Date(),
        },
        {
          id: 2,
          type: "bot",
          text: `Saya siap membantu Anda mencari laptop second berkualitas! Saat ini ada ${products.length} produk tersedia. 😊`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [products.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const quickReplies = [
    { text: "Lihat Katalog", icon: <Laptop size={14} />, action: "catalog" },
    { text: "Cek Harga", icon: <DollarSign size={14} />, action: "price" },
    { text: "Cari Produk", icon: <Search size={14} />, action: "search" },
    { text: "Info Brand", icon: <Store size={14} />, action: "brands" },
    { text: "Garansi", icon: <Shield size={14} />, action: "warranty" },
    { text: "Hubungi WA", icon: <MessageSquare size={14} />, action: "whatsapp" },
  ];

  // AI Function untuk memahami pertanyaan
  const understandQuery = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Deteksi intent
    if (message.includes("katalog") || message.includes("produk") || message.includes("laptop") || message.includes("tersedia")) {
      return { intent: "catalog", confidence: 0.9 };
    }
    
    if (message.includes("harga") || message.includes("price") || message.includes("berapa") || message.includes("mahal") || message.includes("murah")) {
      return { intent: "price", confidence: 0.9 };
    }
    
    if (message.includes("cari") || message.includes("mencari") || message.includes("rekomendasi")) {
      return { intent: "search", confidence: 0.85 };
    }
    
    if (message.includes("brand") || message.includes("merk")) {
      return { intent: "brands", confidence: 0.85 };
    }
    
    if (message.includes("garansi") || message.includes("warranty")) {
      return { intent: "warranty", confidence: 0.95 };
    }
    
    if (message.includes("kirim") || message.includes("pengiriman") || message.includes("antar") || message.includes("shipping")) {
      return { intent: "shipping", confidence: 0.9 };
    }
    
    if (message.includes("alamat") || message.includes("toko") || message.includes("lokasi")) {
      return { intent: "store", confidence: 0.95 };
    }
    
    if (message.includes("wa") || message.includes("whatsapp") || message.includes("kontak") || message.includes("hubungi")) {
      return { intent: "whatsapp", confidence: 0.95 };
    }
    
    // Deteksi brand spesifik
    const brandFound = brands.find(b => message.includes(b.name.toLowerCase()));
    if (brandFound) {
      return { intent: "brand_specific", brand: brandFound, confidence: 0.9 };
    }
    
    // Deteksi kata kunci produk
    if (message.includes("spesifikasi") || message.includes("spec") || message.includes("processor") || message.includes("ram")) {
      return { intent: "specifications", confidence: 0.8 };
    }
    
    return { intent: "unknown", confidence: 0.5 };
  };

  // Get response based on intent
  const getResponse = async (intent, userMessage, brand = null) => {
    setIsTyping(true);
    
    setTimeout(async () => {
      let response = "";
      
      switch(intent) {
        case "catalog":
          response = `Saat ini kami memiliki ${products.length} produk laptop second berkualitas. Beberapa di antaranya:\n\n`;
          products.slice(0, 5).forEach((p, idx) => {
            const price = p.normal_price || p.price;
            response += `${idx + 1}. ${p.name} - ${p.brands?.name || 'Unknown Brand'} - Rp ${price?.toLocaleString('id-ID')}\n`;
          });
          response += `\nIngin lihat lebih lengkap? Klik tombol di bawah untuk ke katalog.`;
          addBotMessage(response);
          setTimeout(() => {
            addBotMessageWithButton("buka_katalog", "Lihat Semua Produk");
          }, 500);
          break;
          
        case "price":
          const prices = products.map(p => p.normal_price || p.price).filter(p => p);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          response = `💰 Informasi Harga Laptop Solit 03:\n\n`;
          response += `Harga termurah: Rp ${minPrice?.toLocaleString('id-ID')}\n`;
          response += `Harga termahal: Rp ${maxPrice?.toLocaleString('id-ID')}\n`;
          response += `Rata-rata harga: Rp ${Math.round(prices.reduce((a,b) => a + b, 0) / prices.length).toLocaleString('id-ID')}\n\n`;
          response += `Apakah Anda mencari laptop dengan budget tertentu?`;
          addBotMessage(response);
          setTimeout(() => {
            setShowQuickReplies(true);
          }, 1000);
          break;
          
        case "search":
          // Extract search keyword
          const keywords = userMessage.toLowerCase().split(" ");
          const searchTerms = keywords.filter(k => !["cari", "mencari", "rekomendasi", "laptop", "yang"].includes(k));
          const searchKeyword = searchTerms[0] || "";
          
          const searchResults = products.filter(p => 
            p.name.toLowerCase().includes(searchKeyword) ||
            p.brands?.name?.toLowerCase().includes(searchKeyword)
          );
          
          if (searchResults.length > 0) {
            response = `🔍 Hasil pencarian untuk "${searchKeyword}":\n\n`;
            searchResults.slice(0, 5).forEach((p, idx) => {
              const price = p.normal_price || p.price;
              response += `${idx + 1}. ${p.name} - ${p.brands?.name} - Rp ${price?.toLocaleString('id-ID')}\n`;
            });
            if (searchResults.length > 5) {
              response += `\nDan ${searchResults.length - 5} produk lainnya...`;
            }
          } else {
            response = `Maaf, saya tidak menemukan produk dengan kata kunci "${searchKeyword}". Coba kata kunci lain atau lihat katalog kami.`;
          }
          addBotMessage(response);
          setTimeout(() => {
            addBotMessageWithButton("buka_katalog", "Lihat Katalog");
          }, 500);
          break;
          
        case "brands":
          response = `🏷️ Brand Laptop yang tersedia:\n\n`;
          brands.forEach((b, idx) => {
            const productCount = products.filter(p => p.brand_id === b.id).length;
            response += `${idx + 1}. ${b.name} (${productCount} produk)\n`;
          });
          response += `\nApakah Anda tertarik dengan brand tertentu?`;
          addBotMessage(response);
          setTimeout(() => {
            setShowQuickReplies(true);
          }, 1000);
          break;
          
        case "brand_specific":
          const brandProducts = products.filter(p => p.brand_id === brand.id);
          response = `✨ Produk ${brand.name} yang tersedia:\n\n`;
          brandProducts.slice(0, 5).forEach((p, idx) => {
            const price = p.normal_price || p.price;
            response += `${idx + 1}. ${p.name} - Rp ${price?.toLocaleString('id-ID')}\n`;
          });
          if (brandProducts.length > 5) {
            response += `\nDan ${brandProducts.length - 5} produk lainnya...`;
          }
          addBotMessage(response);
          setTimeout(() => {
            addBotMessageWithButton("buka_katalog", `Lihat Semua ${brand.name}`);
          }, 500);
          break;
          
        case "warranty":
          response = `✅ Informasi Garansi Solit 03:\n\n`;
          response += `• Garansi 1 tahun penuh untuk kerusakan komponen\n`;
          response += `• Garansi berlaku di seluruh Indonesia\n`;
          response += `• Service center resmi tersedia\n`;
          response += `• Support online 24/7 untuk konsultasi\n\n`;
          response += `Ada yang ingin ditanyakan tentang garansi?`;
          addBotMessage(response);
          setTimeout(() => {
            setShowQuickReplies(true);
          }, 1000);
          break;
          
        case "shipping":
          response = `🚚 Informasi Pengiriman:\n\n`;
          response += `• FREE ONGKIR untuk area Depok, Jakarta, Bogor, Tangerang, Bekasi\n`;
          response += `• Luar kota: biaya disesuaikan dengan lokasi\n`;
          response += `• Packing aman dan double bubble wrap\n`;
          response += `• Asuransi pengiriman tersedia\n\n`;
          response += `Butuh info lebih detail? Hubungi kami via WhatsApp.`;
          addBotMessage(response);
          setTimeout(() => {
            addBotMessageWithWhatsApp();
          }, 500);
          break;
          
        case "store":
          response = `📍 Alamat Toko Solit 03:\n\n`;
          response += `Jl. Kavling Adhi Karya No. 77\n`;
          response += `Rangkapan Jaya Lama, Pancoran Mas\n`;
          response += `Kota Depok, Jawa Barat\n\n`;
          response += `⏰ Jam Operasional:\n`;
          response += `Senin - Sabtu: 09.00 - 17.00\n`;
          response += `Minggu: Tutup\n\n`;
          response += `📞 Telepon: +62 852-1064-7047`;
          addBotMessage(response);
          setTimeout(() => {
            addBotMessageWithWhatsApp();
          }, 500);
          break;
          
        case "whatsapp":
          response = `💬 Hubungi Kami via WhatsApp:\n\n`;
          response += `Nomor: +62 852-1064-7047\n\n`;
          response += `Klik tombol di bawah untuk chat langsung dengan admin kami.`;
          addBotMessage(response);
          setTimeout(() => {
            addBotMessageWithWhatsApp();
          }, 500);
          break;
          
        case "specifications":
          response = `📋 Spesifikasi Laptop Solit 03:\n\n`;
          response += `Laptop kami dilengkapi dengan spesifikasi:\n`;
          response += `• Processor: Intel Core i5/i7/Ryzen\n`;
          response += `• RAM: 8GB - 32GB\n`;
          response += `• Storage: 256GB - 1TB SSD\n`;
          response += `• Garansi 1 tahun\n\n`;
          response += `Untuk detail spesifikasi produk tertentu, silakan lihat di katalog ya!`;
          addBotMessage(response);
          setTimeout(() => {
            addBotMessageWithButton("buka_katalog", "Lihat Spesifikasi Lengkap");
          }, 500);
          break;
          
        default:
          response = `Maaf, saya belum mengerti pertanyaan Anda. 😊\n\nSilakan pilih salah satu topik di bawah atau hubungi kami langsung via WhatsApp ya!`;
          addBotMessage(response);
          setTimeout(() => {
            setShowQuickReplies(true);
          }, 1000);
      }
      
      setIsTyping(false);
    }, 800);
  };

  const handleQuickReply = (action) => {
    setShowQuickReplies(false);
    const replyText = quickReplies.find(q => q.action === action).text;
    addUserMessage(replyText);
    
    const intent = understandQuery(replyText);
    getResponse(intent.intent, replyText, intent.brand);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: "user",
      text: text,
      timestamp: new Date(),
    }]);
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: "bot",
      text: text,
      timestamp: new Date(),
    }]);
  };

  const addBotMessageWithButton = (action, buttonText) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: "bot",
      text: "",
      hasButton: true,
      buttonAction: action,
      buttonText: buttonText,
      timestamp: new Date(),
    }]);
  };

  const addBotMessageWithWhatsApp = () => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: "bot",
      text: "",
      hasWhatsApp: true,
      timestamp: new Date(),
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    addUserMessage(userMsg);
    setInputMessage("");
    
    const intent = understandQuery(userMsg);
    await getResponse(intent.intent, userMsg, intent.brand);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const goToCatalog = () => {
    window.location.href = "/katalog";
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/6285210647047?text=Halo%20Solit%2003%2C%20saya%20butuh%20bantuan%20untuk%20laptop", "_blank");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            <MessageCircle size={24} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-[95vw] sm:max-w-[400px] animate-slideUp">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Solit 03 Assistant</h3>
              <p className="text-blue-100 text-[10px]">Online • ${products.length} produk tersedia</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-white"
            >
              {isMinimized ? <Plus size={16} /> : <Minus size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="h-[400px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" 
                        ? "bg-blue-100" 
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                    }`}>
                      {message.type === "user" 
                        ? <User size={14} className="text-blue-600" />
                        : <Bot size={14} className="text-white" />
                      }
                    </div>
                    <div>
                      {message.text && (
                        <div className={`px-3 py-2 rounded-2xl ${
                          message.type === "user"
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm"
                        }`}>
                          <p className="text-xs whitespace-pre-line">{message.text}</p>
                        </div>
                      )}
                      
                      {/* Button for catalog */}
                      {message.hasButton && (
                        <button
                          onClick={goToCatalog}
                          className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                        >
                          <Laptop size={12} />
                          {message.buttonText || "Lihat Katalog Sekarang"}
                        </button>
                      )}

                      {/* WhatsApp button */}
                      {message.hasWhatsApp && (
                        <button
                          onClick={openWhatsApp}
                          className="mt-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-all hover:scale-105 flex items-center gap-1"
                        >
                          <MessageSquare size={12} />
                          Chat via WhatsApp
                        </button>
                      )}
                      
                      <p className="text-[9px] text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-3 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-3 py-2 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && (
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                  <Sparkles size={10} className="text-yellow-500" />
                  Pilih topik yang ingin ditanyakan:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply.action)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all hover:scale-105"
                    >
                      {reply.icon}
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-gray-100 bg-white">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tanya apa saja tentang laptop..."
                    rows="1"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    style={{ maxHeight: "80px" }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[9px] text-gray-400 text-center mt-2">
                💡 Tips: Coba tanyakan "cari laptop Lenovo" atau "harga termurah"
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </div>
  );
}