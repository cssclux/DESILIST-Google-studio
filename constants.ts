import type { Listing, Category } from './types';

export const LOCATIONS: Record<string, Record<string, string[]>> = {
  // North Africa
  "Algeria": {
    "Adrar": ["Adrar", "Reggane"],
    "Algiers": ["Algiers", "Bab Ezzouar", "Sidi M'Hamed"],
    "Oran": ["Oran", "Bir El Djir"],
    "Constantine": ["Constantine", "El Khroub"],
    "Annaba": ["Annaba", "El Bouni"],
  },
  "Egypt": {
    "Cairo": ["Zamalek", "Maadi", "New Cairo", "Heliopolis"],
    "Alexandria": ["Smouha", "Roushdy", "Montaza"],
    "Giza": ["Giza", "6th of October City"],
    "Luxor": ["Luxor"],
    "Aswan": ["Aswan"],
  },
  "Libya": {
    "Tripoli": ["Tripoli", "Tajura"],
    "Benghazi": ["Benghazi"],
    "Misrata": ["Misrata"],
  },
  "Morocco": {
    "Casablanca-Settat": ["Casablanca", "Mohammedia", "El Jadida"],
    "Rabat-Salé-Kénitra": ["Rabat", "Salé", "Kenitra"],
    "Marrakesh-Safi": ["Marrakesh", "Safi"],
    "Fès-Meknès": ["Fez", "Meknes"],
    "Tanger-Tetouan-Al Hoceima": ["Tangier", "Tetouan"],
  },
  "Sudan": {
    "Khartoum": ["Khartoum", "Omdurman"],
    "Red Sea": ["Port Sudan"],
    "North Kordofan": ["El-Obeid"],
  },
  "Tunisia": {
    "Tunis": ["Tunis", "La Marsa", "Carthage"],
    "Sfax": ["Sfax"],
    "Sousse": ["Sousse"],
  },
  // West Africa
  "Benin": {
    "Littoral": ["Cotonou"],
    "Ouémé": ["Porto-Novo"],
    "Atlantique": ["Abomey-Calavi"],
  },
  "Burkina Faso": {
    "Centre": ["Ouagadougou"],
    "Hauts-Bassins": ["Bobo-Dioulasso"],
  },
  "Cape Verde": {
    "Praia": ["Praia"],
    "São Vicente": ["Mindelo"],
  },
  "Côte d'Ivoire": {
    "Abidjan": ["Plateau", "Cocody", "Yopougon"],
    "Yamoussoukro": ["Yamoussoukro"],
    "Gbôklé": ["San-Pédro"],
  },
  "Gambia": {
    "Banjul": ["Banjul"],
    "Kanifing": ["Serekunda"],
  },
  "Ghana": {
    "Greater Accra": ["Accra", "Tema", "Madina"],
    "Ashanti": ["Kumasi", "Obuasi"],
    "Northern": ["Tamale", "Yendi"],
    "Western": ["Takoradi"],
  },
  "Guinea": {
    "Conakry": ["Conakry"],
    "Nzérékoré": ["Nzérékoré"],
  },
  "Liberia": {
    "Montserrado": ["Monrovia"],
  },
  "Mali": {
    "Bamako": ["Bamako"],
    "Sikasso": ["Sikasso"],
  },
  "Mauritania": {
    "Nouakchott-Nord": ["Nouakchott"],
  },
  "Niger": {
    "Niamey": ["Niamey"],
    "Zinder": ["Zinder"],
  },
  "Nigeria": {
    "Lagos": ["Ikeja", "Lekki", "Victoria Island", "Surulere"],
    "Abuja (FCT)": ["Central Business District", "Garki", "Wuse", "Maitama"],
    "Rivers": ["Port Harcourt", "Bonny"],
    "Kano": ["Kano City", "Fagge"],
    "Oyo": ["Ibadan", "Ogbomosho"],
    "Kaduna": ["Kaduna", "Zaria"],
  },
  "Senegal": {
    "Dakar": ["Dakar", "Pikine", "Rufisque"],
    "Thiès": ["Thiès"],
  },
  "Sierra Leone": {
    "Western Area": ["Freetown"],
  },
  "Togo": {
    "Maritime": ["Lomé"],
    "Kara": ["Kara"],
  },
  // Central Africa
  "Angola": {
    "Luanda": ["Luanda", "Viana"],
    "Huíla": ["Lubango"],
    "Benguela": ["Benguela"],
  },
  "Cameroon": {
    "Littoral": ["Douala"],
    "Centre": ["Yaoundé"],
    "Northwest": ["Bamenda"],
  },
  "Central African Republic": {
    "Bangui": ["Bangui"],
  },
  "Chad": {
    "N'Djamena": ["N'Djamena"],
    "Logone Occidental": ["Moundou"],
  },
  "Congo, Republic of the": {
    "Brazzaville": ["Brazzaville"],
    "Pointe-Noire": ["Pointe-Noire"],
  },
  "Congo, Democratic Republic of the": {
    "Kinshasa": ["Kinshasa", "Masina"],
    "Haut-Katanga": ["Lubumbashi"],
    "North Kivu": ["Goma"],
  },
  "Equatorial Guinea": {
    "Bioko Norte": ["Malabo"],
    "Litoral": ["Bata"],
  },
  "Gabon": {
    "Estuaire": ["Libreville"],
    "Haut-Ogooué": ["Franceville"],
  },
  // East Africa
  "Burundi": {
    "Bujumbura Mairie": ["Bujumbura"],
  },
  "Comoros": {
    "Grande Comore": ["Moroni"],
  },
  "Djibouti": {
    "Djibouti": ["Djibouti City"],
  },
  "Eritrea": {
    "Maekel": ["Asmara"],
  },
  "Ethiopia": {
    "Addis Ababa": ["Bole", "Kirkos", "Arada"],
    "Oromia": ["Adama", "Bishoftu"],
    "Amhara": ["Bahir Dar", "Gondar"],
    "Dire Dawa": ["Dire Dawa"],
  },
  "Kenya": {
    "Nairobi": ["Westlands", "Kilimani", "CBD", "Karen"],
    "Mombasa": ["Mombasa Island", "Nyali", "Diani"],
    "Kisumu": ["Kisumu", "Milimani"],
    "Nakuru": ["Nakuru Town"],
  },
  "Madagascar": {
    "Analamanga": ["Antananarivo"],
    "Atsinanana": ["Toamasina"],
  },
  "Malawi": {
    "Central Region": ["Lilongwe"],
    "Southern Region": ["Blantyre"],
  },
  "Mauritius": {
    "Port Louis": ["Port Louis"],
    "Plaines Wilhems": ["Curepipe", "Quatre Bornes"],
  },
  "Mozambique": {
    "Maputo City": ["Maputo"],
    "Sofala": ["Beira"],
  },
  "Rwanda": {
    "Kigali": ["Kigali"],
  },
  "Seychelles": {
    "Mahé": ["Victoria"],
  },
  "Somalia": {
    "Banaadir": ["Mogadishu"],
  },
  "South Sudan": {
    "Central Equatoria": ["Juba"],
  },
  "Tanzania": {
    "Dar es Salaam": ["Kinondoni", "Ilala", "Temeke"],
    "Arusha": ["Arusha City", "Meru"],
    "Mwanza": ["Mwanza", "Ilemela"],
    "Zanzibar Urban/West": ["Zanzibar City"],
  },
  "Uganda": {
    "Central": ["Kampala", "Entebbe"],
    "Western": ["Mbarara"],
    "Northern": ["Gulu"],
  },
  "Zambia": {
    "Lusaka": ["Lusaka"],
    "Copperbelt": ["Ndola", "Kitwe"],
  },
  "Zimbabwe": {
    "Harare": ["Harare", "Chitungwiza"],
    "Bulawayo": ["Bulawayo"],
  },
  // Southern Africa
  "Botswana": {
    "South-East": ["Gaborone"],
    "North-East": ["Francistown"],
  },
  "Eswatini": {
    "Hhohho": ["Mbabane"],
    "Manzini": ["Manzini"],
  },
  "Lesotho": {
    "Maseru": ["Maseru"],
  },
  "Namibia": {
    "Khomas": ["Windhoek"],
    "Erongo": ["Walvis Bay", "Swakopmund"],
  },
  "South Africa": {
    "Gauteng": ["Johannesburg", "Pretoria", "Sandton", "Soweto"],
    "Western Cape": ["Cape Town", "Stellenbosch", "George"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay"],
    "Eastern Cape": ["Port Elizabeth", "East London"],
  },
};

export const CURRENCIES: Record<string, { symbol: string; name: string }> = {
  // North
  'DZD': { symbol: 'DZD', name: 'Algerian Dinar' },
  'EGP': { symbol: 'E£', name: 'Egyptian Pound' },
  'LYD': { symbol: 'LD', name: 'Libyan Dinar' },
  'MAD': { symbol: 'DH', name: 'Moroccan Dirham' },
  'SDG': { symbol: 'SDG', name: 'Sudanese Pound' },
  'TND': { symbol: 'DT', name: 'Tunisian Dinar' },
  // West
  'XOF': { symbol: 'CFA', name: 'West African CFA franc' }, // Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo
  'CVE': { symbol: 'CVE', name: 'Cape Verdean Escudo' },
  'GMD': { symbol: 'GMD', name: 'Gambian Dalasi' },
  'GHS': { symbol: 'GH₵', name: 'Ghanaian Cedi' },
  'GNF': { symbol: 'GNF', name: 'Guinean Franc' },
  'LRD': { symbol: 'L$', name: 'Liberian Dollar' },
  'MRO': { symbol: 'UM', name: 'Mauritanian Ouguiya' },
  'NGN': { symbol: '₦', name: 'Nigerian Naira' },
  'SLL': { symbol: 'Le', name: 'Sierra Leonean Leone' },
  // Central
  'XAF': { symbol: 'FCFA', name: 'Central African CFA franc' }, // Cameroon, CAR, Chad, Congo-Brazzaville, Eq. Guinea, Gabon
  'AOA': { symbol: 'Kz', name: 'Angolan Kwanza' },
  'CDF': { symbol: 'FC', name: 'Congolese Franc' },
  // East
  'BIF': { symbol: 'FBu', name: 'Burundian Franc' },
  'KMF': { symbol: 'CF', name: 'Comorian Franc' },
  'DJF': { symbol: 'Fdj', name: 'Djiboutian Franc' },
  'ERN': { symbol: 'Nfk', name: 'Eritrean Nakfa' },
  'ETB': { symbol: 'Br', name: 'Ethiopian Birr' },
  'KES': { symbol: 'Ksh', name: 'Kenyan Shilling' },
  'MGA': { symbol: 'Ar', name: 'Malagasy Ariary' },
  'MWK': { symbol: 'MK', name: 'Malawian Kwacha' },
  'MUR': { symbol: '₨', name: 'Mauritian Rupee' },
  'MZN': { symbol: 'MT', name: 'Mozambican Metical' },
  'RWF': { symbol: 'R₣', name: 'Rwandan Franc' },
  'SCR': { symbol: 'SR', name: 'Seychellois Rupee' },
  'SOS': { symbol: 'S', name: 'Somali Shilling' },
  'SSP': { symbol: 'SS£', name: 'South Sudanese Pound' },
  'TZS': { symbol: 'TSh', name: 'Tanzanian Shilling' },
  'UGX': { symbol: 'USh', name: 'Ugandan Shilling' },
  'ZMW': { symbol: 'ZK', name: 'Zambian Kwacha' },
  'ZWL': { symbol: 'Z$', name: 'Zimbabwean Dollar' },
  // Southern
  'BWP': { symbol: 'P', name: 'Botswana Pula' },
  'SZL': { symbol: 'L', name: 'Swazi Lilangeni' },
  'LSL': { symbol: 'L', name: 'Lesotho Loti' },
  'NAD': { symbol: 'N$', name: 'Namibian Dollar' },
  'ZAR': { symbol: 'R', name: 'South African Rand' },
  // Common
  'USD': { symbol: '$', name: 'US Dollar' },
};

export const CATEGORIES: Category[] = [
  {
    id: 'community',
    name: 'Community',
    subcategories: [
      { id: 'community-activities', name: 'Activities' },
      { id: 'community-artists', name: 'Artists' },
      { id: 'community-childcare', name: 'Childcare' },
      { id: 'community-classes', name: 'Classes' },
      { id: 'community-events', name: 'Events' },
      { id: 'community-pets', name: 'Pets' },
      { id: 'community-rideshare', name: 'Rideshare' },
      { id: 'community-volunteers', name: 'Volunteers' },
    ],
  },
  {
    id: 'housing',
    name: 'Housing',
    subcategories: [
      { id: 'housing-apartments', name: 'Apartments/Housing' },
      { id: 'housing-office', name: 'Office/Commercial' },
      { id: 'housing-rooms', name: 'Rooms/Shared' },
      { id: 'housing-sublets', name: 'Sublets/Temporary' },
      { id: 'housing-vacation', name: 'Vacation Rentals' },
    ],
  },
  {
    id: 'jobs',
    name: 'Jobs',
    subcategories: [
      { id: 'jobs-admin', name: 'Admin/Office' },
      { id: 'jobs-customer-service', name: 'Customer Service' },
      { id: 'jobs-labor', name: 'General Labor' },
      { id: 'jobs-marketing', name: 'Marketing' },
      { id: 'jobs-sales', name: 'Sales' },
      { id: 'jobs-software', name: 'Software/QA/DBA' },
      { id: 'jobs-writing-editing', name: 'Writing/Editing' },
    ],
  },
  {
    id: 'for-sale',
    name: 'For Sale',
    subcategories: [
      { id: 'for-sale-antiques', name: 'Antiques' },
      { id: 'for-sale-appliances', name: 'Appliances' },
      { id: 'for-sale-cars-trucks', name: 'Cars & Trucks' },
      { id: 'for-sale-electronics', name: 'Electronics' },
      { id: 'for-sale-fashion', name: 'Fashion' },
      { id: 'for-sale-furniture', name: 'Furniture' },
      { id: 'for-sale-home-garden', name: 'Home & Garden' },
      { id: 'for-sale-sporting', name: 'Sporting Goods' },
      { id: 'for-sale-toys-games', name: 'Toys & Games' },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    subcategories: [
      { id: 'services-automotive', name: 'Automotive' },
      { id: 'services-beauty', name: 'Beauty' },
      { id: 'services-computer', name: 'Computer' },
      { id: 'services-creative', name: 'Creative' },
      { id: 'services-event', name: 'Event' },
      { id: 'services-financial', name: 'Financial' },
      { id: 'services-household', name: 'Household' },
      { id: 'services-legal', name: 'Legal' },
      { id: 'services-pet', name: 'Pet' },
    ],
  },
  {
    id: 'gigs',
    name: 'Gigs',
    subcategories: [
      { id: 'gigs-computer', name: 'Computer' },
      { id: 'gigs-creative', name: 'Creative' },
      { id: 'gigs-crew', name: 'Crew' },
      { id: 'gigs-domestic', name: 'Domestic' },
      { id: 'gigs-event', name: 'Event' },
      { id: 'gigs-labor', name: 'Labor' },
    ],
  },
];

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 1,
    title: 'UK Used Samsung S21 Ultra',
    description: 'Very clean Samsung S21 Ultra, 256GB, Phantom Black. Comes with charger and a case. Excellent condition, everything works perfectly.',
    price: '₦350,000',
    category: 'for-sale-electronics',
    location: { country: 'Nigeria', state: 'Lagos', city: 'Ikeja' },
    imageUrl: 'https://picsum.photos/seed/samsungs21/400/300',
    postDate: daysAgo(1),
    isFeatured: true,
    seller: {
      username: 'Tunde_Gadgets',
      joinDate: 'Joined Jan 2022',
    },
  },
  {
    id: 9,
    title: 'Traditional Ethiopian Coffee Set (Jebena)',
    description: 'Authentic, handmade Jebena coffee ceremony set. Includes the clay pot, small cups, and serving tray. Perfect for coffee lovers.',
    price: 'Br 2,500',
    category: 'for-sale-home-garden',
    location: { country: 'Ethiopia', state: 'Addis Ababa', city: 'Bole' },
    imageUrl: 'https://picsum.photos/seed/jebena/400/300',
    postDate: daysAgo(6),
    seller: {
      username: 'AddisCrafts',
      joinDate: 'Joined Apr 2023',
    },
  },
    {
    id: 13,
    title: 'Apartment for Rent in Algiers Center',
    description: 'Modern 3-room apartment (F3) in a quiet building in Algiers Center. Close to all amenities. Ideal for a small family or professionals.',
    price: 'DZD 60,000/month',
    category: 'housing-apartments',
    location: { country: 'Algeria', state: 'Algiers', city: 'Algiers' },
    imageUrl: 'https://picsum.photos/seed/algiersapt/400/300',
    postDate: daysAgo(18),
    seller: {
      username: 'Alger_Immo',
      joinDate: 'Joined Feb 2021',
    },
  },
  {
    id: 3,
    title: 'Furnished 2 Bedroom in Kilimani',
    description: 'Spacious 2 bedroom apartment available for rent in a serene part of Kilimani. Comes fully furnished with modern amenities, swimming pool, and gym.',
    price: 'Ksh 90,000/month',
    category: 'housing-apartments',
    location: { country: 'Kenya', state: 'Nairobi', city: 'Kilimani' },
    imageUrl: 'https://picsum.photos/seed/kilimani2br/400/300',
    postDate: daysAgo(5),
    seller: {
      username: 'NairobiHomes',
      joinDate: 'Joined May 2020',
    },
  },
  {
    id: 4,
    title: 'Social Media Manager Needed',
    description: 'A fast-growing fashion brand in Accra is looking for a creative Social Media Manager. Must be proficient with Instagram, TikTok, and Facebook marketing.',
    price: 'Competitive Salary',
    category: 'jobs-marketing',
    location: { country: 'Ghana', state: 'Greater Accra', city: 'Accra' },
    imageUrl: 'https://picsum.photos/seed/socialmediajob/400/300',
    postDate: daysAgo(2),
    seller: {
      username: 'GhanaFashionHouse',
      joinDate: 'Joined Sep 2022',
    },
  },
  {
    id: 10,
    title: 'Handwoven Moroccan Berber Rug',
    description: 'Beautiful, authentic Berber rug from the Atlas Mountains. Wool, natural dyes. Measures 2m x 3m. A timeless piece for any home.',
    price: 'DH 4,000',
    category: 'for-sale-antiques',
    location: { country: 'Morocco', state: 'Marrakesh-Safi', city: 'Marrakesh' },
    imageUrl: 'https://picsum.photos/seed/moroccanrug/400/300',
    postDate: daysAgo(12),
    isFeatured: true,
    seller: {
      username: 'MarrakechSouk',
      joinDate: 'Joined Aug 2021',
    },
  },
    {
    id: 14,
    title: 'Borehole Drilling Services',
    description: 'Professional borehole drilling and installation services in Harare and surrounding areas. Free site survey and quotation. Get reliable water today!',
    price: 'Request a Quote',
    category: 'services-household',
    location: { country: 'Zimbabwe', state: 'Harare', city: 'Harare' },
    imageUrl: 'https://picsum.photos/seed/zimborehole/400/300',
    postDate: daysAgo(25),
    isFeatured: true,
    seller: {
      username: 'ZimWater',
      joinDate: 'Joined May 2019',
    },
  },
  {
    id: 2,
    title: '2015 Toyota Corolla for Sale',
    description: 'Clean, accident-free 2015 Toyota Corolla. Automatic transmission, low mileage, first body. Buy and drive.',
    price: 'R 180,000',
    category: 'for-sale-cars-trucks',
    location: { country: 'South Africa', state: 'Gauteng', city: 'Johannesburg' },
    imageUrl: 'https://picsum.photos/seed/corolla2015/400/300',
    postDate: daysAgo(3),
    seller: {
      username: 'JoziMotors',
      joinDate: 'Joined Mar 2021',
    },
  },
  {
    id: 11,
    title: 'Safari Tour Guide - Arusha',
    description: 'Experienced safari guide available for tours in Serengeti, Ngorongoro, and Tarangire. Fluent in English and Swahili. Own 4x4 vehicle.',
    price: 'Request a Quote',
    category: 'services-event',
    location: { country: 'Tanzania', state: 'Arusha', city: 'Arusha City' },
    imageUrl: 'https://picsum.photos/seed/safari/400/300',
    postDate: daysAgo(8),
    seller: {
      username: 'PamojaTours',
      joinDate: 'Joined Dec 2019',
    },
  },
  {
    id: 5,
    title: 'Handmade Ankara Bags and Shoes',
    description: 'Beautiful, custom-made bags and shoes from authentic Ankara fabric. Perfect for any occasion. We deliver nationwide.',
    price: 'GH₵ 250',
    category: 'for-sale-fashion',
    location: { country: 'Ghana', state: 'Ashanti', city: 'Kumasi' },
    imageUrl: 'https://picsum.photos/seed/ankarabags/400/300',
    postDate: daysAgo(7),
    isFeatured: true,
    seller: {
      username: 'AdepaCreations',
      joinDate: 'Joined Feb 2023',
    },
  },
    {
    id: 15,
    title: 'Graphic Designer for Hire - Kinshasa',
    description: 'Creative and experienced graphic designer available for freelance projects. Logos, branding, social media content, and more. Quick turnaround.',
    price: 'FC 50,000/hr',
    category: 'gigs-creative',
    location: { country: 'Congo, Democratic Republic of the', state: 'Kinshasa', city: 'Kinshasa' },
    imageUrl: 'https://picsum.photos/seed/drcgraphics/400/300',
    postDate: daysAgo(11),
    seller: {
      username: 'KreatifDRC',
      joinDate: 'Joined Oct 2023',
    },
  },
  {
    id: 6,
    title: 'Modern Office Furniture Set',
    description: 'Complete set of office furniture for sale. Includes 1 executive desk, 2 visitor chairs, and a bookshelf. Barely used.',
    price: 'E£ 15,000',
    category: 'for-sale-furniture',
    location: { country: 'Egypt', state: 'Cairo', city: 'New Cairo' },
    imageUrl: 'https://picsum.photos/seed/cairofurniture/400/300',
    postDate: daysAgo(10),
    seller: {
      username: 'CairoOfficeDeals',
      joinDate: 'Joined Jul 2021',
    },
  },
   {
    id: 12,
    title: 'Toyota RAV4 2018 Model',
    description: 'Slightly used Toyota RAV4, 2018 model. Excellent condition, automatic, full options. For sale in Douala.',
    price: 'FCFA 12,500,000',
    category: 'for-sale-cars-trucks',
    location: { country: 'Cameroon', state: 'Littoral', city: 'Douala' },
    imageUrl: 'https://picsum.photos/seed/rav4/400/300',
    postDate: daysAgo(15),
    seller: {
      username: 'DoualaCars',
      joinDate: 'Joined Jun 2022',
    },
  },
  {
    id: 7,
    title: 'Professional Photography Services',
    description: 'Event and portrait photography services. Weddings, birthdays, corporate events. High-quality images guaranteed.',
    price: 'Request a Quote',
    category: 'services-creative',
    location: { country: 'South Africa', state: 'Western Cape', city: 'Cape Town' },
    imageUrl: 'https://picsum.photos/seed/cptphotography/400/300',
    postDate: now.toISOString(),
    seller: {
      username: 'CapeSnaps',
      joinDate: 'Joined Nov 2020',
    },
  },
  {
    id: 8,
    title: 'New In Box Hisense 55" Smart TV',
    description: 'Brand new Hisense 55 inch 4K Smart TV. Still in the sealed box. Comes with a 1-year warranty.',
    price: '₦280,000',
    category: 'for-sale-electronics',
    location: { country: 'Nigeria', state: 'Abuja (FCT)', city: 'Wuse' },
    imageUrl: 'https://picsum.photos/seed/hisensetv/400/300',
    postDate: daysAgo(4),
    isFeatured: true,
    seller: {
      username: 'AbujaElectronics',
      joinDate: 'Joined Oct 2022',
    },
  }
];