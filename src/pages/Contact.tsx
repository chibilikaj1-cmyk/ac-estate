import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2, ExternalLink } from 'lucide-react';
import React, { useState } from 'react';

export function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const WHATSAPP_NUMBER = '260963346465';
  const EMAIL = 'contact@ac-estate.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build WhatsApp message
    const waMessage = encodeURIComponent(
      `*New Inquiry from AC-Estate Website*\n\n` +
      `*Name:* ${formState.name}\n` +
      `*Email:* ${formState.email}\n` +
      `*Phone:* ${formState.phone || 'N/A'}\n` +
      `*Subject:* ${formState.subject}\n\n` +
      `*Message:*\n${formState.message}`
    );

    // Also build mailto link as backup
    const mailtoLink = `mailto:${EMAIL}?subject=${encodeURIComponent(formState.subject)}&body=${encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\nPhone: ${formState.phone || 'N/A'}\n\n${formState.message}`
    )}`;

    // Open WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`, '_blank');

    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactItems = [
    {
      icon: Phone,
      title: 'Phone',
      lines: ['+260 961 187 673', '+260 963 346 465'],
      sub: 'Mon–Fri, 9am to 6pm',
      href: 'tel:+260961187673',
    },
    {
      icon: Mail,
      title: 'Email',
      lines: [EMAIL],
      sub: 'Response within 24 hours',
      href: `mailto:${EMAIL}`,
    },
    {
      icon: MapPin,
      title: 'Office',
      lines: ['G64Q+55C, Makeni S Rd', 'Lusaka, Zambia'],
      sub: 'Walk-ins welcome during office hours',
      href: 'https://www.google.com/maps/search/G64Q%2B55C,+Makeni+S+Rd,+Lusaka',
    },
    {
      icon: Clock,
      title: 'Hours',
      lines: ['Mon–Fri: 9am – 6pm', 'Emergencies: 24/7'],
      sub: 'Always available for urgent issues',
      href: null,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      {/* Header */}
      <section className="relative bg-zinc-900/50 py-28 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block text-emerald-500 font-bold uppercase tracking-[0.3em] text-xs bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Contact the <span className="text-emerald-400">Owner</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed"
          >
            Have questions about a property or your tenancy? Reach out directly — no middlemen, no gatekeepers.
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start space-x-4 p-5 bg-zinc-900/60 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-colors group"
                >
                  <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <item.icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{item.title}</p>
                    {item.lines.map((line, j) => (
                      item.href && j === 0
                        ? <a key={j} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                            className="block text-sm font-semibold text-white hover:text-emerald-400 transition-colors">{line}</a>
                        : <p key={j} className="text-sm text-zinc-300">{line}</p>
                    ))}
                    <p className="text-xs text-zinc-600 mt-1">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 rounded-2xl border border-emerald-500/20 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Chat on WhatsApp</h3>
                  <p className="text-xs text-zinc-400">Fastest way to reach us</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I have an inquiry about a property on AC-Estate.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start WhatsApp Chat</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-zinc-900/60 p-8 md:p-10 rounded-3xl border border-white/5"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-5 py-16"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent via WhatsApp!</h3>
                    <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                      Your message was opened in WhatsApp. The owner will respond to you shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-emerald-500 font-semibold text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Send a Message</h2>
                    <p className="text-sm text-zinc-500">Your message will be sent via WhatsApp for a fast, direct response.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={formState.name}
                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={formState.email}
                        onChange={e => setFormState({ ...formState, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Phone (optional)</label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={e => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+260 9XX XXX XXX"
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subject *</label>
                      <input
                        required
                        type="text"
                        value={formState.subject}
                        onChange={e => setFormState({ ...formState, subject: e.target.value })}
                        placeholder="Property inquiry, maintenance..."
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={formState.message}
                      onChange={e => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us about your inquiry — property interest, questions, maintenance request..."
                      className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none text-white placeholder:text-zinc-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Send via WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-zinc-600">
                    Clicking send will open WhatsApp with your message pre-filled.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[420px] bg-zinc-900 rounded-3xl overflow-hidden relative border border-white/5 group">
          <iframe
            title="AC-Estate Office Location"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) saturate(0.8)' }}
            loading="lazy"
            allowFullScreen
            src="https://www.openstreetmap.org/export/embed.html?bbox=28.28,−15.46,28.32,−15.43&layer=mapnik&marker=−15.4456,28.3001"
          />
          <div className="absolute top-6 left-6 bg-zinc-950/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/5 max-w-xs">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">AC-Estate Office</p>
                <p className="text-xs text-zinc-400">G64Q+55C, Makeni S Rd, Lusaka</p>
                <a
                  href="https://www.google.com/maps/search/G64Q%2B55C,+Makeni+S+Rd,+Lusaka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-500 font-semibold hover:underline mt-1 inline-flex items-center space-x-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
