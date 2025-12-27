import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const AdminChatWidget: React.FC = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const TAWK_PROPERTY_ID = import.meta.env.VITE_TAWKTO_PROPERTY_ID;
    const TAWK_WIDGET_ID = import.meta.env.VITE_TAWKTO_WIDGET_ID;
    if (window.Tawk_API) {
      if (user) {
        window.Tawk_API.setAttributes({
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.primaryEmailAddress?.emailAddress || '',
          userId: user.id,
        });
      }
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    script.onload = () => {
      if (user && window.Tawk_API) {
        window.Tawk_API.onLoad = function() {
          window.Tawk_API.setAttributes({
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.primaryEmailAddress?.emailAddress || '',
            userId: user.id,
          });
        };
      }
    };

    document.body.appendChild(script);

    return () => {
      const tawkScript = document.querySelector(`script[src*="embed.tawk.to"]`);
      if (tawkScript) {
        tawkScript.remove();
      }
      
      const tawkWidget = document.getElementById('tawk-bubble-container');
      if (tawkWidget) {
        tawkWidget.remove();
      }

      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, [user, isLoaded]);

  return null;
};

export default AdminChatWidget;