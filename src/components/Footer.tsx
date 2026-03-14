import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-white/5">
      {/* Top CTA strip */}
      <div className="bg-emerald-600/10 border-b border-emerald-500/15 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-300 font-medium">Ready to find your next home? Browse available units now.</p>
          <div className="flex gap-3">
            <Link to="/projects" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-500 transition-all">
              Browse Units
            </Link>
            <a
              href="https://wa.me/260963346465"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-zinc-900 border border-white/10 text-zinc-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-emerald-500/40 hover:text-white transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Building2 className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-white leading-none">AC-<span className="text-emerald-400">ESTATE</span></span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest leading-none">Direct Rentals</span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500">
              Premium rental properties managed directly by the owner. Transparent leasing, dedicated maintenance, and high-quality living in Lusaka.
            </p>
            <div className="flex space-x-2">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: MessageCircle, href: 'https://wa.me/260963346465' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all text-zinc-600">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Available Units', to: '/projects' },
                { label: 'Services', to: '/services' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-zinc-500 hover:text-emerald-400 transition-colors text-sm">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <a href="https://www.google.com/maps/search/G64Q%2B55C,+Makeni+S+Rd,+Lusaka" target="_blank" rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs leading-relaxed">
                  G64Q+55C, Makeni S Rd<br />Lusaka, Zambia
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  <a href="tel:+260961187673" className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs">+260 961 187 673</a>
                  <a href="tel:+260963346465" className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs">+260 963 346 465</a>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:contact@ac-estate.com" className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs">contact@ac-estate.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-widest">Stay Updated</h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Get notified when new units become available.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-zinc-600"
              />
              <button className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-semibold hover:bg-emerald-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-600">
          <p>© {currentYear} AC-Estate Direct Rentals. All rights reserved.</p>
          <div className="flex items-center space-x-5">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Use</a>
            <Link to="/login" className="hover:text-emerald-400 transition-colors">Owner Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
