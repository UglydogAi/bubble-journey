
import React, { useEffect } from 'react';

interface JotformEmbedHandlerProps {
  formId: string;
}

const JotformEmbedHandler: React.FC<JotformEmbedHandlerProps> = ({ formId }) => {
  useEffect(() => {
    // Create and load the JotForm script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.async = true;
    document.body.appendChild(script);

    // Execute the handler after the script loads
    script.onload = () => {
      if (window.jotformEmbedHandler) {
        window.jotformEmbedHandler(`iframe[id='JotFormIFrame-${formId}']`, 'https://www.jotform.com');
      }
    };

    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, [formId]);

  return null;
};

export default JotformEmbedHandler;
