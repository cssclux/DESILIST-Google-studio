import React, { useState, useCallback, useMemo } from 'react';
import { generateDescription, suggestCategory } from '../services/geminiService';
import type { Listing, Location } from '../types';
import { CATEGORIES, LOCATIONS } from '../constants';
import { XMarkIcon, SparklesIcon, SpinnerIcon, ExclamationCircleIcon } from './icons/Icons';

interface PostAdModalProps {
  onClose: () => void;
  onSubmit: (newListing: Omit<Listing, 'id'>) => void;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.subcategories[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('');
  
  const [selectedCountry, setSelectedCountry] = useState(Object.keys(LOCATIONS)[0] || '');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiError, setAiError] = useState<{ field: 'desc' | 'cat'; message: string } | null>(null);
  
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
  
  const handleTitleBlur = useCallback(async () => {
    if (!title) return;
    setIsSuggesting(true);
    setAiError(null);
    try {
      const suggestedCatId = await suggestCategory(title, CATEGORIES);
      if (suggestedCatId) {
        setCategory(suggestedCatId);
      }
    } catch (error) {
       setAiError({ field: 'cat', message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
      setIsSuggesting(false);
    }
  }, [title]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry || !selectedState || !selectedCity) {
      alert('Please select a complete location.');
      return;
    }
    const newListing = {
      title,
      description,
      price,
      category,
      location: {
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      },
      imageUrl: imageUrl || `https://picsum.photos/seed/${title.replace(/\s/g, '')}/400/300`,
      postDate: new Date().toISOString(),
      seller: {
        username: 'Just You',
        joinDate: `Joined ${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()}`,
      }
    };
    onSubmit(newListing);
  };
  
  const isProcessing = isGenerating || isSuggesting;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Post a New Ad</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <fieldset disabled={isProcessing} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Ad Title</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} onBlur={handleTitleBlur} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center text-sm text-primary font-semibold hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
                  <SparklesIcon className="h-5 w-5 mr-1" />
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea id="description" value={description} onChange={e => { setDescription(e.target.value); if(aiError?.field === 'desc') setAiError(null); }} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required></textarea>
              {aiError?.field === 'desc' && <p className="mt-1 text-sm text-red-600 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" />{aiError.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input type="text" id="price" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <div className="relative">
                  <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-8" required>
                    {CATEGORIES.map(catGroup => (
                      <optgroup key={catGroup.id} label={catGroup.name}>
                        {catGroup.subcategories.map(subCat => (
                           <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {isSuggesting && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><SpinnerIcon className="h-5 w-5 text-primary" /></div>}
                </div>
                {aiError?.field === 'cat' && <p className="mt-1 text-sm text-red-600 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" />{aiError.message}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
              <input type="url" id="imageUrl" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    <select id="country" value={selectedCountry} onChange={handleCountryChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required>
                        <option disabled value="">Select Country</option>
                        {Object.keys(LOCATIONS).sort().map(country => <option key={country} value={country}>{country}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Region</label>
                    <select id="state" value={selectedState} onChange={handleStateChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required disabled={!selectedCountry}>
                        <option disabled value="">Select State/Region</option>
                        {availableStates.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" required disabled={!selectedState}>
                        <option disabled value="">Select City</option>
                        {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>
            </div>
          </fieldset>

          <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} disabled={isProcessing} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md mr-2 hover:bg-gray-300 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isProcessing} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark disabled:opacity-50">Post Ad</button>
          </div>
        </form>
      </div>
    </div>
  );
};