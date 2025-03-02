import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = '254755295635';
  const message = 'Hello! I would like to inquire about visa services.';

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 group"
      onClick={handleWhatsAppClick}
    >
      <div className="relative">
        {/* Pulsing effect */}
        <div className="absolute -inset-2 bg-green-500 rounded-full opacity-75 group-hover:opacity-100 blur animate-pulse"></div>
        
        {/* Button container */}
        <div className="relative flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          {/* WhatsApp Icon */}
          <div className="flex-shrink-0 w-10 h-10 relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
            <div className="relative w-full h-full bg-white rounded-full p-1.5">
              <img
                src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-whatsapp-icon-png-image_3584845.jpg"
                alt="WhatsApp"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          
          {/* Text */}
          <div className="text-gray-700 font-medium">
            <span className="block text-sm">Talk to Us</span>
            <span className="block text-xs text-green-600">Online Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppButton;
