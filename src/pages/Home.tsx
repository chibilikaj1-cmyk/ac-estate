import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin, Star, Shield, Zap, Users, Search, DollarSign, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Property } from '../types';
import { cn } from '../lib/utils';

export function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [slideshow, setSlideshow] = useState<{ id: number; image_url: string }[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setFeaturedProperties(data.filter((p: Property) => p.featured)));
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
    fetch('/api/hero-slideshow')
      .then(res => res.json())
      .then(data => setSlideshow(data));
  }, []);

  useEffect(() => {
    if (slideshow.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideshow.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideshow]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      navigate(`/projects?location=${encodeURIComponent(searchLocation)}`);
    } else {
      navigate('/projects');
    }
  };

  const stats = [
    { value: '500+', label: 'Happy Residents' },
    { value: '2', label: 'Premium Estates' },
    { value: '20+', label: 'Years Experience' },
    { value: '100%', label: 'Owner Managed' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-0 pb-32">
      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={slideshow[currentSlide]?.id || 'default'}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              src={slideshow[currentSlide]?.image_url || settings.hero_image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"}
              alt="Luxury Home"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/50 to-zinc-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
        </div>

        {/* Slide indicators */}
        {slideshow.length > 1 && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {slideshow.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={cn("h-1 rounded-full transition-all duration-500", currentSlide === i ? "bg-emerald-400 w-8" : "bg-white/20 w-3 hover:bg-white/40")} />
            ))}
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl space-y-8">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <span className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>Lusaka's Premier Direct Rentals</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] text-white"
            >
              Rent Direct.<br />
              <span className="text-emerald-400">No Agency</span><br />
              Fees.
            </motion.h1>

            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-zinc-300 max-w-lg leading-relaxed"
            >
              Skip the middlemen. Rent premium homes directly from the owner with transparent terms, personal support, and zero hidden fees.
            </motion.p>

            {/* Search bar */}
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-lg"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by location or unit type..."
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                  className="w-full bg-zinc-900/90 backdrop-blur-sm border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <button type="submit"
                className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-semibold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/25 shrink-0">
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 pt-2"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/30" />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-3">
            <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Featured Listings</span>
            <h2 className="text-4xl font-bold text-white">Available Units</h2>
          </div>
          <Link to="/projects" className="text-emerald-500 font-semibold flex items-center space-x-2 text-sm hover:text-emerald-400 transition-colors group">
            <span>View all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-900 h-[380px] rounded-3xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-emerald-500/8 transition-all group"
              >
                <Link to={`/property/${property.id}`}>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                    <div className="absolute top-4 left-4 bg-zinc-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-white/10">
                      {property.type}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-zinc-900/95 border border-white/10 text-white px-4 py-1.5 rounded-xl font-bold text-sm shadow-lg">
                      ${property.price.toLocaleString()}/mo
                    </div>
                    {property.available_units === 0 && (
                      <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-rose-600/90 text-white px-5 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">Fully Occupied</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-zinc-500 text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                        {property.location}
                      </div>
                      <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {property.available_units}/{property.total_units} Units
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{property.title}</h3>
                    <div className="flex justify-between pt-4 border-t border-white/5 text-xs text-zinc-500">
                      <div className="flex items-center space-x-1"><Users className="w-3.5 h-3.5 text-emerald-500/70" /><span>{property.bedrooms} Beds</span></div>
                      <div className="flex items-center space-x-1"><Shield className="w-3.5 h-3.5 text-emerald-500/70" /><span>{property.bathrooms} Baths</span></div>
                      <div className="flex items-center space-x-1"><Zap className="w-3.5 h-3.5 text-emerald-500/70" /><span>{property.area} sqft</span></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Why Direct Section */}
      <section className="bg-zinc-900/40 py-28 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Why Rent Direct</span>
                <h2 className="text-4xl font-bold text-white leading-tight">Better Living,<br />Managed Personally</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                By renting directly from AC-Estate, you bypass middlemen and deal straight with the decision-maker. We take personal pride in every property and ensure every tenant receives individual attention.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "Direct Communication", desc: "No agencies. Talk directly to the property owner." },
                  { icon: Star, title: "Well-Maintained", desc: "We personally oversee all maintenance and repairs." },
                  { icon: Zap, title: "Quick Approvals", desc: "Streamlined application process with fast decisions." },
                  { icon: Users, title: "Tenant Portal", desc: "Easy rent payments and maintenance requests online." },
                ].map((item, i) => (
                  <div key={i} className="flex space-x-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/20 transition-colors">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/services" className="inline-flex items-center space-x-2 text-emerald-500 font-semibold text-sm hover:text-emerald-400 transition-colors group">
                <span>View all tenant services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Architecture"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-zinc-900 p-7 rounded-3xl shadow-2xl border border-white/5">
                <div className="text-3xl font-black text-emerald-400">20+</div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Years Experience</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-emerald-600 p-5 rounded-2xl shadow-xl">
                <div className="text-2xl font-black text-white">500+</div>
                <div className="text-xs font-bold text-emerald-100 uppercase tracking-wider mt-1">Residents Housed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center space-y-3 mb-16">
          <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Resident Stories</span>
          <h2 className="text-4xl font-bold text-white">What Our Tenants Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Sarah Johnson", role: "Resident since 2022", text: "Renting directly from AC-Estate has been a breath of fresh air. Any issues are handled immediately by the owner himself." },
            { name: "Michael Chen", role: "Resident since 2023", text: "The property is impeccably maintained. It's clear the owner genuinely cares about the quality of life for each tenant." },
            { name: "Emma Williams", role: "Resident since 2021", text: "The maintenance request system is fantastic. Issues are resolved within 24 hours — every single time." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/15 transition-all space-y-5 group"
            >
              <div className="flex space-x-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />)}
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed italic">"{item.text}"</p>
              <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-sm">{item.name[0]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-10 md:p-16 overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white">Find Your Perfect Home Today</h2>
            <p className="text-emerald-100 text-lg">Browse available units and connect directly with the owner. No agencies, no fees.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/projects"
                className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all flex items-center justify-center space-x-2">
                <span>Browse All Units</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact"
                className="bg-emerald-700/60 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-emerald-700/80 transition-all text-center">
                Contact Owner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
