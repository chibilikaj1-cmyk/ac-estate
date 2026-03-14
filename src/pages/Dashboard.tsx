import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit, Home, MapPin, Users, CheckCircle, XCircle, RefreshCw, Minus, PlusCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { Property } from '../types';

const Dashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [slideshow, setSlideshow] = useState<{ id: number; image_url: string; display_order: number }[]>([]);
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slideshowInputRef = useRef<HTMLInputElement>(null);
  const propertyMainInputRef = useRef<HTMLInputElement>(null);
  const propertyMultiInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 0,
    location: '',
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    image_url: '',
    total_units: 1,
    available_units: 1,
    featured: false,
    project: 'AC Estate 1',
    images: []
  });

  useEffect(() => {
    fetchProperties();
    fetchSettings();
    fetchSlideshow();
  }, []);

  const fetchSlideshow = async () => {
    const res = await fetch('/api/hero-slideshow');
    const data = await res.json();
    setSlideshow(data);
  };

  const addSlide = async () => {
    if (!newSlideUrl) return;
    await fetch('/api/hero-slideshow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: newSlideUrl, display_order: slideshow.length })
    });
    setNewSlideUrl('');
    fetchSlideshow();
  };

  const deleteSlide = async (id: number) => {
    await fetch(`/api/hero-slideshow/${id}`, { method: 'DELETE' });
    fetchSlideshow();
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
    setHeroImageUrl(data.hero_image_url || '');
  };

  const updateHeroImage = async () => {
    setIsUpdatingSettings(true);
    try {
      await fetch('/api/settings/hero_image_url', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: heroImageUrl })
      });
      fetchSettings();
      alert('Hero image updated successfully!');
    } catch (error) {
      alert('Failed to update hero image');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const fetchProperties = async () => {
    const res = await fetch('/api/properties');
    const data = await res.json();
    setProperties(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProperty ? 'PUT' : 'POST';
    const url = editingProperty ? `/api/properties/${editingProperty.id}` : '/api/properties';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setIsAdding(false);
    setEditingProperty(null);
    setFormData({
      title: '',
      description: '',
      price: 0,
      location: '',
      type: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      image_url: '',
      total_units: 1,
      available_units: 1,
      featured: false,
      project: 'AC Estate 1',
      images: []
    });
    fetchProperties();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this property?')) {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      fetchProperties();
    }
  };

  const handleTakeUnit = async (id: number) => {
    const res = await fetch(`/api/properties/${id}/take-unit`, { method: 'POST' });
    if (res.ok) {
      fetchProperties();
    } else {
      alert('No units available to take!');
    }
  };

  const handleReleaseUnit = async (id: number) => {
    const res = await fetch(`/api/properties/${id}/release-unit`, { method: 'POST' });
    if (res.ok) {
      fetchProperties();
    } else {
      alert('All units are already available!');
    }
  };

  const startEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
    setIsAdding(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Owner Dashboard</h1>
            <p className="text-zinc-500 mt-1 text-sm uppercase tracking-widest">Manage your property portfolio</p>
          </div>
        </div>

        {/* Page Settings Section */}
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl border border-white/5 mb-12 space-y-12">
          <div>
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <RefreshCw size={20} className="text-emerald-500" />
              Home Page Hero Slideshow
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {slideshow.map((slide) => (
                <div key={slide.id} className="relative group aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <img src={slide.image_url} alt="Slide" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => deleteSlide(slide.id)}
                      className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <Plus size={24} className="text-zinc-600" />
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Add Slide</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">New Slide Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSlideUrl}
                    onChange={e => setNewSlideUrl(e.target.value)}
                    placeholder="Paste URL or upload..."
                    className="flex-grow p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                  />
                  <input
                    type="file"
                    ref={slideshowInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        if (url) setNewSlideUrl(url);
                      }
                    }}
                  />
                  <button
                    onClick={() => slideshowInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-3 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-white/5 transition-colors"
                    title="Upload from computer"
                  >
                    <Upload size={20} />
                  </button>
                </div>
              </div>
              <button
                onClick={addSlide}
                disabled={isUploading}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                Add to Slideshow
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Home size={20} className="text-emerald-500" />
              Fallback Hero Image
            </h2>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Default Hero Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroImageUrl}
                    onChange={e => setHeroImageUrl(e.target.value)}
                    placeholder="Paste URL or upload..."
                    className="flex-grow p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        if (url) setHeroImageUrl(url);
                      }
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-3 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-white/5 transition-colors"
                    title="Upload from computer"
                  >
                    <Upload size={20} />
                  </button>
                </div>
              </div>
              <button
                onClick={updateHeroImage}
                disabled={isUpdatingSettings || isUploading}
                className="bg-zinc-800 text-white px-6 py-3 rounded-xl hover:bg-zinc-700 transition-colors border border-white/10 disabled:opacity-50"
              >
                {isUpdatingSettings ? 'Updating...' : 'Update Fallback'}
              </button>
            </div>
            <p className="text-zinc-500 text-[10px] mt-2 italic">This image appears if the slideshow is empty.</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Properties</h2>
          {!isAdding && (
            <button
              onClick={() => { setIsAdding(true); setEditingProperty(null); }}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
            >
              <Plus size={20} />
              <span>Add Property</span>
            </button>
          )}
        </div>

        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 p-8 rounded-3xl shadow-xl border border-white/5 mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
              <button
                type="submit"
                form="property-form"
                className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                {editingProperty ? 'Update Property' : 'Save Property'}
              </button>
            </div>
            <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Property Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Price (USD)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Main Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Paste URL or upload..."
                    className="flex-grow p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                  />
                  <input
                    type="file"
                    ref={propertyMainInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        if (url) setFormData({ ...formData, image_url: url });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => propertyMainInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-3 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-white/5 transition-colors"
                  >
                    <Upload size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Additional Images</label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <textarea
                      value={formData.images?.join('\n')}
                      onChange={e => setFormData({ ...formData, images: e.target.value.split('\n').filter(url => url.trim() !== '') })}
                      placeholder="One URL per line..."
                      className="flex-grow p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-24 text-white"
                    />
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={propertyMultiInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []) as File[];
                          const newUrls: string[] = [];
                          for (const file of files) {
                            const url = await handleFileUpload(file);
                            if (url) newUrls.push(url);
                          }
                          setFormData({ 
                            ...formData, 
                            images: [...(formData.images || []), ...newUrls] 
                          });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => propertyMultiInputRef.current?.click()}
                        disabled={isUploading}
                        className="p-3 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-white/5 transition-colors flex flex-col items-center justify-center gap-1 h-full"
                      >
                        <Upload size={20} />
                        <span className="text-[8px] font-bold uppercase">Upload</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 italic">Add more photos to show different rooms or angles of the unit.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Beds</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={e => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                    className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Baths</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={e => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                    className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Area (sqft)</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={e => setFormData({ ...formData, area: parseInt(e.target.value) })}
                    className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Units</label>
                  <input
                    type="number"
                    value={formData.total_units}
                    onChange={e => setFormData({ ...formData, total_units: parseInt(e.target.value) })}
                    className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Available Units</label>
                  <input
                    type="number"
                    value={formData.available_units}
                    onChange={e => setFormData({ ...formData, available_units: parseInt(e.target.value) })}
                    className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Estate Project</label>
                <select
                  value={formData.project}
                  onChange={e => setFormData({ ...formData, project: e.target.value })}
                  className="w-full p-3 bg-zinc-800 border border-white/5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-white appearance-none cursor-pointer"
                >
                  <option value="AC Estate 1">AC Estate 1</option>
                  <option value="AC Estate 2">AC Estate 2</option>
                </select>
              </div>
              <div className="flex items-center gap-4 md:col-span-2 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setEditingProperty(null); }}
                  className="text-zinc-500 hover:text-white font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-16">
          {['AC Estate 1', 'AC Estate 2'].map(project => {
            const projectProperties = properties.filter(p => p.project === project);
            
            return (
              <div key={project} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-white">{project}</h2>
                  <div className="h-px flex-grow bg-white/5"></div>
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{projectProperties.length} Units</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {projectProperties.length > 0 ? (
                    projectProperties.map((property) => (
                      <motion.div
                        key={property.id}
                        layout
                        className="bg-zinc-900 p-6 rounded-3xl shadow-sm border border-white/5 flex flex-col md:flex-row gap-6 items-center"
                      >
                        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                          <img
                            src={property.image_url}
                            alt={property.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
                            <MapPin size={12} className="text-emerald-500" />
                            <span>{property.location}</span>
                            <span className="mx-2 text-zinc-800">•</span>
                            <span className="text-emerald-500">{property.project}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white">{property.title}</h3>
                          <div className="flex gap-4 mt-2 text-sm text-zinc-400">
                            <span className="flex items-center gap-1"><Home size={14} className="text-emerald-500" /> {property.type}</span>
                            <span className="flex items-center gap-1"><Users size={14} className="text-emerald-500" /> {property.available_units} / {property.total_units} Units Available</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
                          <div className="flex items-center bg-zinc-800 rounded-full px-2 py-1 gap-1 border border-white/5">
                            <div className="flex flex-col items-center px-2 border-r border-white/10">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold">Available</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleTakeUnit(property.id)}
                                  disabled={property.available_units === 0}
                                  title="Mark Unit Taken"
                                  className={`p-1 rounded-full transition-all ${
                                    property.available_units > 0 
                                    ? 'text-rose-500 hover:bg-rose-500/10' 
                                    : 'text-zinc-700 cursor-not-allowed'
                                  }`}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-xs font-bold text-zinc-300 w-4 text-center">
                                  {property.available_units}
                                </span>
                                <button
                                  onClick={() => handleReleaseUnit(property.id)}
                                  disabled={property.available_units === property.total_units}
                                  title="Release Unit"
                                  className={`p-1 rounded-full transition-all ${
                                    property.available_units < property.total_units 
                                    ? 'text-emerald-500 hover:bg-emerald-500/10' 
                                    : 'text-zinc-700 cursor-not-allowed'
                                  }`}
                                >
                                  <PlusCircle size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col items-center px-2">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold">Total</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={async () => {
                                    if (property.total_units > 1) {
                                      const newTotal = property.total_units - 1;
                                      const newAvail = Math.min(property.available_units, newTotal);
                                      await fetch(`/api/properties/${property.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ...property, total_units: newTotal, available_units: newAvail })
                                      });
                                      fetchProperties();
                                    }
                                  }}
                                  className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-xs font-bold text-zinc-300 w-4 text-center">
                                  {property.total_units}
                                </span>
                                <button
                                  onClick={async () => {
                                    const newTotal = property.total_units + 1;
                                    await fetch(`/api/properties/${property.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ ...property, total_units: newTotal })
                                    });
                                    fetchProperties();
                                  }}
                                  className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                                >
                                  <PlusCircle size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => startEdit(property)}
                            className="flex items-center gap-2 bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors text-sm font-medium border border-white/5"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-4 py-2 rounded-full hover:bg-rose-500/20 transition-colors text-sm font-medium border border-rose-500/20"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-zinc-900/50 border border-dashed border-white/5 rounded-3xl p-12 text-center">
                      <p className="text-zinc-500">No units listed in {project}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
