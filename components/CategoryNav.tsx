import React, { useState } from 'react';
import type { Category } from '../types';
import { ChevronDownIcon } from './icons/Icons';

interface CategoryNavProps {
  categories: Category[];
  onSelectSubcategory: (subcategoryId: string | null) => void;
  onSelectMainCategory: (categoryId: string | null) => void;
  selectedMainCategory: string | null;
  selectedSubCategory: string | null;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  onSelectSubcategory,
  onSelectMainCategory,
  selectedMainCategory,
  selectedSubCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <nav className="mb-8 sticky top-[80px] z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-2 border-b border-t border-gray-200 dark:border-gray-700">
      <ul className="container mx-auto flex items-center justify-center flex-wrap">
        {categories.map((category) => (
          <li
            key={category.id}
            className="relative"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <button
              onClick={() => onSelectMainCategory(category.id === selectedMainCategory ? null : category.id)}
              className={`flex items-center px-4 py-2 text-sm md:text-base font-semibold rounded-t-lg transition-all duration-200 m-1 outline-none focus-visible:ring-2 focus-visible:ring-primary border-b-4 ${
                selectedMainCategory === category.id
                  ? 'border-primary text-primary dark:text-primary'
                  : 'border-transparent text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary'
              }`}
            >
              {category.name}
              <ChevronDownIcon className="h-4 w-4 ml-1 opacity-70 transition-transform duration-200" />
            </button>

            {(hoveredCategory === category.id && category.subcategories.length > 0) && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg z-20 overflow-hidden animate-fade-in-down-fast border border-gray-200 dark:border-gray-700">
                <ul className="p-2 max-h-80 overflow-y-auto">
                  <li
                    key={`${category.id}-all`}
                    onClick={() => {
                      onSelectMainCategory(category.id)
                      onSelectSubcategory(null)
                    }}
                    className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                      !selectedSubCategory && selectedMainCategory === category.id
                        ? 'bg-primary/20 dark:bg-primary/30 font-semibold text-primary dark:text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-primary/10 dark:hover:bg-primary/20'
                    }`}
                  >
                    All {category.name}
                  </li>
                  {category.subcategories.map((subcategory) => (
                    <li
                      key={subcategory.id}
                      onClick={() => onSelectSubcategory(subcategory.id)}
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                        selectedSubCategory === subcategory.id
                          ? 'bg-primary text-white font-semibold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-primary/10 dark:hover:bg-primary/20'
                      }`}
                    >
                      {subcategory.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};