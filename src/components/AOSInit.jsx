// src/components/AOSInit.jsx
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
  useEffect(() => {
    AOS.init({ once: false });
    window.addEventListener('scroll', () => AOS.refresh());
    document.addEventListener('DOMContentLoaded', () => AOS.refresh());

    return () => {
      window.removeEventListener('scroll', () => AOS.refresh());
      document.removeEventListener('DOMContentLoaded', () => AOS.refresh());
    };
  }, []);

  return null;
}
