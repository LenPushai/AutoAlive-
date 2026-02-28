export const metadata = {
  title: "About | Auto Alive",
  description: "Learn about Auto Alive — Vanderbijlpark's trusted dealership.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <p className="font-brand font-bold text-xs uppercase tracking-[0.2em] text-gold mb-3">
            Our Story
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-8">
            About Auto Alive
          </h1>

          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p>
              Auto Alive is Vanderbijlpark&apos;s premier pre-owned vehicle
              dealership, serving the Vaal Triangle community with pride. We
              believe that buying a car should be exciting — not stressful.
            </p>
            <p>
              Every vehicle on our floor has been carefully selected, thoroughly
              inspected, and transparently priced. No hidden fees, no pressure
              tactics — just honest service from people who love cars.
            </p>
            <p>
              Whether you&apos;re a first-time buyer or upgrading your family
              vehicle, our team is here to guide you every step of the way — from
              choosing the right car to securing the best finance deal.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-lg text-center">
              <p className="font-heading text-3xl font-bold text-gold">500+</p>
              <p className="text-sm text-gray-500 mt-1 font-brand uppercase tracking-wider">Cars Sold</p>
            </div>
            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-lg text-center">
              <p className="font-heading text-3xl font-bold text-gold">15+</p>
              <p className="text-sm text-gray-500 mt-1 font-brand uppercase tracking-wider">Years Experience</p>
            </div>
            <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-lg text-center">
              <p className="font-heading text-3xl font-bold text-gold">98%</p>
              <p className="text-sm text-gray-500 mt-1 font-brand uppercase tracking-wider">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
