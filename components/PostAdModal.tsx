import React, { useState, useCallback, useRef } from 'react';
import { CATEGORIES, NIGERIAN_LOCATIONS } from '../constants';
import type { Category, Subcategory, Listing, User } from '../types';
import { XMarkIcon, SparklesIcon, PhotoIcon, ArrowPathIcon, TagIcon } from './icons/Icons';
import * as geminiService from '../services/geminiService';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostAd: (listing: Omit<Listing, 'id' | 'postDate' | 'isFeatured' | 'seller'>) => void;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({ isOpen, onClose, onPostAd }) => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/6/400/300'); // Placeholder
  
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isSuggestingCat, setIsSuggestingCat] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);
  
  const handleGenerateDescription = useCallback(async () => {
    if (!title) {
        alert("Please enter a title first.");
        titleRef.current?.focus();
        return;
    }
    setIsGeneratingDesc(true);
    try {
        const generatedDesc = await geminiService.generateDescription(title, keywords);
        setDescription(generatedDesc);
    } catch (error) {
        console.error(error);
        alert((error as Error).message);
    } finally {
        setIsGeneratingDesc(false);
    }
  }, [title, keywords]);
  
  const handleSuggestCategory = useCallback(async () => {
    if (!title) {
        alert("Please enter a title first.");
        titleRef.current?.focus();
        return;
    }
    setIsSuggestingCat(true);
    try {
        const suggestedId = await geminiService.suggestCategory(title, CATEGORIES);
        if (suggestedId) {
            for (const cat of CATEGORIES) {
                const sub = cat.subcategories.find(s => s.id === suggestedId);
                if (sub) {
                    setSelectedCategory(cat);
                    setSelectedSubcategory(sub);
                    break;
                }
            }
        }
    } catch (error) {
        console.error(error);
        alert((error as Error).message);
    } finally {
        setIsSuggestingCat(false);
    }
  }, [title]);

  const handleSuggestPrice = useCallback(async () => {
    if (!title || !description) {
        alert("Please enter a title and description first.");
        return;
    }
    setIsSuggestingPrice(true);
    try {
        const suggestedPrice = await geminiService.suggestPrice(title, description);
        setPrice(suggestedPrice);
    } catch (error) {
        console.error(error);
        alert((error as Error).message);
    } finally {
        setIsSuggestingPrice(false);
    }
  }, [title, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubcategory) {
        alert('Please select a category and subcategory.');
        return;
    }
    
    const newListing: Omit<Listing, 'id' | 'postDate' | 'isFeatured' | 'seller'> = {
        title,
        description,
        price,
        category: selectedSubcategory.id,
        location: { city, state, country: 'Nigeria' },
        imageUrl,
    };

    onPostAd(newListing);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-10 pb-10 overflow-y-auto">
      <div className="glass-card w-full max-w-3xl relative animate-fade-in-down overflow-hidden">
        <div className="p-6 border-b border-white/10 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Post a New Ad</h2>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ad Title</label>
                    <input type="text" id="title" ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full input" required />
                </div>
                <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keywords / Key Features <span className="text-xs text-slate-500">(comma-separated)</span></label>
                    <input type="text" id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="mt-1 block w-full input" placeholder="e.g., brand new, 16GB RAM, warranty" />
                </div>
                <div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                        <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="ai-button">
                            {isGeneratingDesc ? <ArrowPathIcon className="h-4 w-4 animate-spin"/> : <SparklesIcon className="h-4 w-4" />}
                            <span>{isGeneratingDesc ? 'Generating...' : 'Generate with AI'}</span>
                        </button>
                    </div>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="mt-1 block w-full input" required></textarea>
                </div>
            </div>

            <div className="border-t border-slate-900/10 dark:border-slate-50/10 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Category</h3>
                     <button type="button" onClick={handleSuggestCategory} disabled={isSuggestingCat} className="ai-button">
                        {isSuggestingCat ? <ArrowPathIcon className="h-4 w-4 animate-spin"/> : <SparklesIcon className="h-4 w-4" />}
                        <span>{isSuggestingCat ? 'Suggesting...' : 'Suggest with AI'}</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select value={selectedCategory?.id || ''} onChange={(e) => {
                        const cat = CATEGORIES.find(c => c.id === e.target.value);
                        setSelectedCategory(cat || null);
                        setSelectedSubcategory(null);
                    }} className="input" required>
                        <option value="" disabled>Select a Category</option>
                        {CATEGORIES.map(cat => <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-800">{cat.name}</option>)}
                    </select>
                    <select value={selectedSubcategory?.id || ''} onChange={(e) => {
                        const sub = selectedCategory?.subcategories.find(s => s.id === e.target.value);
                        setSelectedSubcategory(sub || null);
                    }} className="input" disabled={!selectedCategory} required>
                        <option value="" disabled>Select a Subcategory</option>
                        {selectedCategory?.subcategories.map(sub => <option key={sub.id} value={sub.id} className="bg-white dark:bg-slate-800">{sub.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="border-t border-slate-900/10 dark:border-slate-50/10 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Price</h3>
                    <button type="button" onClick={handleSuggestPrice} disabled={isSuggestingPrice} className="ai-button">
                        {isSuggestingPrice ? <ArrowPathIcon className="h-4 w-4 animate-spin"/> : <TagIcon className="h-4 w-4" />}
                        <span>{isSuggestingPrice ? 'Suggesting...' : 'Suggest Price'}</span>
                    </button>
                </div>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full input" placeholder="e.g., ₦50,000 or Competitive Salary" required/>
            </div>

            <div className="border-t border-slate-900/10 dark:border-slate-50/10 pt-6 space-y-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input" placeholder="City / LGA" required />
                    <select value={state} onChange={(e) => setState(e.target.value)} className="input" required>
                        <option value="" disabled>Select State</option>
                        {NIGERIAN_LOCATIONS.map(s => <option key={s.state} value={s.state} className="bg-white dark:bg-slate-800">{s.state}</option>)}
                    </select>
                </div>
            </div>

            <div className="border-t border-slate-900/10 dark:border-slate-50/10 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Upload Image</h3>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10">
                    <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10 dark:border-slate-700/50">
                <button type="button" onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-full mr-4 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-px">
                    Post Ad
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};