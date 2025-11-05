import React, { useState, useCallback, useMemo } from 'react';
import { generateDescription, suggestCategory, suggestPrice } from '../services/geminiService';
import type { Listing, Location } from '../types';
import { CATEGORIES, LOCATIONS, CURRENCIES } from '../constants';
import { XMarkIcon, SparklesIcon, SpinnerIcon, ExclamationCircleIcon, PhotoIcon } from './icons/Icons';

interface PostAdModalProps {
  onClose: () => void;
  onSubmit: (newListing: Omit<Listing, 'id' | 'seller'>) => void;
}

type DeliveryMethod = 'courier' | 'in-person' | 'email';
type PaymentMethod = 'crypto' | 'bank-transfer' | 'other';

export const PostAdModal: React.FC<PostAdModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('₦');
  const [category, setCategory] = useState(CATEGORIES[0]?.subcategories[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [selectedCountry, setSelectedCountry] = useState(Object.keys(LOCATIONS)[0] || '');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  const [deliveryMethods, setDeliveryMethods] = useState<Set<DeliveryMethod>>(new Set());
  const [paymentMethods, setPaymentMethods] = useState<Set<PaymentMethod>>(new Set());
  const [acceptsEscrow, setAcceptsEscrow] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingCat, setIsSuggestingCat] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  const [aiError, setAiError] = useState<{ field: 'desc' | 'cat' | 'price'; message: string } | null>(null);
  
  const availableStates = useMemo(() => {
    return selectedCountry ? Object.keys(LOCATIONS[selectedCountry] || {}).sort() : [];
  }, [selectedCountry]);

  const availableCities = useMemo(() => {
    return selectedCountry && selectedState 
      ? (LOCATIONS[selectedCountry]?.[selectedState] || []).sort() 
      : [];
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setSelectedState('');
    setSelectedCity('');
  };
  
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
  };
  
  const handleCheckboxChange = <T extends string>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, item: T) => {
      setter(prev => {
          const next = new Set(prev);
          if (next.has(item)) {
              next.delete(item);
          } else {
              next.add(item);
          }
          return next;
      });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = useCallback(async () => {
    if (!title && !keywords) {
      alert("Please enter a title or some keywords first.");
      return;
    }
    setIsGenerating(true);
    setAiError(null);
    try {
      const generatedDesc = await generateDescription(title, keywords);
      setDescription(generatedDesc);
    } catch (error) {
      setAiError({ field: 'desc', message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
      setIsGenerating(false);
    }
  }, [title, keywords]);

  const handleSuggestPrice = useCallback(async () => {
    if (!title) {
        alert("Please enter a title first to suggest a price.");
        return;
    }
    setIsSuggestingPrice(true);
    setAiError(null);
    try {
        const suggested = await suggestPrice(title, description);
        const sortedCurrencies = Object.values(CURRENCIES).sort((a, b) => b.symbol.length - a.symbol.length);
        let foundCurrency = false;

        for (const curr of sortedCurrencies) {
          if (suggested.startsWith(curr.symbol)) {
            setCurrency(curr.symbol);
            setPrice(suggested.replace(curr.symbol, '').trim());
            foundCurrency = true;
            break;
          }
        }
        if (!foundCurrency) {
          setPrice(suggested);
        }
    } catch (error) {
        setAiError({ field: 'price', message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
        setIsSuggestingPrice(false);
    }
  }, [title, description]);
  
  const handleTitleBlur = useCallback(async () => {
    if (!title) return;
    setIsSuggestingCat(true);
    setAiError(null);
    try {
      const suggestedCatId = await suggestCategory(title, CATEGORIES);
      if (suggestedCatId) {
        setCategory(suggestedCatId);
      }
    } catch (error) {
       setAiError({ field: 'cat', message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
      setIsSuggestingCat(false);
    }
  }, [title]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry || !selectedState || !selectedCity) {
      alert('Please select a complete location.');
      return;
    }

    const isNumericPrice = /^\d/.test(price.trim());
    const finalPrice = isNumericPrice ? `${currency}${price.trim()}` : price.trim();

    const newListing = {
      title,
      description,
      price: finalPrice,
      category,
      location: {
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      },
      imageUrl: imageUrl || `https://picsum.photos/seed/${title.replace(/\s/g, '')}/400/300`,
      postDate: new Date().toISOString(),
      deliveryMethods: Array.from(deliveryMethods),
      paymentMethods: Array.from(paymentMethods),
      acceptsEscrow,
    };
    onSubmit(newListing);
  };
  
  const isProcessing = isGenerating || isSuggestingCat || isSuggestingPrice;
  
  const sortedCurrencies = useMemo(() => {
    return Object.entries(CURRENCIES).sort(([, a], [, b]) => a.name.localeCompare(b.name));
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-2xl border border-slate-300 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-300 dark:border-white/10 sticky top-0 bg-white/60 dark:bg-slate-800/40 backdrop-blur-lg z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Post a New Ad</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <fieldset disabled={isProcessing} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ad Title</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} onBlur={handleTitleBlur} className="mt-1 block w-full bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-secondary focus:border-secondary text-slate-900 dark:text-slate-100" required />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center text-sm text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-500 dark:hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SparklesIcon className="h-5 w-5 mr-1" />
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea id="description" value={description} onChange={e => { setDescription(e.target.value); if(aiError?.field === 'desc') setAiError(null); }} rows={5} className="mt-1 block w-full bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-secondary focus:border-secondary text-slate-900 dark:text-slate-100" required></textarea>
              {aiError?.field === 'desc' && <p className="mt-1 text-sm text-red-400 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" />{aiError.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price</label>
                        <button type="button" onClick={handleSuggestPrice} disabled={isSuggestingPrice} className="flex items-center text-sm text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-500 dark:hover:text-teal-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <SparklesIcon className="h-5 w-5 mr-1" />
                            {isSuggestingPrice ? 'Suggesting...' : 'Suggest'}
                        </button>
                    </div>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <select 
                            id="currency" 
                            value={currency} 
                            onChange={e => setCurrency(e.target.value)} 
                            className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm focus:ring-secondary focus:border-secondary"
                        >
                            {sortedCurrencies.map(([key, { symbol, name }]) => (
                                <option key={key} value={symbol} className="text-black">{`${symbol} - ${name}`}</option>
                            ))}
                        </select>
                        <input type="text" id="price" value={price} onChange={e => setPrice(e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-secondary focus:border-secondary sm:text-sm border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400" placeholder="e.g., 50000 or 'Negotiable'" required />
                    </div>
                    {aiError?.field === 'price' && <p className="mt-1 text-sm text-red-400 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" />{aiError.message}</p>}
                </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <div className="relative">
                  <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-white/5 rounded-md shadow-sm focus:ring-secondary focus:border-secondary pr-8 text-slate-900 dark:text-slate-100" required>
                    {CATEGORIES.map(catGroup => (
                      <optgroup key={catGroup.id} label={catGroup.name} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white">
                        {catGroup.subcategories.map(subCat => (
                           <option key={subCat.id} value={subCat.id} className="bg-white dark:bg-slate-600 text-black dark:text-white">{subCat.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {isSuggestingCat && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><SpinnerIcon className="h-5 w-5 text-teal-500 dark:text-teal-400" /></div>}
                </div>
                {aiError?.field === 'cat' && <p className="mt-1 text-sm text-red-400 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" />{aiError.message}</p>}
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-white/10 pt-4 space-y-4">
                 <fieldset>
                    <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">Delivery Methods</legend>
                    <div className="mt-2 space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
                        {(['courier', 'in-person', 'email'] as DeliveryMethod[]).map(method => (
                            <div key={method} className="flex items-center">
                                <input id={`delivery-${method}`} name="delivery" type="checkbox" checked={deliveryMethods.has(method)} onChange={() => handleCheckboxChange(setDeliveryMethods, method)} className="h-4 w-4 text-primary focus:ring-primary border-slate-400 dark:border-slate-600 rounded bg-slate-200 dark:bg-white/10" />
                                <label htmlFor={`delivery-${method}`} className="ml-2 block text-sm text-slate-800 dark:text-slate-200 capitalize">{method.replace('-', ' ')}</label>
                            </div>
                        ))}
                    </div>
                </fieldset>
                
                 <fieldset>
                    <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment & Security</legend>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                          <input id="escrow" name="escrow" type="checkbox" checked={acceptsEscrow} onChange={(e) => setAcceptsEscrow(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-slate-400 dark:border-slate-600 rounded bg-slate-200 dark:bg-white/10" />
                          <label htmlFor="escrow" className="ml-2 block text-sm text-slate-800 dark:text-slate-200">Accept Escrow Service</label>
                      </div>
                      <div className="flex items-center space-x-4 pt-2">
                           <span className="text-sm text-slate-700 dark:text-slate-300">Accepted Payments:</span>
                          {(['crypto', 'bank-transfer', 'other'] as PaymentMethod[]).map(method => (
                              <div key={method} className="flex items-center">
                                  <input id={`payment-${method}`} name="payment" type="checkbox" checked={paymentMethods.has(method)} onChange={() => handleCheckboxChange(setPaymentMethods, method)} className="h-4 w-4 text-primary focus:ring-primary border-slate-400 dark:border-slate-600 rounded bg-slate-200 dark:bg-white/10" />
                                  <label htmlFor={`payment-${method}`} className="ml-2 block text-sm text-slate-800 dark:text-slate-200 capitalize">{method.replace('-', ' ')}</label>
                              </div>
                          ))}
                      </div>
                    </div>
                </fieldset>
            </div>
            
             <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Upload Photo</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Ad preview" className="mx-auto h-24 w-auto rounded-md" />
                  ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  )}
                  <div className="flex text-sm text-slate-500 dark:text-slate-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-100 dark:focus-within:ring-offset-slate-800 focus-within:ring-primary">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                    <select id="country" value={selectedCountry} onChange={handleCountryChange} className="mt-1 block w-full border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-white/5 rounded-md shadow-sm focus:ring-secondary focus:border-secondary text-slate-900 dark:text-slate-100" required>
                        <option disabled value="" className="text-black">Select Country</option>
                        {Object.keys(LOCATIONS).sort().map(country => <option key={country} value={country} className="text-black">{country}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-slate-700 dark:text-slate-300">State/Region</label>
                    <select id="state" value={selectedState} onChange={handleStateChange} className="mt-1 block w-full border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-white/5 rounded-md shadow-sm focus:ring-secondary focus:border-secondary text-slate-900 dark:text-slate-100" required disabled={!selectedCountry}>
                        <option disabled value="" className="text-black">Select State/Region</option>
                        {availableStates.map(state => <option key={state} value={state} className="text-black">{state}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                    <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="mt-1 block w-full border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-white/5 rounded-md shadow-sm focus:ring-secondary focus:border-secondary text-slate-900 dark:text-slate-100" required disabled={!selectedState}>
                        <option disabled value="" className="text-black">Select City</option>
                        {availableCities.map(city => <option key={city} value={city} className="text-black">{city}</option>)}
                    </select>
                </div>
            </div>
          </fieldset>

          <div className="flex justify-end pt-4 mt-4 border-t border-slate-300 dark:border-white/10">
            <button type="button" onClick={onClose} disabled={isProcessing} className="bg-slate-200 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-md mr-2 hover:bg-slate-300 dark:hover:bg-slate-600/50 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isProcessing} className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] disabled:opacity-50 disabled:shadow-none">Post Ad</button>
          </div>
        </form>
      </div>
    </div>
  );
};