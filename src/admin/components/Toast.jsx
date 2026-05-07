import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animasi masuk
        setTimeout(() => setIsVisible(true), 10);

        // Animasi keluar
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-600" />,
        error: <XCircle className="w-5 h-5 text-red-600" />,
        warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
        info: <Info className="w-5 h-5 text-blue-600" />
    };

    const colors = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800"
    };

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none`}>
            <div
                className={`
          pointer-events-auto
          transform transition-all duration-300 ease-out
          ${isVisible ? "translate-y-4 opacity-100" : "-translate-y-full opacity-0"}
          max-w-md w-full mx-4
        `}
            >
                <div className={`
          flex items-center gap-3 p-4 rounded-xl shadow-lg border
          ${colors[type]}
        `}>
                    <div className="flex-shrink-0">
                        {icons[type]}
                    </div>
                    <p className="flex-1 text-sm font-medium">{message}</p>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="flex-shrink-0 hover:opacity-70 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}