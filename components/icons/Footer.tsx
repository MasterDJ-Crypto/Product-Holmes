import React from 'react';

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <footer className="py-12 text-center text-gray-600 text-xs mt-12">
      {children && <div className="mb-6">{children}</div>}
      <p className="mb-2">Product Holmes Intelligence.</p>
      <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
};

export default Footer;