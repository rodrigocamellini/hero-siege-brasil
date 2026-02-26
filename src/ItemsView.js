import React from 'react';

const rarityStyle = (r) => {
  const t = (r || '').toLowerCase();
  if (t.includes('satanic set')) {
    return {
      text: 'text-green-400',
      glow: '0 0 18px rgba(74,222,128,0.55)',
      hex: '#4ade80'
    };
  }
  if (t.includes('satanic')) {
    return {
      text: 'text-red-500',
      glow: '0 0 18px rgba(239,68,68,0.55)',
      hex: '#ef4444'
    };
  }
  if (t.includes('angelic')) {
    return {
      text: 'text-yellow-300',
      glow: '0 0 18px rgba(253,224,71,0.55)',
      hex: '#fde047'
    };
  }
  if (t.includes('heroic')) {
    return {
      text: 'text-emerald-400',
      glow: '0 0 18px rgba(52,211,153,0.55)',
      hex: '#34d399'
    };
  }
  if (t.includes('unholy')) {
    return {
      text: 'text-pink-400',
      glow: '0 0 18px rgba(244,114,182,0.55)',
      hex: '#f472b6'
    };
  }
  if (t.includes('legend')) {
    return {
      text: 'text-amber-400',
      glow: '0 0 18px rgba(251,191,36,0.55)',
      hex: '#fbbf24'
    };
  }
  if (t.includes('epic')) {
    return {
      text: 'text-purple-400',
      glow: '0 0 18px rgba(192,132,252,0.55)',
      hex: '#c084fc'
    };
  }
  if (t.includes('rare')) {
    return {
      text: 'text-blue-400',
      glow: '0 0 18px rgba(96,165,250,0.55)',
      hex: '#60a5fa'
    };
  }
  if (t.includes('magic')) {
    return {
      text: 'text-indigo-400',
      glow: '0 0 18px rgba(129,140,248,0.55)',
      hex: '#818cf8'
    };
  }
  if (t.includes('common') || t.includes('normal')) {
    return {
      text: 'text-gray-300',
      glow: '0 0 10px rgba(209,213,219,0.35)',
      hex: '#d1d5db'
    };
  }
  return {
    text: 'text-white',
    glow: '0 0 0 rgba(0,0,0,0)',
    hex: '#ffffff'
  };
};

const handleWikiImageError = (e) => {
  e.target.style.display = 'none';
};

const ItemsView = ({
  itemCategories,
  selectedItemCategory,
  itemsList,
  itemsLoading,
  selectedItem,
  onSelectCategory,
  onBackToCategories,
  onSelectItem,
  onCloseItem
}) => {
  return (
    <div className="space-y-8">
      {!selectedItemCategory && (
        <>
          <div className="flex items-end justify-between mb-2 border-b border-white/10 pb-6">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Banco de <span className="text-red-600">Itens</span>
            </h2>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              {itemsLoading ? 'Carregando...' : `${itemCategories.length} categorias`}
            </span>
          </div>
          {itemCategories.length === 0 && !itemsLoading && (
            <div className="p-6 border border-white/10 bg-[#151923] text-gray-400 text-sm">
              Nenhuma categoria encontrada. Importe os dados para o Firestore e recarregue.
            </div>
          )}
          {(() => {
            const groups = {};
            itemCategories.forEach((cat) => {
              let g = cat.group || 'Outros';
              if ((cat.title || '').toLowerCase().includes('throwing')) g = 'Weapons';
              if (!groups[g]) groups[g] = [];
              groups[g].push(cat);
            });
            const order = [
              'Weapons',
              'Armor',
              'Jewellery',
              'Special Items',
              'Misc',
              'Outros'
            ];
            return order
              .filter((g) => groups[g]?.length)
              .map((g) => (
                <div key={g}>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
                    {g}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                    {groups[g].map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => onSelectCategory(cat)}
                        className="group relative h-44 bg-[#151923] border border-white/5 overflow-hidden cursor-pointer hover:border-orange-500/50 transition-all duration-300"
                      >
                        <div className="absolute inset-0 z-10 pointer-events-none" />
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <img
                            src={cat.image || 'https://herosiege.wiki.gg/images/Item_Chest.png'}
                            alt={cat.title || cat.id}
                            className="max-h-full max-w-full object-contain"
                            onError={handleWikiImageError}
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-3 z-20 bg-black/40 backdrop-blur-sm">
                          <h4 className="text-white font-bold uppercase text-xs tracking-wider">
                            {cat.title || cat.id}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
          })()}
        </>
      )}

      {selectedItemCategory && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={onBackToCategories}
                className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white"
              >
                ← Voltar
              </button>
              <h2 className="mt-2 text-3xl font-black text-white uppercase italic tracking-tighter">
                {selectedItemCategory.title || selectedItemCategory.id}
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              {itemsLoading ? 'Carregando...' : `${itemsList.length} itens`}
            </span>
          </div>
          {itemsList.length === 0 && !itemsLoading && (
            <div className="p-6 border border-white/10 bg-[#151923] text-gray-400 text-sm">
              Nenhum item encontrado para esta categoria.
            </div>
          )}
          {(() => {
            const isShieldCategory = (() => {
              const id = String(selectedItemCategory.id || '').trim().toLowerCase();
              const title = String(selectedItemCategory.title || '').trim().toLowerCase();
              return id === 'shield' || id === 'shields' || title === 'shield' || title === 'shields';
            })();
            const clean = itemsList.filter((it) => {
              if (!it.name || it.name.includes('●')) return false;
              if (isShieldCategory && !it.rarity) return false;
              return true;
            });
            const byRarity = {};
            clean.forEach((it) => {
              const key = it.rarity || 'Sem raridade';
              if (!byRarity[key]) byRarity[key] = [];
              byRarity[key].push(it);
            });
            const rarityOrder = [
              'Satanic',
              'Satanic Set',
              'Heroic',
              'Unholy',
              'Angelic',
              'Legendary',
              'Epic',
              'Rare',
              'Magic',
              'Normal',
              'Common',
              'Sem raridade'
            ];
            return rarityOrder
              .filter((r) => byRarity[r]?.length)
              .map((r) => (
                <div key={r} className="mb-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${rarityStyle(r).text}`}
                      style={{ borderColor: rarityStyle(r).hex }}
                    >
                      {r}
                    </div>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {byRarity[r].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className="bg-[#151923] border-2 p-4 transition-colors cursor-pointer"
                        style={{
                          boxShadow: rarityStyle(item.rarity).glow,
                          borderColor: rarityStyle(item.rarity).hex
                        }}
                      >
                        <div className="h-24 w-full flex items-center justify-center mb-3 bg-black/30">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                              onError={handleWikiImageError}
                            />
                          ) : (
                            <span className="text-gray-600 text-3xl">🎒</span>
                          )}
                        </div>
                        <h4
                          className={`font-bold text-sm leading-tight ${rarityStyle(item.rarity).text}`}
                        >
                          {item.name || item.id}
                        </h4>
                        {item.rarity && (
                          <span className="mt-1 inline-block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                            {item.rarity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ));
          })()}
        </>
      )}

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-start md:items-center justify-center p-4 md:p-6"
          onClick={onCloseItem}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0f111a] border border-white/10 relative rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex justify-end p-3 bg-[#0f111a]/80 backdrop-blur border-b border-white/10">
              <button
                onClick={onCloseItem}
                className="text-gray-400 hover:text-white text-xl leading-none"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="p-6 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center bg-[#151923]">
                {selectedItem.image ? (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="max-h-40 object-contain"
                    onError={handleWikiImageError}
                  />
                ) : (
                  <span className="text-5xl">🎒</span>
                )}
              </div>
              <div className="p-6 md:col-span-2">
                <h3
                  className={`text-2xl font-black uppercase italic tracking-tighter ${rarityStyle(
                    selectedItem.rarity
                  ).text}`}
                >
                  {selectedItem.name}
                </h3>
                {selectedItem.rarity && (
                  <div className="mt-1 inline-block text-[10px] uppercase font-bold tracking-widest text-gray-400">
                    {selectedItem.rarity}
                  </div>
                )}
                {selectedItem.description && (
                  <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}
                {selectedItem.data && (
                  <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Detalhes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                      {Object.entries(selectedItem.data).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between gap-3 border-b border-white/5 py-1"
                        >
                          <span className="text-gray-500">{k}</span>
                          <span className="text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsView;
