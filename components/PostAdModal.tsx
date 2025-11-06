

import React, { useState, useMemo, useEffect } from 'react';
import type { Listing } from '../types';
import { CATEGORIES, NIGERIAN_LOCATIONS } from '../constants';
import { XMarkIcon, SparklesIcon, BeakerIcon, BoltIcon, CameraIcon, PlusIcon } from './icons/Icons';
import * as geminiService from '../services/geminiService';
import { CameraCaptureModal } from './CameraCaptureModal';


interface PostAdModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (listing: Omit<Listing, 'id' | 'seller' | 'postDate'>) => void;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [keywords, setKeywords] = useState('');

    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
    const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
    
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal is closed
            setTitle('');
            setDescription('');
            setPrice('');
            setCategory('');
            setState('');
            setCity('');
            setImageUrls([]);
            setCurrentImageUrl('');
            setKeywords('');
        }
    }, [isOpen]);

    const citiesForState = useMemo(() => {
        if (!state) return [];
        return NIGERIAN_LOCATIONS.find(loc => loc.state === state)?.lgas || [];
    }, [state]);

    const handleGenerateDescription = async () => {
        if (!title) {
            alert("Please enter a title first.");
            return;
        }
        setIsGeneratingDescription(true);
        try {
            const generatedDesc = await geminiService.generateDescription(title, keywords);
            setDescription(generatedDesc);
        } catch (error) {
            console.error(error);
            alert("Sorry, we couldn't generate a description. Please try again.");
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    const handleSuggestCategory = async () => {
        if (!title) {
            alert("Please enter a title to get a category suggestion.");
            return;
        }
        setIsSuggestingCategory(true);
        try {
            const suggestedCategory = await geminiService.suggestCategory(title, CATEGORIES);
            if (suggestedCategory) {
                setCategory(suggestedCategory);
            } else {
                alert("Could not determine a category. Please select one manually.");
            }
        } catch (error) {
            console.error(error);
            alert("Sorry, we couldn't suggest a category. Please try again.");
        } finally {
            setIsSuggestingCategory(false);
        }
    };
    
    const handleSuggestPrice = async () => {
        if (!title || !description) {
            alert("Please provide a title and description before suggesting a price.");
            return;
        }
        setIsSuggestingPrice(true);
        try {
            const suggestedPrice = await geminiService.suggestPrice(title, description);
            setPrice(suggestedPrice);
        } catch (error) {
             console.error(error);
            alert("Sorry, we couldn't suggest a price. Please enter one manually.");
        } finally {
            setIsSuggestingPrice(false);
        }
    };
    
    const handlePhotoCapture = (imageDataUrl: string) => {
        if (imageUrls.length < 7) {
            setImageUrls(prev => [...prev, imageDataUrl]);
        } else {
            alert("You can add a maximum of 7 images.");
        }
        setIsCameraOpen(false);
    };

    const handleAddImageUrl = () => {
        if (currentImageUrl.trim() && imageUrls.length < 7) {
            try {
                new URL(currentImageUrl);
                setImageUrls(prev => [...prev, currentImageUrl]);
                setCurrentImageUrl('');
            } catch (_) {
                alert("Please enter a valid URL.");
            }
        } else if (imageUrls.length >= 7) {
            alert("You can add a maximum of 7 images.");
        }
    };
    
    const handleRemoveImage = (indexToRemove: number) => {
        setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageUrls.length < 3) {
            alert("Please add a minimum of 3 images.");
            return;
        }
        if (!title || !description || !price || !category || !state || !city) {
            alert("Please fill out all required fields.");
            return;
        }
        onSubmit({
            title,
            description,
            price,
            category,
            location: {
                country: 'Nigeria',
                state,
                city,
            },
            imageUrls,
        });
    };

    if (!isOpen) return null;

    return (
        <>
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create a New Ad</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form id="post-ad-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ad Title*</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full input" placeholder="e.g., Brand New Samsung S23 Ultra" required />
                    </div>
                    
                    {/* Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category*</label>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full input" required>
                                <option value="" disabled>Select a category</option>
                                {CATEGORIES.map(mainCat => (
                                    <optgroup label={mainCat.name} key={mainCat.id}>
                                        {mainCat.subcategories.map(subCat => <option key={subCat.id} value={subCat.id}>{subCat.name}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="self-end">
                            <button type="button" onClick={handleSuggestCategory} disabled={isSuggestingCategory || !title} className="w-full btn-ai">
                                <SparklesIcon className="h-5 w-5 mr-2"/>
                                {isSuggestingCategory ? 'Thinking...' : 'Suggest Category'}
                            </button>
                        </div>
                    </div>
                    
                    {/* Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-slate-700 dark:text-slate-300">State*</label>
                            <select id="state" value={state} onChange={(e) => { setState(e.target.value); setCity(''); }} className="mt-1 block w-full input" required>
                                <option value="" disabled>Select State</option>
                                {NIGERIAN_LOCATIONS.map(loc => <option key={loc.state} value={loc.state}>{loc.state}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300">City / LGA*</label>
                            <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 block w-full input" disabled={!state} required>
                                <option value="" disabled>Select City / LGA</option>
                                {citiesForState.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Image Handling */}
                    <div>
                        <label htmlFor="imageUrlInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Ad Images ({imageUrls.length}/7)
                            <span className="text-red-500 ml-1 font-normal">{imageUrls.length < 3 ? `(Minimum 3 required)` : ''}</span>
                        </label>
                        <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <div className="flex items-center">
                                <input 
                                    type="text" 
                                    id="imageUrlInput" 
                                    value={currentImageUrl} 
                                    onChange={(e) => setCurrentImageUrl(e.target.value)} 
                                    className="block w-full input rounded-r-none" 
                                    placeholder="Paste an image URL here..."
                                />
                                <button type="button" onClick={handleAddImageUrl} disabled={imageUrls.length >= 7} className="p-2.5 bg-slate-200 dark:bg-slate-700 rounded-r-md disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    <PlusIcon className="h-5 w-5 text-slate-600 dark:text-slate-300"/>
                                </button>
                            </div>
                            <button type="button" onClick={() => setIsCameraOpen(true)} disabled={imageUrls.length >= 7} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center disabled:opacity-50">
                                <CameraIcon className="h-5 w-5 mr-2" />
                                Use Camera
                            </button>
                        </div>
                        
                        {imageUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-slate-300 dark:border-slate-600" />
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                            title="Remove image"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Keywords for Description */}
                    <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keywords (for AI Description)</label>
                        <input type="text" id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="mt-1 block w-full input" placeholder="e.g., long battery, great camera, scratch-free" />
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description*</label>
                            <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDescription || !title} className="btn-ai text-xs px-2 py-1">
                               <BeakerIcon className="h-4 w-4 mr-1"/>
                               {isGeneratingDescription ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="block w-full input" placeholder="Provide a detailed description of your item or service." required></textarea>
                    </div>

                    {/* Price */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price*</label>
                            <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full input" placeholder="e.g., ₦150,000 or 'Negotiable'" required />
                        </div>
                        <div className="self-end">
                             <button type="button" onClick={handleSuggestPrice} disabled={isSuggestingPrice || !title || !description} className="w-full btn-ai">
                                <BoltIcon className="h-5 w-5 mr-2"/>
                                {isSuggestingPrice ? 'Calculating...' : 'Suggest Price'}
                            </button>
                        </div>
                    </div>
                    
                </form>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4 flex-shrink-0">
                    <button type="button" onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="post-ad-form" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
                        Post Ad
                    </button>
                </div>
            </div>
        </div>
        <CameraCaptureModal
            isOpen={isCameraOpen}
            onClose={() => setIsCameraOpen(false)}
            onCapture={handlePhotoCapture}
        />
        </>
    );
};