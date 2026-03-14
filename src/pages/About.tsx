import { motion } from 'motion/react';
import { Shield, Star, Users, Award, CheckCircle2, Building2 } from 'lucide-react';

export function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32"
    >
      {/* Hero */}
      <section className="bg-zinc-950 py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
            alt="Architecture"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-sm"
          >
            Since 2006
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            A Personal Approach to <br /> <span className="text-emerald-500">Quality Living</span>
          </motion.h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Our Story</h2>
              <div className="w-20 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
            <p className="text-lg text-zinc-400 leading-relaxed">
              ARNE OLSEN Direct Rentals was founded with a clear goal: to provide high-quality, well-maintained homes directly to tenants without the complexity of traditional agencies. As property owners, we take a personal interest in the upkeep of our buildings and the satisfaction of our residents.
            </p>
            <p className="text-lg text-zinc-400 leading-relaxed">
              We believe that the relationship between a landlord and a tenant should be built on trust and transparency. By managing our properties directly, we can ensure faster response times, better maintenance, and a more personal living experience for everyone who calls an ARNE OLSEN property home.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <div className="text-4xl font-bold text-emerald-500">500+</div>
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Happy Residents</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-500">100%</div>
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Directly Managed</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                alt="Our Office"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-emerald-600 p-12 rounded-3xl shadow-2xl text-white">
              <Building2 className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold">Metropolis HQ</h3>
              <p className="text-emerald-100 text-sm">Our flagship office in the heart of the city.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Founder Section */}
      <section className="bg-zinc-900/50 py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-20">
            <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Our Philosophy</span>
            <h2 className="text-5xl font-bold text-white">Meet the Owner</h2>
          </div>
          
          <div className="max-w-4xl mx-auto bg-zinc-900 rounded-[3rem] overflow-hidden shadow-xl flex flex-col md:flex-row items-center border border-white/5">
            <div className="w-full md:w-1/2 h-96 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Owner"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full md:w-1/2 p-12 space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">ARNE OLSEN</h3>
                <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Property Owner</p>
              </div>
              <p className="text-zinc-400 leading-relaxed italic">
                "I don't just see these as buildings; I see them as homes. My commitment is to ensure that every resident feels respected and supported. When you rent from me, you're not just a number—you're part of a community I take pride in maintaining."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Shield, title: "Integrity", desc: "We operate with absolute transparency and honesty in every interaction." },
            { icon: Users, title: "Community", desc: "We are committed to building and supporting the communities we serve." },
            { icon: Star, title: "Excellence", desc: "We strive for perfection in every detail of our service." }
          ].map((value, i) => (
            <div key={i} className="space-y-6 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors bg-zinc-900/30">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <value.icon className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">{value.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
