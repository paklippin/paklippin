import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: { primary:'#1A1A1A', accent:'#FF6B35', secondary:'#F8F9FA', success:'#28A745', error:'#DC3545' },
        text: { primary:'#1A1A1A', secondary:'#5A5A5A' },
        border: '#E0E0E0',
      },
      boxShadow: { DEFAULT:'0 4px 20px rgba(0,0,0,0.08)', hover:'0 8px 30px rgba(0,0,0,0.15)' },
      fontFamily: { sans:['Inter','system-ui','sans-serif'], display:['Inter','system-ui','sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
