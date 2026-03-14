import { motion } from 'motion/react';
import { Building2, Key, ShieldCheck, ClipboardList, Wallet, Headphones, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Building2,
    title: "Direct Leasing",
    desc: "Transparent rental agreements directly with the property owner. No hidden agency fees or middlemen.",
    features: ["Clear lease terms", "Fast approval process", "Zero agency fees", "Direct owner communication"],
    color: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Key,
    title: "Move-in Support",
    desc: "We help you settle in quickly with a streamlined move-in process and utility setup guidance.",
    features: ["Utility setup guidance", "Key handover walkthrough", "Full property tour", "Welcome pack included"],
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: ShieldCheck,
    title: "Dedicated Maintenance",
    desc: "Direct access to our maintenance team for any repairs or property issues — fast and reliable.",
    features: ["24/7 emergency line", "Online request portal", "Fast response time", "Quality-assured repairs"],
    color: "from-violet-500/20 to-violet-600/5",
  },
  {
    icon: ClipboardList,
    title: "Tenant Portal",
    desc: "Manage your tenancy online — from rent payments to lease documents, all in one place.",
    features: ["Online rent payments", "Lease document access", "Full payment history", "Digital notice board"],
    color: "from-orange-500/20 to-orange-600/5",
  },
  {
    icon: Wallet,
    title: "Flexible Terms",
    desc: "We offer various lease durations and renewal options to suit your lifestyle and budget.",
    features: ["Short-term options", "Long-term stability", "Hassle-free renewals", "Fair deposit terms"],
    color: "from-rose-500/20 to-rose-600/5",
  },
  {
    icon: Headphones,
    title: "Resident Support",
    desc: "A direct line to the owner for any questions or concerns throughout your stay with us.",
    features: ["WhatsApp direct line", "Email support", "Community updates", "Feedback always welcome"],
    color: "from-cyan-500/20 to-cyan-600/5",
  },
];

const processSteps = [
  { step: "01", title: "Browse Units", desc: "Explore our available units online and filter by size, price, and location." },
  { step: "02", title: "Contact Owner", desc: "Reach out directly via WhatsApp or email to ask questions or book a viewing." },
  { step: "03", title: "Apply Online", desc: "Complete a simple rental application — no agency paperwork, no hassle." },
  { step: "04", title: "Move In", desc: "Get your keys, set up utilities, and settle into your new home with our support." },
];

export function Services() {
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
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block text-emerald-500 font-bold uppercase tracking-[0.3em] text-xs bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
          >
            Resident Benefits
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Your <span className="text-emerald-400">Tenant</span> Experience
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            We provide more than just a place to live. Every resident gets personal attention, responsive support, and a well-maintained home.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="relative bg-zinc-900 p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 space-y-5">
                <div className="w-14 h-14 bg-zinc-800 group-hover:bg-zinc-700 rounded-2xl flex items-center justify-center transition-colors border border-white/5">
                  <service.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{service.desc}</p>
                </div>
                <ul className="space-y-2 pt-2 border-t border-white/5">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-zinc-900/30 border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Simple Process</span>
            <h2 className="text-4xl font-bold text-white">How It Works</h2>
            <p className="text-zinc-400 max-w-lg mx-auto text-sm">From browsing to move-in, we've made the rental process as smooth as possible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center space-y-4"
              >
                <div className="w-16 h-16 bg-zinc-900 border-2 border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <span className="text-emerald-400 font-black text-lg">{step.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="relative bg-zinc-900 rounded-3xl p-10 md:p-16 overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-transparent" />
          </div>
          <div className="relative z-10 max-w-xl space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to Find Your <span className="text-emerald-400">New Home?</span>
            </h2>
            <p className="text-zinc-400">
              Browse our available units and connect directly with the owner. No agencies, no fees, no hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-sm text-center hover:bg-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Contact Owner
              </Link>
              <Link
                to="/projects"
                className="bg-white/8 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-sm text-center hover:bg-white/12 transition-all flex items-center justify-center space-x-2"
              >
                <span>Browse Units</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
