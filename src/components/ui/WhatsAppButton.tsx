"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+923001234567";
    const message = encodeURIComponent(
        "Hi MedSurgX! I'm interested in your medical products. Can you help me?"
    );

    return (
        <a
            href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-surface-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with us
            </span>
        </a>
    );
}
