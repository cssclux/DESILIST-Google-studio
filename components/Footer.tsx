

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-white mb-2">Company</h3>
            <ul>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">About Us</a></li>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Careers</a></li>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Support</h3>
            <ul>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Help Center</a></li>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Safety Tips</a></li>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Legal</h3>
            <ul>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Terms of Use</a></li>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Connect</h3>
            <ul>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Facebook</a></li>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Twitter</a></li>
              <li><a href="#" className="text-slate-200 hover:text-white hover:underline">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-300 border-t border-primary-dark/50 mt-8 pt-6">
          <p>&copy; {new Date().getFullYear()} OJA.ng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};