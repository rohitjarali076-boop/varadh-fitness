import React from 'react';
import Trainers from './Trainers';
const trainersData = [
  {
    id: 1,
    name: 'Alex Mercer',
    role: 'Strength & Conditioning',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop', // Replace with your local asset paths if needed
    bio: '10+ years experience helping athletes break plateaus and build explosive power.',
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'Cardio & HIIT Specialist',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop',
    bio: 'High energy, high intensity. Passionate about functional fitness and fat loss.',
  },
  {
    id: 3,
    name: 'Marcus Vance',
    role: 'Bodybuilding & Nutrition',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    bio: 'Certified nutritionist focused on clean hypertrophy and customized meal tracking.',
  },
];

export default function Trainers() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8 selection:bg-red-500 selection:text-white">
      <div className="max-w-7xl mx-auto text-center mb-12 space-y-3">
        <span className="inline-block px-4 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest rounded-full">
          Meet The Crew
        </span>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
          Expert <span className="text-red-500">Trainers</span>
        </h2>
        <p className="text-gray-400 text-base font-light max-w-xl mx-auto">
          Our certified professionals are dedicated to pushing your limits and unlocking your ultimate physical potential.
        </p>
      </div>

      {/* Trainers Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {trainersData.map((trainer) => (
          <div 
            key={trainer.id} 
            className="bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-red-500/30 group"
          >
            {/* Image Container */}
            <div className="relative h-80 overflow-hidden bg-neutral-900">
              <img 
                src={trainer.image} 
                alt={trainer.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                {trainer.role}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-100">
                {trainer.name}
              </h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                {trainer.bio}
              </p>
              
              {/* Action Button */}
              <button className="w-full mt-4 py-3 bg-neutral-900 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-800 hover:border-red-500 transition-all duration-300 shadow-md">
                Book a Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}