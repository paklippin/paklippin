'use client';
import { useEffect, useState } from 'react';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

export type FilterState = {
  minPrice: number;
  maxPrice: number;
  sort: 'newest' | 'price-low' | 'price-high' | 'rating' | 'name';
  inStockOnly: boolean;
};

export const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 500000,
  sort: 'newest',
  inStockOnly: false,
};

export default function ProductFilters({
  filters,
  onChange,
  totalResults,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalResults: number;
}) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(filters);

  useEffect(() => { setLocal(filters); }, [filters]);

  const apply = () => {
    onChange(local);
    setOpen(false);
  };

  const reset = () => {
    setLocal(DEFAULT_FILTERS);
    onChange(DEFAULT_FILTERS);
    setOpen(false);
  };

  const SORTS: [FilterState['sort'], string][] = [
    ['newest',     'Newest first'],
    ['price-low',  'Price: Low to High'],
    ['price-high', 'Price: High to Low'],
    ['rating',     'Top Rated'],
    ['name',       'Name A–Z'],
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Sort dropdown */}
      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as FilterState['sort'] })}
          className="appearance-none pl-9 pr-8 py-2.5 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm font-semibold cursor-pointer bg-white"
        >
          {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
      </div>

      {/* Filter button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-border hover:border-brand-accent hover:text-brand-accent transition text-sm font-semibold"
      >
        <SlidersHorizontal size={14} /> Filters
        {(filters.minPrice > 0 || filters.maxPrice < 500000 || filters.inStockOnly) && (
          <span className="w-2 h-2 rounded-full bg-brand-accent" />
        )}
      </button>

      <span className="text-xs text-text-secondary">
        {totalResults} product{totalResults !== 1 ? 's' : ''}
      </span>

      {/* Filter drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-[440px] sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto p-6 relative"
          >
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center">
              <X size={18} />
            </button>

            <h3 className="font-bold text-lg mb-5">Filters</h3>

            {/* Price range */}
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">Price Range (Rs)</div>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="number"
                  value={local.minPrice}
                  onChange={(e) => setLocal({ ...local, minPrice: Math.max(0, Number(e.target.value)) })}
                  placeholder="Min"
                  className="flex-1 px-3 py-2.5 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm"
                />
                <span className="text-text-secondary text-sm">to</span>
                <input
                  type="number"
                  value={local.maxPrice}
                  onChange={(e) => setLocal({ ...local, maxPrice: Math.max(0, Number(e.target.value)) })}
                  placeholder="Max"
                  className="flex-1 px-3 py-2.5 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[[0, 1000], [1000, 3000], [3000, 5000], [5000, 10000], [10000, 500000]].map(([min, max]) => (
                  <button
                    key={`${min}-${max}`}
                    onClick={() => setLocal({ ...local, minPrice: min, maxPrice: max })}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-brand-accent hover:text-brand-accent transition"
                  >
                    {max >= 500000 ? `Rs ${min.toLocaleString()}+` : `Rs ${min.toLocaleString()} – ${max.toLocaleString()}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock toggle */}
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">Availability</div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={local.inStockOnly}
                  onChange={(e) => setLocal({ ...local, inStockOnly: e.target.checked })}
                  className="w-5 h-5 accent-orange-500 cursor-pointer"
                />
                <span className="text-sm font-medium">In stock only</span>
              </label>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <button onClick={reset} className="flex-1 py-3 rounded-lg border-2 border-border font-semibold text-sm hover:border-brand-accent transition">
                Reset
              </button>
              <button onClick={apply} className="flex-1 py-3 rounded-lg bg-brand-accent text-white font-semibold text-sm hover:bg-[#e55a2b] transition">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
