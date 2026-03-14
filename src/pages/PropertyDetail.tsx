import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Property } from '../types';
import { 
  MapPin, Users, Shield, Zap, ArrowLeft, Calendar, 
  CheckCircle2, Info, MessageSquare, Send, Wrench,
  ExternalLink, CreditCard, FileText, Home, XCircle, Heart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'apply' | 'maintenance'>('details');
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Form states
  const [appForm, setAppForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [maintForm, setMaintForm] = useState({ name: '', issue: '', priority: 'medium' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user && !appForm.name) {
      setAppForm(prev => ({ ...prev, name: user.full_name, email: user.email }));
      setMaintForm(prev => ({ ...prev, name: user.full_name }));
    }
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        setActiveImage(data.image_url);
        setIsLoading(false);
      });

    if (isAuthenticated) {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          setIsFavorite(data.some((f: Property) => f.id === Number(id)));
        });
    }
  }, [id, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const method = isFavorite ? 'DELETE' : 'POST';
    try {
      const res = await fetch(`/api/favorites/${id}`, { method });
      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        property_id: id, 
        user_id: user?.id,
        full_name: appForm.name, 
        ...appForm 
      })
    });
    if (res.ok) {
      setSuccessMsg('Application submitted successfully! We will contact you soon.');
      if (!user) setAppForm({ name: '', email: '', phone: '', message: '' });
    }
    setIsSubmitting(false);
  };

  const handleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: id, tenant_name: maintForm.name, issue_description: maintForm.issue, priority: maintForm.priority })
    });
    if (res.ok) {
      setSuccessMsg('Maintenance request submitted. Our team will be in touch.');
      setMaintForm({ name: '', issue: '', priority: 'medium' });
    }
    setIsSubmitting(false);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Property not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      {/* Hero Image & Gallery */}
      <section className="relative min-h-[70vh] flex flex-col">
        <div className="relative h-[60vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              src={activeImage}
              alt={property.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
          
          {/* Gallery Thumbnails Overlay */}
          {property.images && property.images.length > 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 z-20 overflow-x-auto max-w-[90vw] scrollbar-hide">
              <button
                onClick={() => setActiveImage(property.image_url)}
                className={cn(
                  "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                  activeImage === property.image_url ? "border-emerald-500 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={property.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                    activeImage === img ? "border-emerald-500 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="absolute top-12 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/projects" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Available Units
            </Link>
          </div>
        </div>

        <div className="relative -mt-32 pb-12 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    {property.type}
                  </span>
                  {property.available_units > 0 ? (
                    <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                      {property.available_units} Units Available
                    </span>
                  ) : (
                    <span className="bg-rose-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                      Fully Occupied
                    </span>
                  )}
                  {property.featured && (
                    <span className="bg-zinc-900/90 backdrop-blur-sm text-emerald-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/5">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{property.title}</h1>
                <div className="flex items-center text-zinc-300">
                  <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                  {property.location}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleFavorite}
                  className={cn(
                    "p-4 rounded-3xl backdrop-blur-xl border transition-all flex items-center gap-3 font-bold",
                    isFavorite 
                      ? "bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20" 
                      : "bg-zinc-900/80 text-white border-white/5 hover:bg-zinc-800"
                  )}
                >
                  <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
                  <span>{isFavorite ? 'Saved' : 'Save Property'}</span>
                </button>
                <div className="bg-zinc-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl text-center min-w-[200px] border border-white/5">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Monthly Rent</div>
                  <div className="text-3xl font-bold text-emerald-500">${property.price.toLocaleString()}/mo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Tabs */}
            <div className="flex space-x-1 bg-zinc-900 p-1.5 rounded-2xl w-fit border border-white/5">
              {[
                { id: 'details', label: 'Property Details', icon: Info },
                { id: 'apply', label: 'Apply Now', icon: FileText },
                { id: 'maintenance', label: 'Maintenance', icon: Wrench }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setSuccessMsg(''); }}
                  className={cn(
                    "flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab.id ? "bg-zinc-800 text-emerald-500 shadow-sm border border-white/5" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { icon: Users, label: "Bedrooms", value: property.bedrooms },
                      { icon: Shield, label: "Bathrooms", value: property.bathrooms },
                      { icon: Zap, label: "Area", value: `${property.area} sqft` },
                      { icon: Home, label: "Availability", value: `${property.available_units}/${property.total_units}` },
                      { icon: Calendar, label: "Built Year", value: "2022" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-zinc-900 p-5 rounded-3xl border border-white/5 space-y-2">
                        <stat.icon className="w-5 h-5 text-emerald-500" />
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Description</h3>
                    <p className="text-lg text-zinc-400 leading-relaxed">
                      {property.description} This stunning {property.type.toLowerCase()} offers a unique blend of modern luxury and comfortable living. Located in the highly sought-after {property.location}, it features premium finishes throughout and an open-concept design that maximizes space and natural light.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Smart Home Integration", "High-speed Fiber Internet", "Energy Efficient Appliances",
                        "Private Balcony/Patio", "Secure Underground Parking", "24/7 Concierge Service",
                        "Fitness Center Access", "Rooftop Lounge Area"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center space-x-3 text-zinc-400">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Virtual Tour */}
                  {property.virtual_tour_url && (
                    <div className="bg-zinc-950 rounded-[2.5rem] p-10 text-white space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">Virtual Tour Available</h3>
                        <ExternalLink className="w-6 h-6 text-emerald-500" />
                      </div>
                      <p className="text-zinc-400">Experience this property from the comfort of your home with our immersive 3D virtual tour.</p>
                      <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all">
                        Launch 3D Tour
                      </button>
                    </div>
                  )}

                  {/* Local Area Info */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Local Area Information</h3>
                    <div className="h-[400px] bg-zinc-900 rounded-[2.5rem] overflow-hidden relative border border-white/5">
                       <img 
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80" 
                        alt="Map" 
                        className="w-full h-full object-cover opacity-30 grayscale"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl flex items-center space-x-4 border border-white/5">
                          <MapPin className="w-8 h-8 text-emerald-500" />
                          <div>
                            <div className="font-bold text-white">{property.location}</div>
                            <div className="text-xs text-zinc-500">Nearby: 2 Schools, 1 Park, 3 Hospitals</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

               {activeTab === 'apply' && (
                <motion.div
                  key="apply"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">Online Application</h3>
                    <p className="text-zinc-400">Complete the form below to start your application process. Our team will review your details and get back to you within 48 hours.</p>
                  </div>

                  {property.available_units === 0 ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-12 rounded-[3rem] text-center space-y-6">
                      <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
                      <div className="space-y-2">
                        <h4 className="text-2xl font-bold text-white">Currently Fully Occupied</h4>
                        <p className="text-zinc-400">We are sorry, but there are no units currently available for this property. You can still contact the owner for future availability.</p>
                      </div>
                      <Link to="/contact" className="inline-block bg-zinc-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-all">
                        Inquire for Waitlist
                      </Link>
                    </div>
                  ) : successMsg ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center space-y-4">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                      <div className="text-xl font-bold text-emerald-500">{successMsg}</div>
                      <button onClick={() => setSuccessMsg('')} className="text-emerald-500 font-bold hover:underline">Submit another application</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="bg-zinc-900 p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-xl space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                          <input
                            required
                            type="text"
                            value={appForm.name}
                            onChange={e => setAppForm({ ...appForm, name: e.target.value })}
                            className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-zinc-600"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                          <input
                            required
                            type="email"
                            value={appForm.email}
                            onChange={e => setAppForm({ ...appForm, email: e.target.value })}
                            className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-zinc-600"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Phone Number</label>
                        <input
                          required
                          type="tel"
                          value={appForm.phone}
                          onChange={e => setAppForm({ ...appForm, phone: e.target.value })}
                          className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-zinc-600"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Additional Message</label>
                        <textarea
                          rows={4}
                          value={appForm.message}
                          onChange={e => setAppForm({ ...appForm, message: e.target.value })}
                          className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors resize-none text-white placeholder:text-zinc-600"
                          placeholder="Tell us more about your interest..."
                        ></textarea>
                      </div>
                      <button
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg shadow-emerald-600/20"
                      >
                        {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Submit Application"}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {activeTab === 'maintenance' && (
                <motion.div
                  key="maintenance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">Maintenance Request</h3>
                    <p className="text-zinc-400">Report an issue with your property. Our maintenance team will prioritize requests based on urgency.</p>
                  </div>

                  {successMsg ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center space-y-4">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                      <div className="text-xl font-bold text-emerald-500">{successMsg}</div>
                      <button onClick={() => setSuccessMsg('')} className="text-emerald-500 font-bold hover:underline">Submit another request</button>
                    </div>
                  ) : (
                    <form onSubmit={handleMaintenance} className="bg-zinc-900 p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-xl space-y-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Tenant Name</label>
                        <input
                          required
                          type="text"
                          value={maintForm.name}
                          onChange={e => setMaintForm({ ...maintForm, name: e.target.value })}
                          className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-zinc-600"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Priority Level</label>
                        <select
                          value={maintForm.priority}
                          onChange={e => setMaintForm({ ...maintForm, priority: e.target.value as any })}
                          className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors appearance-none text-white cursor-pointer"
                        >
                          <option value="low" className="bg-zinc-900">Low - Non-urgent</option>
                          <option value="medium" className="bg-zinc-900">Medium - Standard</option>
                          <option value="high" className="bg-zinc-900">High - Urgent / Emergency</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Issue Description</label>
                        <textarea
                          required
                          rows={4}
                          value={maintForm.issue}
                          onChange={e => setMaintForm({ ...maintForm, issue: e.target.value })}
                          placeholder="Please describe the issue in detail..."
                          className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors resize-none text-white placeholder:text-zinc-600"
                        ></textarea>
                      </div>
                      <button
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg shadow-emerald-600/20"
                      >
                        {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Submit Request"}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Owner Card */}
            <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Owner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-white">ARNE OLSEN</h4>
                  <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Property Owner</p>
                </div>
              </div>
              <div className="space-y-4">
                <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                  <MessageSquare className="w-5 h-5" />
                  <span>Message Owner</span>
                </button>
                <button className="w-full bg-zinc-800 text-white py-4 rounded-xl font-bold border border-white/5 hover:bg-zinc-700 transition-all">
                  Schedule Viewing
                </button>
              </div>
            </div>

            {/* Payment Portal Preview */}
            <div className="bg-zinc-950 p-8 rounded-[2.5rem] text-white space-y-6 border border-white/5">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Tenant Portal</h3>
              <p className="text-zinc-400 text-sm">Already a tenant? Access your dashboard to pay rent, sign documents, and track maintenance.</p>
              <div className="space-y-3">
                <button className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Rent Online</span>
                </button>
                <button className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Sign Documents</span>
                </button>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="font-bold text-white">Tenant Resources</h3>
              <ul className="space-y-4">
                {[
                  "Rental Application Guide",
                  "Tenant Rights & Responsibilities",
                  "Neighborhood Guide",
                  "Maintenance FAQ"
                ].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="flex items-center text-sm text-zinc-400 hover:text-emerald-500 transition-colors group">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center mr-3 group-hover:bg-zinc-700 border border-white/5">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </div>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
