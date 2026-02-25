import React from 'react';

const ClassesView = ({
  activeFilter,
  setActiveFilter,
  filteredClasses,
  onSelectClass,
  classImagePath
}) => {
  return (
    <>
      <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Lista de <span className="text-red-600">Classes</span>
        </h2>
        <div className="flex gap-2 text-sm font-bold text-gray-500">
          <span
            onClick={() => setActiveFilter('ALL')}
            className={`cursor-pointer transition-colors ${
              activeFilter === 'ALL'
                ? 'text-white border-b-2 border-red-600'
                : 'hover:text-white'
            }`}
          >
            ALL
          </span>
          <span
            onClick={() => setActiveFilter('MELEE')}
            className={`cursor-pointer transition-colors ${
              activeFilter === 'MELEE'
                ? 'text-white border-b-2 border-red-600'
                : 'hover:text-white'
            }`}
          >
            MELEE
          </span>
          <span
            onClick={() => setActiveFilter('RANGED')}
            className={`cursor-pointer transition-colors ${
              activeFilter === 'RANGED'
                ? 'text-white border-b-2 border-red-600'
                : 'hover:text-white'
            }`}
          >
            RANGED
          </span>
          <span
            onClick={() => setActiveFilter('MAGIC')}
            className={`cursor-pointer transition-colors ${
              activeFilter === 'MAGIC'
                ? 'text-white border-b-2 border-red-600'
                : 'hover:text-white'
            }`}
          >
            MAGIC
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredClasses.map((c) => (
          <div
            key={c.name}
            onClick={() => onSelectClass(c.name)}
            className="group relative h-64 bg-[#151923] border border-white/5 overflow-hidden cursor-pointer hover:border-red-500/50 transition-all duration-300"
          >
            {c.destacado && (
              <div className="absolute top-2 right-2 z-30 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg animate-pulse">
                Nova Classe
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
            <img
              src={classImagePath(c.name)}
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.dataset.fallback) {
                  t.dataset.fallback = '1';
                  // Se falhar o webp, tenta png
                  t.src = classImagePath(c.name, 'legacy');
                }
              }}
              alt={c.name}
              className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 w-full p-4 z-20">
              <h3 className="text-white font-black uppercase text-lg italic tracking-wider group-hover:text-red-500 transition-colors">
                {c.name}
              </h3>
              <div className="h-1 w-8 bg-red-600 mt-2 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClassesView;

