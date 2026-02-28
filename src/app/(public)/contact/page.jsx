export const metadata = {
  title: "Contact | Auto Alive",
  description: "Get in touch with Auto Alive. Visit our showroom in Vanderbijlpark.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl">
          <p className="font-brand font-bold text-xs uppercase tracking-[0.2em] text-gold mb-3">
            Get in Touch
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-6">
            Contact Us
          </h1>
          <p className="text-gray-400 mb-12 leading-relaxed">
            Ready to find your next car? Pop in for a visit, give us a call, or
            send us a message. We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-brand uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-600 focus:border-gold/50 focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-brand uppercase tracking-wider">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-600 focus:border-gold/50 focus:outline-none transition-colors"
                placeholder="082 000 0000"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-brand uppercase tracking-wider">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-600 focus:border-gold/50 focus:outline-none transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-brand uppercase tracking-wider">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded text-white placeholder-gray-600 focus:border-gold/50 focus:outline-none transition-colors resize-none"
                placeholder="Tell us what you're looking for..."
              />
            </div>
            <button className="px-8 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black font-brand font-bold text-sm uppercase tracking-wider rounded hover:shadow-xl hover:shadow-gold/20 transition-all duration-300">
              Send Message
            </button>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-lg">
              <h3 className="font-brand font-bold text-sm uppercase tracking-wider text-gold mb-4">Showroom Hours</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex justify-between"><span>Monday – Friday</span><span className="text-white">08:00 – 17:00</span></p>
                <p className="flex justify-between"><span>Saturday</span><span className="text-white">08:00 – 13:00</span></p>
                <p className="flex justify-between"><span>Sunday</span><span className="text-gray-600">Closed</span></p>
              </div>
            </div>
            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-lg">
              <h3 className="font-brand font-bold text-sm uppercase tracking-wider text-gold mb-4">Get Here</h3>
              <p className="text-sm text-gray-400 mb-3">
                Vanderbijlpark, Vaal Triangle<br />
                Gauteng, South Africa
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                016 000 0000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
