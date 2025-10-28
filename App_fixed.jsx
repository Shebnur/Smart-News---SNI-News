import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Filter, TrendingUp, Globe, BookOpen, DollarSign, Zap, Shield, Heart, Car, Clock, Bell, MessageSquare, ChevronDown, X, Check, ArrowRight, BarChart3, Brain, Mail, Calendar, AlertCircle, TrendingDown, Minus, MapPin, CheckSquare, Square, Bookmark, Share2, ExternalLink, Eye, Sparkles, Copy, User, Home, FileText, Settings, Menu, Languages, Download } from 'lucide-react';

const App = () => {
  // Main state
  const [currentPage, setCurrentPage] = useState('main'); // main, news, user, analytics
  const [filters, setFilters] = useState({
    timeRange: '7d',
    regions: [],
    countries: [],
    categories: [],
    languages: ['en'],
    sources: [],
    excludedSources: [],
    customTopic: '',
    dateFrom: '',
    dateTo: '',
    useCustomDate: false,
    searchKeywords: ''
  });

  const [showFilters, setShowFilters] = useState({
    regions: false,
    countries: false,
    categories: false,
    sources: false,
    languages: false
  });

  const [countrySearch, setCountrySearch] = useState('');
  const [sourceSearch, setSourceSearch] = useState('');
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [readArticles, setReadArticles] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedNewsForSubscription, setSelectedNewsForSubscription] = useState(null);

  // Comprehensive regions covering the entire world
  const regions = [
    { id: 'north-america', name: 'North America', emoji: '🌎', countries: 23 },
    { id: 'south-america', name: 'South America', emoji: '🌎', countries: 12 },
    { id: 'europe', name: 'Europe', emoji: '🇪🇺', countries: 44 },
    { id: 'africa', name: 'Africa', emoji: '🌍', countries: 54 },
    { id: 'middle-east', name: 'Middle East', emoji: '🕌', countries: 17 },
    { id: 'central-asia', name: 'Central Asia', emoji: '🏔️', countries: 8 },
    { id: 'south-asia', name: 'South Asia', emoji: '🕉️', countries: 8 },
    { id: 'east-asia', name: 'East Asia', emoji: '🏮', countries: 6 },
    { id: 'southeast-asia', name: 'Southeast Asia', emoji: '🌴', countries: 11 },
    { id: 'oceania', name: 'Oceania', emoji: '🏝️', countries: 14 },
    { id: 'caribbean', name: 'Caribbean', emoji: '🏖️', countries: 13 }
  ];

  // Comprehensive countries database - SORTED ALPHABETICALLY
  const allCountries = {
    'north-america': [
      { id: 'belize', name: 'Belize', code: 'BZ', flag: '🇧🇿' },
      { id: 'canada', name: 'Canada', code: 'CA', flag: '🇨🇦' },
      { id: 'costa-rica', name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
      { id: 'el-salvador', name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
      { id: 'guatemala', name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
      { id: 'honduras', name: 'Honduras', code: 'HN', flag: '🇭🇳' },
      { id: 'mexico', name: 'Mexico', code: 'MX', flag: '🇲🇽' },
      { id: 'nicaragua', name: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
      { id: 'panama', name: 'Panama', code: 'PA', flag: '🇵🇦' },
      { id: 'usa', name: 'United States', code: 'US', flag: '🇺🇸' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'south-america': [
      { id: 'argentina', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
      { id: 'bolivia', name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
      { id: 'brazil', name: 'Brazil', code: 'BR', flag: '🇧🇷' },
      { id: 'chile', name: 'Chile', code: 'CL', flag: '🇨🇱' },
      { id: 'colombia', name: 'Colombia', code: 'CO', flag: '🇨🇴' },
      { id: 'ecuador', name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
      { id: 'guyana', name: 'Guyana', code: 'GY', flag: '🇬🇾' },
      { id: 'paraguay', name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
      { id: 'peru', name: 'Peru', code: 'PE', flag: '🇵🇪' },
      { id: 'suriname', name: 'Suriname', code: 'SR', flag: '🇸🇷' },
      { id: 'uruguay', name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
      { id: 'venezuela', name: 'Venezuela', code: 'VE', flag: '🇻🇪' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'europe': [
      { id: 'albania', name: 'Albania', code: 'AL', flag: '🇦🇱' },
      { id: 'austria', name: 'Austria', code: 'AT', flag: '🇦🇹' },
      { id: 'belarus', name: 'Belarus', code: 'BY', flag: '🇧🇾' },
      { id: 'belgium', name: 'Belgium', code: 'BE', flag: '🇧🇪' },
      { id: 'bosnia', name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦' },
      { id: 'bulgaria', name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
      { id: 'croatia', name: 'Croatia', code: 'HR', flag: '🇭🇷' },
      { id: 'cyprus', name: 'Cyprus', code: 'CY', flag: '🇨🇾' },
      { id: 'czechia', name: 'Czech Republic', code: 'CZ', flag: '🇨🇿' },
      { id: 'denmark', name: 'Denmark', code: 'DK', flag: '🇩🇰' },
      { id: 'estonia', name: 'Estonia', code: 'EE', flag: '🇪🇪' },
      { id: 'finland', name: 'Finland', code: 'FI', flag: '🇫🇮' },
      { id: 'france', name: 'France', code: 'FR', flag: '🇫🇷' },
      { id: 'germany', name: 'Germany', code: 'DE', flag: '🇩🇪' },
      { id: 'greece', name: 'Greece', code: 'GR', flag: '🇬🇷' },
      { id: 'hungary', name: 'Hungary', code: 'HU', flag: '🇭🇺' },
      { id: 'iceland', name: 'Iceland', code: 'IS', flag: '🇮🇸' },
      { id: 'ireland', name: 'Ireland', code: 'IE', flag: '🇮🇪' },
      { id: 'italy', name: 'Italy', code: 'IT', flag: '🇮🇹' },
      { id: 'latvia', name: 'Latvia', code: 'LV', flag: '🇱🇻' },
      { id: 'lithuania', name: 'Lithuania', code: 'LT', flag: '🇱🇹' },
      { id: 'luxembourg', name: 'Luxembourg', code: 'LU', flag: '🇱🇺' },
      { id: 'malta', name: 'Malta', code: 'MT', flag: '🇲🇹' },
      { id: 'moldova', name: 'Moldova', code: 'MD', flag: '🇲🇩' },
      { id: 'montenegro', name: 'Montenegro', code: 'ME', flag: '🇲🇪' },
      { id: 'netherlands', name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
      { id: 'north-macedonia', name: 'North Macedonia', code: 'MK', flag: '🇲🇰' },
      { id: 'norway', name: 'Norway', code: 'NO', flag: '🇳🇴' },
      { id: 'poland', name: 'Poland', code: 'PL', flag: '🇵🇱' },
      { id: 'portugal', name: 'Portugal', code: 'PT', flag: '🇵🇹' },
      { id: 'romania', name: 'Romania', code: 'RO', flag: '🇷🇴' },
      { id: 'russia', name: 'Russia', code: 'RU', flag: '🇷🇺' },
      { id: 'serbia', name: 'Serbia', code: 'RS', flag: '🇷🇸' },
      { id: 'slovakia', name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
      { id: 'slovenia', name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
      { id: 'spain', name: 'Spain', code: 'ES', flag: '🇪🇸' },
      { id: 'sweden', name: 'Sweden', code: 'SE', flag: '🇸🇪' },
      { id: 'switzerland', name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
      { id: 'ukraine', name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
      { id: 'uk', name: 'United Kingdom', code: 'GB', flag: '🇬🇧' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'middle-east': [
      { id: 'bahrain', name: 'Bahrain', code: 'BH', flag: '🇧🇭' },
      { id: 'iran', name: 'Iran', code: 'IR', flag: '🇮🇷' },
      { id: 'iraq', name: 'Iraq', code: 'IQ', flag: '🇮🇶' },
      { id: 'israel', name: 'Israel', code: 'IL', flag: '🇮🇱' },
      { id: 'jordan', name: 'Jordan', code: 'JO', flag: '🇯🇴' },
      { id: 'kuwait', name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
      { id: 'lebanon', name: 'Lebanon', code: 'LB', flag: '🇱🇧' },
      { id: 'oman', name: 'Oman', code: 'OM', flag: '🇴🇲' },
      { id: 'palestine', name: 'Palestine', code: 'PS', flag: '🇵🇸' },
      { id: 'qatar', name: 'Qatar', code: 'QA', flag: '🇶🇦' },
      { id: 'saudi-arabia', name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
      { id: 'syria', name: 'Syria', code: 'SY', flag: '🇸🇾' },
      { id: 'turkey', name: 'Turkey', code: 'TR', flag: '🇹🇷' },
      { id: 'uae', name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
      { id: 'yemen', name: 'Yemen', code: 'YE', flag: '🇾🇪' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'central-asia': [
      { id: 'armenia', name: 'Armenia', code: 'AM', flag: '🇦🇲' },
      { id: 'azerbaijan', name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿' },
      { id: 'georgia', name: 'Georgia', code: 'GE', flag: '🇬🇪' },
      { id: 'kazakhstan', name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿' },
      { id: 'kyrgyzstan', name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬' },
      { id: 'tajikistan', name: 'Tajikistan', code: 'TJ', flag: '🇹🇯' },
      { id: 'turkmenistan', name: 'Turkmenistan', code: 'TM', flag: '🇹🇲' },
      { id: 'uzbekistan', name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'south-asia': [
      { id: 'afghanistan', name: 'Afghanistan', code: 'AF', flag: '🇦🇫' },
      { id: 'bangladesh', name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
      { id: 'bhutan', name: 'Bhutan', code: 'BT', flag: '🇧🇹' },
      { id: 'india', name: 'India', code: 'IN', flag: '🇮🇳' },
      { id: 'maldives', name: 'Maldives', code: 'MV', flag: '🇲🇻' },
      { id: 'nepal', name: 'Nepal', code: 'NP', flag: '🇳🇵' },
      { id: 'pakistan', name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
      { id: 'sri-lanka', name: 'Sri Lanka', code: 'LK', flag: '🇱🇰' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'east-asia': [
      { id: 'china', name: 'China', code: 'CN', flag: '🇨🇳' },
      { id: 'japan', name: 'Japan', code: 'JP', flag: '🇯🇵' },
      { id: 'mongolia', name: 'Mongolia', code: 'MN', flag: '🇲🇳' },
      { id: 'north-korea', name: 'North Korea', code: 'KP', flag: '🇰🇵' },
      { id: 'south-korea', name: 'South Korea', code: 'KR', flag: '🇰🇷' },
      { id: 'taiwan', name: 'Taiwan', code: 'TW', flag: '🇹🇼' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'southeast-asia': [
      { id: 'brunei', name: 'Brunei', code: 'BN', flag: '🇧🇳' },
      { id: 'cambodia', name: 'Cambodia', code: 'KH', flag: '🇰🇭' },
      { id: 'indonesia', name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
      { id: 'laos', name: 'Laos', code: 'LA', flag: '🇱🇦' },
      { id: 'malaysia', name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
      { id: 'myanmar', name: 'Myanmar', code: 'MM', flag: '🇲🇲' },
      { id: 'philippines', name: 'Philippines', code: 'PH', flag: '🇵🇭' },
      { id: 'singapore', name: 'Singapore', code: 'SG', flag: '🇸🇬' },
      { id: 'thailand', name: 'Thailand', code: 'TH', flag: '🇹🇭' },
      { id: 'timor-leste', name: 'Timor-Leste', code: 'TL', flag: '🇹🇱' },
      { id: 'vietnam', name: 'Vietnam', code: 'VN', flag: '🇻🇳' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'africa': [
      { id: 'algeria', name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
      { id: 'angola', name: 'Angola', code: 'AO', flag: '🇦🇴' },
      { id: 'egypt', name: 'Egypt', code: 'EG', flag: '🇪🇬' },
      { id: 'ethiopia', name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
      { id: 'ghana', name: 'Ghana', code: 'GH', flag: '🇬🇭' },
      { id: 'kenya', name: 'Kenya', code: 'KE', flag: '🇰🇪' },
      { id: 'morocco', name: 'Morocco', code: 'MA', flag: '🇲🇦' },
      { id: 'nigeria', name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
      { id: 'senegal', name: 'Senegal', code: 'SN', flag: '🇸🇳' },
      { id: 'south-africa', name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
      { id: 'tanzania', name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
      { id: 'tunisia', name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
      { id: 'uganda', name: 'Uganda', code: 'UG', flag: '🇺🇬' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'oceania': [
      { id: 'australia', name: 'Australia', code: 'AU', flag: '🇦🇺' },
      { id: 'fiji', name: 'Fiji', code: 'FJ', flag: '🇫🇯' },
      { id: 'new-zealand', name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
      { id: 'papua-new-guinea', name: 'Papua New Guinea', code: 'PG', flag: '🇵🇬' }
    ].sort((a, b) => a.name.localeCompare(b.name)),
    'caribbean': [
      { id: 'cuba', name: 'Cuba', code: 'CU', flag: '🇨🇺' },
      { id: 'dominican-republic', name: 'Dominican Republic', code: 'DO', flag: '🇩🇴' },
      { id: 'haiti', name: 'Haiti', code: 'HT', flag: '🇭🇹' },
      { id: 'jamaica', name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
      { id: 'trinidad-tobago', name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹' }
    ].sort((a, b) => a.name.localeCompare(b.name))
  };

  // Get countries filtered by selected regions
  const availableCountries = useMemo(() => {
    if (filters.regions.length === 0) {
      return Object.values(allCountries).flat().sort((a, b) => a.name.localeCompare(b.name));
    }
    return filters.regions
      .flatMap(regionId => allCountries[regionId] || [])
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filters.regions]);

  // Filter countries based on search
  const searchedCountries = useMemo(() => {
    if (!countrySearch.trim()) return availableCountries;
    return availableCountries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [availableCountries, countrySearch]);

  // Categories
  const categories = [
    { id: 'politics', name: 'Politics & Strategy', icon: Shield, color: 'blue' },
    { id: 'economy', name: 'Economy & Finance', icon: DollarSign, color: 'green' },
    { id: 'technology', name: 'Technology & AI', icon: Zap, color: 'purple' },
    { id: 'energy', name: 'Energy & Resources', icon: TrendingUp, color: 'orange' },
    { id: 'military', name: 'Military & Defense', icon: Shield, color: 'red' },
    { id: 'culture', name: 'Art & Culture', icon: Heart, color: 'pink' },
    { id: 'environment', name: 'Environment & Climate', icon: Globe, color: 'teal' },
    { id: 'business', name: 'Business & Markets', icon: BarChart3, color: 'indigo' },
    { id: 'social', name: 'Social & Society', icon: MessageSquare, color: 'yellow' },
    { id: 'automotive', name: 'Automotive & Mobility', icon: Car, color: 'gray' },
    { id: 'history', name: 'History & Heritage', icon: BookOpen, color: 'amber' },
    { id: 'funding', name: 'Funding & Grants', icon: DollarSign, color: 'emerald' },
    { id: 'custom', name: 'Custom Topic', icon: Sparkles, color: 'violet' }
  ];

  // Languages
  const languages = [
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'az', name: 'Azerbaijani', flag: '🇦🇿' },
    { id: 'ru', name: 'Russian', flag: '🇷🇺' },
    { id: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { id: 'ko', name: 'Korean', flag: '🇰🇷' }
  ];

  // News sources with category and country associations
  const newsSources = {
    'azerbaijan': [
      { id: 'azertac', name: 'Azertac', url: 'azertac.az', categories: ['politics', 'economy', 'energy'], countries: ['azerbaijan'] },
      { id: 'trend', name: 'Trend News Agency', url: 'trend.az', categories: ['politics', 'economy', 'business', 'energy'], countries: ['azerbaijan'] },
      { id: 'caspian-news', name: 'Caspian News', url: 'caspiannews.com', categories: ['politics', 'economy', 'energy'], countries: ['azerbaijan', 'kazakhstan', 'turkmenistan'] },
      { id: 'azeri-press', name: 'Azeri Press Agency', url: 'azeripress.az', categories: ['politics', 'economy'], countries: ['azerbaijan'] },
      { id: 'caucasian-review', name: 'Caucasian Review', url: 'caucasianreview.com', categories: ['politics', 'culture', 'history'], countries: ['azerbaijan', 'georgia', 'armenia'] }
    ],
    'regional': [
      { id: 'eurasianet', name: 'Eurasianet', url: 'eurasianet.org', categories: ['politics', 'economy', 'social'], countries: ['azerbaijan', 'kazakhstan', 'uzbekistan', 'kyrgyzstan', 'tajikistan', 'turkmenistan', 'georgia', 'armenia'] },
      { id: 'emerging-europe', name: 'Emerging Europe', url: 'emerging-europe.com', categories: ['economy', 'business', 'technology'], countries: [] },
      { id: 'caucasus-business', name: 'Caucasus Business Week', url: 'cbw.ge', categories: ['business', 'economy'], countries: ['azerbaijan', 'georgia', 'armenia'] },
      { id: 'baku-tribune', name: 'Baku Tribune', url: 'bakutribune.com', categories: ['politics', 'economy', 'culture'], countries: ['azerbaijan'] }
    ],
    'global': [
      { id: 'bbc', name: 'BBC News', url: 'bbc.com', categories: ['politics', 'economy', 'technology', 'environment', 'culture'], countries: [] },
      { id: 'reuters', name: 'Reuters', url: 'reuters.com', categories: ['politics', 'economy', 'business', 'technology'], countries: [] },
      { id: 'al-jazeera', name: 'Al Jazeera', url: 'aljazeera.com', categories: ['politics', 'social', 'environment'], countries: [] },
      { id: 'nyt', name: 'The New York Times', url: 'nytimes.com', categories: ['politics', 'economy', 'culture', 'technology'], countries: ['usa'] },
      { id: 'guardian', name: 'The Guardian', url: 'theguardian.com', categories: ['politics', 'environment', 'culture', 'social'], countries: ['uk'] },
      { id: 'ap', name: 'Associated Press', url: 'apnews.com', categories: ['politics', 'economy'], countries: [] },
      { id: 'cnn', name: 'CNN', url: 'cnn.com', categories: ['politics', 'economy', 'technology'], countries: ['usa'] },
      { id: 'france24', name: 'France 24', url: 'france24.com', categories: ['politics', 'economy', 'culture'], countries: ['france'] },
      { id: 'dw', name: 'Deutsche Welle', url: 'dw.com', categories: ['politics', 'economy', 'culture'], countries: ['germany'] }
    ],
    'business': [
      { id: 'ft', name: 'Financial Times', url: 'ft.com', categories: ['economy', 'business'], countries: ['uk'] },
      { id: 'bloomberg', name: 'Bloomberg', url: 'bloomberg.com', categories: ['economy', 'business', 'technology'], countries: ['usa'] },
      { id: 'wsj', name: 'Wall Street Journal', url: 'wsj.com', categories: ['economy', 'business', 'politics'], countries: ['usa'] },
      { id: 'forbes', name: 'Forbes', url: 'forbes.com', categories: ['business', 'economy', 'technology'], countries: ['usa'] },
      { id: 'economist', name: 'The Economist', url: 'economist.com', categories: ['economy', 'politics', 'business'], countries: ['uk'] }
    ],
    'energy': [
      { id: 'oil-price', name: 'Oil Price', url: 'oilprice.com', categories: ['energy', 'economy'], countries: [] },
      { id: 'energy-intel', name: 'Energy Intelligence', url: 'energyintel.com', categories: ['energy', 'economy'], countries: [] },
      { id: 'sp-global', name: 'S&P Global Platts', url: 'spglobal.com', categories: ['energy', 'economy', 'business'], countries: [] },
      { id: 'carbon-brief', name: 'Carbon Brief', url: 'carbonbrief.org', categories: ['energy', 'environment'], countries: [] }
    ],
    'technology': [
      { id: 'techcrunch', name: 'TechCrunch', url: 'techcrunch.com', categories: ['technology', 'business'], countries: ['usa'] },
      { id: 'the-information', name: 'The Information', url: 'theinformation.com', categories: ['technology', 'business'], countries: ['usa'] },
      { id: 'mit-review', name: 'MIT Tech Review', url: 'technologyreview.com', categories: ['technology'], countries: ['usa'] },
      { id: 'wired', name: 'Wired', url: 'wired.com', categories: ['technology', 'culture'], countries: ['usa'] },
      { id: 'verge', name: 'The Verge', url: 'theverge.com', categories: ['technology'], countries: ['usa'] }
    ],
    'art': [
      { id: 'artnews', name: 'ARTnews', url: 'artnews.com', categories: ['culture'], countries: ['usa'] },
      { id: 'art-newspaper', name: 'The Art Newspaper', url: 'theartnewspaper.com', categories: ['culture'], countries: ['uk'] },
      { id: 'hyperallergic', name: 'Hyperallergic', url: 'hyperallergic.com', categories: ['culture'], countries: ['usa'] }
    ],
    'military': [
      { id: 'janes', name: "Jane's Defence Weekly", url: 'janes.com', categories: ['military'], countries: ['uk'] },
      { id: 'military-times', name: 'Military Times', url: 'militarytimes.com', categories: ['military'], countries: ['usa'] },
      { id: 'diplomat', name: 'The Diplomat', url: 'thediplomat.com', categories: ['military', 'politics'], countries: [] }
    ],
    'social': [
      { id: 'quartz', name: 'Quartz', url: 'qz.com', categories: ['social', 'economy', 'technology'], countries: ['usa'] },
      { id: 'vox', name: 'Vox', url: 'vox.com', categories: ['social', 'politics'], countries: ['usa'] },
      { id: 'fast-company', name: 'Fast Company', url: 'fastcompany.com', categories: ['social', 'business', 'technology'], countries: ['usa'] }
    ]
  };

  const allSources = Object.values(newsSources).flat();

  // Filter sources dynamically
  const relevantSources = useMemo(() => {
    let sources = [...allSources];
    if (filters.categories.length > 0 && !filters.categories.includes('custom')) {
      sources = sources.filter(source => 
        source.categories.some(cat => filters.categories.includes(cat))
      );
    }
    if (filters.countries.length > 0) {
      sources = sources.filter(source => 
        source.countries.length === 0 ||
        source.countries.some(country => filters.countries.includes(country))
      );
    }
    return sources;
  }, [filters.categories, filters.countries]);

  const searchedSources = useMemo(() => {
    const sourcesToSearch = relevantSources.length > 0 ? relevantSources : allSources;
    if (!sourceSearch.trim()) return sourcesToSearch;
    return sourcesToSearch.filter(source =>
      source.name.toLowerCase().includes(sourceSearch.toLowerCase()) ||
      source.url.toLowerCase().includes(sourceSearch.toLowerCase())
    );
  }, [relevantSources, sourceSearch]);

  // EXPANDED SAMPLE NEWS DATA - 25+ ITEMS COVERING ALL REGIONS
  const sampleNews = [
    {
      id: 1,
      title: "Azerbaijan Emerges as Key Energy Hub in Caspian Region",
      brief: "Strategic developments in energy infrastructure position Azerbaijan as critical transit point for European energy security.",
      content: "Azerbaijan has significantly strengthened its position as a pivotal energy hub in the Caspian region following recent strategic initiatives...",
      region: 'central-asia',
      country: 'azerbaijan',
      category: 'energy',
      source: 'azertac',
      date: '2025-10-25',
      impact: 'Critical',
      trend: 'up',
      tags: ['energy', 'geopolitics', 'infrastructure']
    },
    {
      id: 2,
      title: "US AI Investment Surpasses $200 Billion Milestone",
      brief: "Unprecedented capital flows into artificial intelligence reshape American technology landscape.",
      content: "Global investment in artificial intelligence has exceeded $200 billion in 2025...",
      region: 'north-america',
      country: 'usa',
      category: 'technology',
      source: 'bloomberg',
      date: '2025-10-26',
      impact: 'Critical',
      trend: 'up',
      tags: ['ai', 'investment', 'technology']
    },
    {
      id: 3,
      title: "Germany Leads EU Climate Framework Implementation",
      brief: "Ambitious new regulations position Germany as leader in carbon neutrality efforts.",
      content: "Germany has announced comprehensive climate action framework...",
      region: 'europe',
      country: 'germany',
      category: 'environment',
      source: 'dw',
      date: '2025-10-23',
      impact: 'High',
      trend: 'up',
      tags: ['climate', 'environment', 'policy']
    },
    {
      id: 4,
      title: "China Advances Quantum Computing Breakthrough",
      brief: "Major technological leap positions China at forefront of quantum research.",
      content: "Chinese researchers achieve significant breakthrough in quantum computing...",
      region: 'east-asia',
      country: 'china',
      category: 'technology',
      source: 'reuters',
      date: '2025-10-24',
      impact: 'Critical',
      trend: 'up',
      tags: ['quantum', 'technology', 'research']
    },
    {
      id: 5,
      title: "Brazil Announces Amazon Preservation Initiative",
      brief: "New environmental policies target deforestation reduction and biodiversity protection.",
      content: "Brazil launches comprehensive Amazon preservation program...",
      region: 'south-america',
      country: 'brazil',
      category: 'environment',
      source: 'guardian',
      date: '2025-10-22',
      impact: 'High',
      trend: 'up',
      tags: ['amazon', 'environment', 'conservation']
    },
    {
      id: 6,
      title: "India's Tech Sector Sees Record Growth",
      brief: "Indian technology companies experience unprecedented expansion in global markets.",
      content: "India's technology sector achieves record growth rates...",
      region: 'south-asia',
      country: 'india',
      category: 'technology',
      source: 'bbc',
      date: '2025-10-21',
      impact: 'High',
      trend: 'up',
      tags: ['technology', 'economy', 'growth']
    },
    {
      id: 7,
      title: "UK Financial Markets Respond to Policy Changes",
      brief: "London financial district adjusts to new regulatory framework.",
      content: "UK implements comprehensive financial sector reforms...",
      region: 'europe',
      country: 'uk',
      category: 'economy',
      source: 'ft',
      date: '2025-10-20',
      impact: 'Medium',
      trend: 'stable',
      tags: ['finance', 'economy', 'regulation']
    },
    {
      id: 8,
      title: "Japan Unveils Robotics Innovation Strategy",
      brief: "New initiative aims to revolutionize manufacturing and healthcare sectors.",
      content: "Japan announces ambitious robotics development program...",
      region: 'east-asia',
      country: 'japan',
      category: 'technology',
      source: 'nyt',
      date: '2025-10-19',
      impact: 'High',
      trend: 'up',
      tags: ['robotics', 'innovation', 'technology']
    },
    {
      id: 9,
      title: "Saudi Arabia Expands Renewable Energy Portfolio",
      brief: "Kingdom accelerates transition to sustainable energy sources.",
      content: "Saudi Arabia launches massive renewable energy projects...",
      region: 'middle-east',
      country: 'saudi-arabia',
      category: 'energy',
      source: 'oil-price',
      date: '2025-10-18',
      impact: 'Critical',
      trend: 'up',
      tags: ['energy', 'renewable', 'sustainability']
    },
    {
      id: 10,
      title: "South Korea's K-Culture Dominates Global Entertainment",
      brief: "Korean cultural exports reach unprecedented international success.",
      content: "South Korea's entertainment industry achieves record global reach...",
      region: 'east-asia',
      country: 'south-korea',
      category: 'culture',
      source: 'artnews',
      date: '2025-10-17',
      impact: 'Medium',
      trend: 'up',
      tags: ['culture', 'entertainment', 'media']
    },
    {
      id: 11,
      title: "Australia Announces Major Infrastructure Investment",
      brief: "Massive public works program targets transportation and connectivity.",
      content: "Australian government unveils comprehensive infrastructure plan...",
      region: 'oceania',
      country: 'australia',
      category: 'economy',
      source: 'reuters',
      date: '2025-10-16',
      impact: 'High',
      trend: 'up',
      tags: ['infrastructure', 'economy', 'development']
    },
    {
      id: 12,
      title: "France Leads European Automotive Innovation",
      brief: "French companies pioneer electric vehicle technology advancements.",
      content: "France emerges as leader in EV development...",
      region: 'europe',
      country: 'france',
      category: 'automotive',
      source: 'electrek',
      date: '2025-10-15',
      impact: 'Medium',
      trend: 'up',
      tags: ['automotive', 'electric', 'innovation']
    },
    {
      id: 13,
      title: "Turkey Strengthens Regional Economic Ties",
      brief: "Strategic partnerships enhance Turkey's position in regional trade.",
      content: "Turkey expands economic cooperation agreements...",
      region: 'middle-east',
      country: 'turkey',
      category: 'economy',
      source: 'eurasianet',
      date: '2025-10-14',
      impact: 'Medium',
      trend: 'up',
      tags: ['economy', 'trade', 'partnership']
    },
    {
      id: 14,
      title: "Canada Advances Arctic Research Initiatives",
      brief: "New programs focus on climate change impacts in northern regions.",
      content: "Canada launches comprehensive Arctic research program...",
      region: 'north-america',
      country: 'canada',
      category: 'environment',
      source: 'guardian',
      date: '2025-10-13',
      impact: 'Medium',
      trend: 'stable',
      tags: ['arctic', 'research', 'climate']
    },
    {
      id: 15,
      title: "Singapore Becomes Global Fintech Hub",
      brief: "City-state attracts record number of financial technology companies.",
      content: "Singapore solidifies position as leading fintech center...",
      region: 'southeast-asia',
      country: 'singapore',
      category: 'business',
      source: 'bloomberg',
      date: '2025-10-12',
      impact: 'High',
      trend: 'up',
      tags: ['fintech', 'business', 'finance']
    },
    {
      id: 16,
      title: "Mexico Manufacturing Sector Experiences Boom",
      brief: "Nearshoring trend drives unprecedented industrial growth.",
      content: "Mexican manufacturing sees record expansion...",
      region: 'north-america',
      country: 'mexico',
      category: 'business',
      source: 'wsj',
      date: '2025-10-11',
      impact: 'High',
      trend: 'up',
      tags: ['manufacturing', 'business', 'growth']
    },
    {
      id: 17,
      title: "UAE Launches Space Exploration Program",
      brief: "Ambitious initiative positions UAE as regional space leader.",
      content: "United Arab Emirates unveils comprehensive space program...",
      region: 'middle-east',
      country: 'uae',
      category: 'technology',
      source: 'cnn',
      date: '2025-10-10',
      impact: 'Medium',
      trend: 'up',
      tags: ['space', 'technology', 'exploration']
    },
    {
      id: 18,
      title: "South Africa Renewable Energy Transition Accelerates",
      brief: "Major infrastructure projects target clean energy independence.",
      content: "South Africa accelerates renewable energy development...",
      region: 'africa',
      country: 'south-africa',
      category: 'energy',
      source: 'carbon-brief',
      date: '2025-10-09',
      impact: 'High',
      trend: 'up',
      tags: ['renewable', 'energy', 'infrastructure']
    },
    {
      id: 19,
      title: "Argentina Economic Reforms Show Early Results",
      brief: "New policies begin to stabilize currency and reduce inflation.",
      content: "Argentina's economic restructuring yields initial positive signs...",
      region: 'south-america',
      country: 'argentina',
      category: 'economy',
      source: 'economist',
      date: '2025-10-08',
      impact: 'Medium',
      trend: 'up',
      tags: ['economy', 'reform', 'finance']
    },
    {
      id: 20,
      title: "Indonesia Digital Economy Surges Ahead",
      brief: "Southeast Asian giant becomes major player in digital services.",
      content: "Indonesia's digital economy achieves remarkable growth...",
      region: 'southeast-asia',
      country: 'indonesia',
      category: 'business',
      source: 'techcrunch',
      date: '2025-10-07',
      impact: 'High',
      trend: 'up',
      tags: ['digital', 'economy', 'technology']
    },
    {
      id: 21,
      title: "Russia Energy Exports Shift to Asian Markets",
      brief: "Strategic pivot redirects natural gas and oil flows eastward.",
      content: "Russia reorients energy export strategy toward Asia...",
      region: 'europe',
      country: 'russia',
      category: 'energy',
      source: 'energy-intel',
      date: '2025-10-06',
      impact: 'Critical',
      trend: 'stable',
      tags: ['energy', 'exports', 'geopolitics']
    },
    {
      id: 22,
      title: "Egypt Tourism Sector Reaches Pre-Pandemic Levels",
      brief: "Archaeological sites and Red Sea resorts see visitor numbers recover.",
      content: "Egyptian tourism industry celebrates full recovery...",
      region: 'africa',
      country: 'egypt',
      category: 'economy',
      source: 'bbc',
      date: '2025-10-05',
      impact: 'Medium',
      trend: 'up',
      tags: ['tourism', 'economy', 'recovery']
    },
    {
      id: 23,
      title: "Kazakhstan Positions as Central Asian Tech Leader",
      brief: "Digital infrastructure investments attract international technology companies.",
      content: "Kazakhstan emerges as regional technology hub...",
      region: 'central-asia',
      country: 'kazakhstan',
      category: 'technology',
      source: 'eurasianet',
      date: '2025-10-04',
      impact: 'Medium',
      trend: 'up',
      tags: ['technology', 'digital', 'investment']
    },
    {
      id: 24,
      title: "Nigeria Leads African Startup Ecosystem Growth",
      brief: "Tech entrepreneurship boom attracts record venture capital.",
      content: "Nigerian startup sector achieves unprecedented expansion...",
      region: 'africa',
      country: 'nigeria',
      category: 'business',
      source: 'quartz',
      date: '2025-10-03',
      impact: 'High',
      trend: 'up',
      tags: ['startups', 'technology', 'venture-capital']
    },
    {
      id: 25,
      title: "Poland Becomes European Manufacturing Hub",
      brief: "Strategic location and skilled workforce attract major investments.",
      content: "Poland solidifies position as Central European industrial center...",
      region: 'europe',
      country: 'poland',
      category: 'business',
      source: 'emerging-europe',
      date: '2025-10-02',
      impact: 'High',
      trend: 'up',
      tags: ['manufacturing', 'investment', 'industry']
    },
    {
      id: 26,
      title: "Vietnam Tech Manufacturing Expansion Continues",
      brief: "Electronics production grows as companies diversify supply chains.",
      content: "Vietnam attracts major technology manufacturers...",
      region: 'southeast-asia',
      country: 'vietnam',
      category: 'business',
      source: 'reuters',
      date: '2025-10-01',
      impact: 'High',
      trend: 'up',
      tags: ['manufacturing', 'technology', 'supply-chain']
    },
    {
      id: 27,
      title: "Chile Leads Latin American Renewable Revolution",
      brief: "Solar and wind projects transform national energy landscape.",
      content: "Chile achieves remarkable renewable energy milestones...",
      region: 'south-america',
      country: 'chile',
      category: 'energy',
      source: 'carbon-brief',
      date: '2025-09-30',
      impact: 'High',
      trend: 'up',
      tags: ['renewable', 'solar', 'wind']
    },
    {
      id: 28,
      title: "Morocco Emerges as North African Innovation Leader",
      brief: "Tech startups and digital infrastructure drive economic transformation.",
      content: "Morocco's innovation ecosystem attracts global attention...",
      region: 'africa',
      country: 'morocco',
      category: 'technology',
      source: 'forbes',
      date: '2025-09-29',
      impact: 'Medium',
      trend: 'up',
      tags: ['innovation', 'startups', 'digital']
    },
    // ADDING 25+ MORE DIVERSE NEWS ARTICLES WITH EXTENSIVE ART/CULTURE CONTENT
    {
      id: 29,
      title: "Renaissance Art Exhibition Breaks Records in Florence",
      brief: "Major retrospective attracts millions of visitors showcasing Italian masterpieces.",
      content: "Florence's Uffizi Gallery hosts the largest Renaissance art exhibition in decades, featuring works by Leonardo, Michelangelo, and Raphael...",
      region: 'europe',
      country: 'italy',
      category: 'culture',
      source: 'art-newspaper',
      date: '2024-06-15',
      impact: 'High',
      trend: 'up',
      tags: ['art', 'renaissance', 'museum', 'exhibition']
    },
    {
      id: 30,
      title: "Indigenous Art Movement Gains Global Recognition",
      brief: "Aboriginal and First Nations artists command record auction prices.",
      content: "Indigenous art from Australia and North America achieves unprecedented market success...",
      region: 'oceania',
      country: 'australia',
      category: 'culture',
      source: 'artnews',
      date: '2024-03-22',
      impact: 'High',
      trend: 'up',
      tags: ['indigenous', 'art', 'aboriginal', 'auction']
    },
    {
      id: 31,
      title: "Paris Fashion Week Sets New Sustainability Standards",
      brief: "Major houses commit to carbon-neutral collections by 2028.",
      content: "Paris Fashion Week 2024 marks historic shift toward sustainable luxury...",
      region: 'europe',
      country: 'france',
      category: 'culture',
      source: 'vox',
      date: '2024-09-28',
      impact: 'Medium',
      trend: 'up',
      tags: ['fashion', 'sustainability', 'luxury', 'culture']
    },
    {
      id: 32,
      title: "Ancient Mayan Artifacts Discovered in Guatemala",
      brief: "Archaeological team uncovers royal tomb with priceless cultural treasures.",
      content: "Groundbreaking discovery sheds new light on Mayan civilization...",
      region: 'north-america',
      country: 'guatemala',
      category: 'culture',
      source: 'guardian',
      date: '2023-11-10',
      impact: 'High',
      trend: 'stable',
      tags: ['archaeology', 'mayan', 'history', 'discovery']
    },
    {
      id: 33,
      title: "Iranian Cinema Wins Top Prize at Cannes Film Festival",
      brief: "Groundbreaking film highlights social themes and artistic excellence.",
      content: "Iranian director's latest work receives Palme d'Or, marking cultural milestone...",
      region: 'middle-east',
      country: 'iran',
      category: 'culture',
      source: 'france24',
      date: '2024-05-25',
      impact: 'Medium',
      trend: 'up',
      tags: ['film', 'cinema', 'award', 'festival']
    },
    {
      id: 34,
      title: "Japanese Traditional Crafts Experience Youth Revival",
      brief: "Young artisans revitalize centuries-old techniques with modern designs.",
      content: "Japan sees surge in young people learning traditional pottery, weaving, and metalwork...",
      region: 'east-asia',
      country: 'japan',
      category: 'culture',
      source: 'hyperallergic',
      date: '2024-08-14',
      impact: 'Medium',
      trend: 'up',
      tags: ['crafts', 'tradition', 'japan', 'artisan']
    },
    {
      id: 35,
      title: "African Contemporary Art Market Triples in Value",
      brief: "Lagos, Dakar, and Johannesburg emerge as major art centers.",
      content: "African contemporary art achieves unprecedented commercial success...",
      region: 'africa',
      country: 'nigeria',
      category: 'culture',
      source: 'artnews',
      date: '2024-02-18',
      impact: 'High',
      trend: 'up',
      tags: ['art', 'africa', 'contemporary', 'market']
    },
    {
      id: 36,
      title: "Street Art Museum Opens in Buenos Aires",
      brief: "World's largest urban art collection celebrates Latin American muralists.",
      content: "Argentina inaugurates groundbreaking museum dedicated to street art and graffiti culture...",
      region: 'south-america',
      country: 'argentina',
      category: 'culture',
      source: 'art-newspaper',
      date: '2023-07-20',
      impact: 'Medium',
      trend: 'up',
      tags: ['street-art', 'museum', 'graffiti', 'urban']
    },
    {
      id: 37,
      title: "Digital Art NFTs Reshape Traditional Art Market",
      brief: "Blockchain technology creates new paradigm for art ownership and trading.",
      content: "NFT art market matures with major galleries and museums entering space...",
      region: 'north-america',
      country: 'usa',
      category: 'culture',
      source: 'artnews',
      date: '2023-03-15',
      impact: 'High',
      trend: 'up',
      tags: ['nft', 'digital-art', 'blockchain', 'crypto']
    },
    {
      id: 38,
      title: "India's Classical Dance Forms Gain UNESCO Recognition",
      brief: "Traditional bharatanatyam and kathak designated as world heritage.",
      content: "UNESCO recognizes Indian classical dance traditions as intangible cultural heritage...",
      region: 'south-asia',
      country: 'india',
      category: 'culture',
      source: 'bbc',
      date: '2022-12-05',
      impact: 'Medium',
      trend: 'stable',
      tags: ['dance', 'unesco', 'heritage', 'tradition']
    },
    {
      id: 39,
      title: "Louvre Museum Achieves Record Digital Attendance",
      brief: "Virtual tours and online exhibitions reach 50 million global viewers.",
      content: "Paris's iconic museum successfully transitions to hybrid physical-digital model...",
      region: 'europe',
      country: 'france',
      category: 'culture',
      source: 'art-newspaper',
      date: '2023-06-08',
      impact: 'Medium',
      trend: 'up',
      tags: ['museum', 'digital', 'louvre', 'technology']
    },
    {
      id: 40,
      title: "Brazilian Carnival Declared Cultural Masterpiece",
      brief: "Rio's annual celebration receives special UNESCO designation.",
      content: "UNESCO recognizes Rio Carnival as world's most significant cultural festival...",
      region: 'south-america',
      country: 'brazil',
      category: 'culture',
      source: 'guardian',
      date: '2022-02-15',
      impact: 'Medium',
      trend: 'stable',
      tags: ['carnival', 'festival', 'unesco', 'brazil']
    },
    {
      id: 41,
      title: "Chinese Calligraphy Experiences Global Renaissance",
      brief: "Traditional art form attracts millions of international students.",
      content: "Interest in Chinese brush calligraphy surges worldwide with online classes...",
      region: 'east-asia',
      country: 'china',
      category: 'culture',
      source: 'hyperallergic',
      date: '2023-09-30',
      impact: 'Medium',
      trend: 'up',
      tags: ['calligraphy', 'chinese', 'art', 'tradition']
    },
    {
      id: 42,
      title: "Mexico's Folk Art Cooperatives Double Income",
      brief: "Oaxacan artisans achieve economic success through fair trade networks.",
      content: "Traditional Mexican crafts find new markets through ethical commerce...",
      region: 'north-america',
      country: 'mexico',
      category: 'culture',
      source: 'fast-company',
      date: '2024-01-25',
      impact: 'Medium',
      trend: 'up',
      tags: ['folk-art', 'crafts', 'fair-trade', 'mexico']
    },
    {
      id: 43,
      title: "Vietnam Manufacturing Surge Continues",
      brief: "Electronics production growth positions country as tech hub.",
      content: "Vietnam attracts major technology manufacturers expanding operations...",
      region: 'southeast-asia',
      country: 'vietnam',
      category: 'business',
      source: 'reuters',
      date: '2024-10-15',
      impact: 'High',
      trend: 'up',
      tags: ['manufacturing', 'electronics', 'business']
    },
    {
      id: 44,
      title: "Pakistan's Tech Startup Scene Flourishes",
      brief: "Karachi and Lahore emerge as South Asian innovation centers.",
      content: "Pakistani startups secure record venture capital funding...",
      region: 'south-asia',
      country: 'pakistan',
      category: 'business',
      source: 'techcrunch',
      date: '2024-07-12',
      impact: 'High',
      trend: 'up',
      tags: ['startups', 'technology', 'venture-capital']
    },
    {
      id: 45,
      title: "Thailand Tourism Sector Fully Recovers",
      brief: "Visitor numbers exceed pre-pandemic levels across all regions.",
      content: "Thai tourism industry celebrates complete recovery with record arrivals...",
      region: 'southeast-asia',
      country: 'thailand',
      category: 'economy',
      source: 'bbc',
      date: '2024-04-20',
      impact: 'High',
      trend: 'up',
      tags: ['tourism', 'economy', 'recovery']
    },
    {
      id: 46,
      title: "Spain's Flamenco Art Form Adapts to Modern Era",
      brief: "Traditional dance incorporates contemporary elements while preserving heritage.",
      content: "Spanish flamenco evolves with fusion performances attracting new audiences...",
      region: 'europe',
      country: 'spain',
      category: 'culture',
      source: 'art-newspaper',
      date: '2023-05-18',
      impact: 'Medium',
      trend: 'stable',
      tags: ['flamenco', 'dance', 'tradition', 'spain']
    },
    {
      id: 47,
      title: "Korean Traditional Architecture Inspires Global Designs",
      brief: "Hanok style influences sustainable building practices worldwide.",
      content: "Traditional Korean architectural principles gain international recognition...",
      region: 'east-asia',
      country: 'south-korea',
      category: 'culture',
      source: 'hyperallergic',
      date: '2023-10-22',
      impact: 'Medium',
      trend: 'up',
      tags: ['architecture', 'tradition', 'korea', 'sustainable']
    },
    {
      id: 48,
      title: "Cuban Music Scene Experiences Cultural Renaissance",
      brief: "New generation of musicians blends traditional and contemporary styles.",
      content: "Havana's music scene attracts international attention with innovative fusion...",
      region: 'caribbean',
      country: 'cuba',
      category: 'culture',
      source: 'guardian',
      date: '2022-08-14',
      impact: 'Medium',
      trend: 'up',
      tags: ['music', 'cuba', 'culture', 'fusion']
    },
    {
      id: 49,
      title: "Kenya's Film Industry Sees Dramatic Growth",
      brief: "Nairobi becomes major African production center for cinema.",
      content: "Kenyan film industry experiences boom with international co-productions...",
      region: 'africa',
      country: 'kenya',
      category: 'culture',
      source: 'bbc',
      date: '2023-12-03',
      impact: 'Medium',
      trend: 'up',
      tags: ['film', 'cinema', 'kenya', 'production']
    },
    {
      id: 50,
      title: "Peru's Ancient Textiles Inspire Contemporary Fashion",
      brief: "Pre-Columbian weaving techniques revitalized by modern designers.",
      content: "Peruvian textile traditions gain global fashion recognition...",
      region: 'south-america',
      country: 'peru',
      category: 'culture',
      source: 'vox',
      date: '2022-04-10',
      impact: 'Medium',
      trend: 'stable',
      tags: ['textiles', 'fashion', 'tradition', 'peru']
    },
    {
      id: 51,
      title: "Philippines Animation Industry Attracts Major Studios",
      brief: "Manila becomes Southeast Asian animation production hub.",
      content: "Philippine animators gain international recognition with world-class output...",
      region: 'southeast-asia',
      country: 'philippines',
      category: 'culture',
      source: 'fast-company',
      date: '2024-05-08',
      impact: 'Medium',
      trend: 'up',
      tags: ['animation', 'art', 'production', 'philippines']
    },
    {
      id: 52,
      title: "Scandinavian Design Philosophy Goes Global",
      brief: "Nordic minimalism influences architecture and product design worldwide.",
      content: "Swedish and Danish design principles achieve universal appeal...",
      region: 'europe',
      country: 'sweden',
      category: 'culture',
      source: 'artnews',
      date: '2023-02-14',
      impact: 'Medium',
      trend: 'stable',
      tags: ['design', 'minimalism', 'scandinavian', 'architecture']
    },
    {
      id: 53,
      title: "Ghana's Contemporary Art Scene Explodes",
      brief: "Accra galleries showcase innovative African artistic movements.",
      content: "Ghanaian artists gain international recognition with bold contemporary works...",
      region: 'africa',
      country: 'ghana',
      category: 'culture',
      source: 'hyperallergic',
      date: '2024-03-07',
      impact: 'Medium',
      trend: 'up',
      tags: ['contemporary-art', 'ghana', 'africa', 'gallery']
    }
  ];

  // Initialize news on mount
  useEffect(() => {
    setNews(sampleNews);
    setFilteredNews(sampleNews);
  }, []);

  // Apply filters with proper OR logic - FIXED
  const applyFilters = () => {
    setLoading(true);
    
    setTimeout(() => {
      let filtered = [...news];

      // Filter by regions (OR logic)
      if (filters.regions.length > 0) {
        filtered = filtered.filter(item => 
          filters.regions.includes(item.region)
        );
      }

      // Filter by countries (OR logic)
      if (filters.countries.length > 0) {
        filtered = filtered.filter(item =>
          filters.countries.includes(item.country)
        );
      }

      // Filter by categories (OR logic)
      if (filters.categories.length > 0) {
        if (filters.categories.includes('custom') && filters.customTopic) {
          const customMatches = filtered.filter(item =>
            item.title.toLowerCase().includes(filters.customTopic.toLowerCase()) ||
            item.brief.toLowerCase().includes(filters.customTopic.toLowerCase()) ||
            item.content.toLowerCase().includes(filters.customTopic.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(filters.customTopic.toLowerCase()))
          );
          
          if (filters.categories.length === 1) {
            filtered = customMatches;
          } else {
            const otherCategories = filters.categories.filter(c => c !== 'custom');
            const categoryMatches = filtered.filter(item =>
              otherCategories.includes(item.category)
            );
            filtered = [...new Set([...customMatches, ...categoryMatches])];
          }
        } else {
          filtered = filtered.filter(item =>
            filters.categories.includes(item.category)
          );
        }
      }

      // Filter by sources (OR logic)
      if (filters.sources.length > 0) {
        filtered = filtered.filter(item =>
          filters.sources.includes(item.source)
        );
      }

      // Exclude sources
      if (filters.excludedSources.length > 0) {
        filtered = filtered.filter(item =>
          !filters.excludedSources.includes(item.source)
        );
      }

      // Filter by keywords
      if (filters.searchKeywords.trim()) {
        const keywords = filters.searchKeywords.toLowerCase();
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(keywords) ||
          item.brief.toLowerCase().includes(keywords) ||
          item.content.toLowerCase().includes(keywords) ||
          item.tags.some(tag => tag.toLowerCase().includes(keywords))
        );
      }

      // Filter by time range
      if (filters.useCustomDate) {
        // Custom date range
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= fromDate;
          });
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999); // Include the entire end date
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate <= toDate;
          });
        }
      } else {
        // Preset time ranges
        const now = new Date();
        if (filters.timeRange !== 'all') {
          const daysMap = {
            '24h': 1,
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365,
            '5y': 1825
          };
          const days = daysMap[filters.timeRange] || 7;
          const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
          
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= cutoffDate;
          });
        }
      }

      setFilteredNews(filtered);
      setLoading(false);
      
      if (currentPage === 'main') {
        setCurrentPage('news');
      }
    }, 500);
  };

  // Toggle filter selection
  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  // SELECT ALL functionality
  const selectAllFilters = (type) => {
    if (type === 'regions') {
      setFilters(prev => ({ ...prev, regions: regions.map(r => r.id) }));
    } else if (type === 'countries') {
      setFilters(prev => ({ ...prev, countries: availableCountries.map(c => c.id) }));
    } else if (type === 'categories') {
      setFilters(prev => ({ ...prev, categories: categories.filter(c => c.id !== 'custom').map(c => c.id) }));
    } else if (type === 'languages') {
      setFilters(prev => ({ ...prev, languages: languages.map(l => l.id) }));
    } else if (type === 'sources') {
      setFilters(prev => ({ ...prev, sources: relevantSources.map(s => s.id) }));
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      timeRange: '7d',
      regions: [],
      countries: [],
      categories: [],
      languages: ['en'],
      sources: [],
      excludedSources: [],
      customTopic: '',
      dateFrom: '',
      dateTo: '',
      useCustomDate: false,
      searchKeywords: ''
    });
    setCountrySearch('');
    setSourceSearch('');
  };

  // Save, load, copy filters
  const saveCurrentFilters = () => {
    const filterConfig = {
      id: Date.now(),
      name: `Filter ${savedFilters.length + 1}`,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };
    setSavedFilters(prev => [...prev, filterConfig]);
    alert('Filter saved successfully!');
  };

  const loadSavedFilter = (savedFilter) => {
    setFilters(savedFilter.filters);
  };

  const copyFilterURL = () => {
    const filterParams = {
      timeRange: filters.timeRange,
      regions: filters.regions.join(','),
      countries: filters.countries.join(','),
      categories: filters.categories.join(','),
      sources: filters.sources.join(','),
      searchKeywords: filters.searchKeywords
    };
    const params = new URLSearchParams(filterParams).toString();
    const shareableURL = `${window.location.origin}?${params}`;
    navigator.clipboard.writeText(shareableURL);
    alert('Filter URL copied!');
  };

  // Article handling
  const openArticle = (article) => {
    setSelectedArticle(article);
    setCurrentPage('article');
    if (!readArticles.includes(article.id)) {
      setReadArticles(prev => [...prev, article.id]);
    }
  };

  const saveArticle = (article) => {
    if (!savedArticles.find(a => a.id === article.id)) {
      setSavedArticles(prev => [...prev, article]);
      alert('Article saved!');
    }
  };

  const subscribeToFilters = () => {
    setShowSubscribeModal(true);
  };

  // AI Chat
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: 'user', content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput);
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date() }]);
    }, 1000);
    setChatInput('');
  };

  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('gold')) {
      return "Gold prices are at historic highs driven by economic uncertainty and central bank buying.";
    } else if (lowerQuery.includes('azerbaijan')) {
      return "Azerbaijan has emerged as a crucial energy hub with the Southern Gas Corridor transporting over 20 BCM annually to Europe.";
    } else if (lowerQuery.includes('ai')) {
      return "Global AI investment surpassed $200 billion in 2025, marking a 45% increase year-over-year.";
    } else {
      return "I can help analyze news trends. Ask about specific topics!";
    }
  };

  // Analytical data
  const goldTrendData = [
    { year: '2020', price: 1800 },
    { year: '2021', price: 1850 },
    { year: '2022', price: 1950 },
    { year: '2023', price: 2100 },
    { year: '2024', price: 2300 },
    { year: '2025', price: 2400 }
  ];

  const categoryDistribution = [
    { name: 'Technology', value: 30, color: '#8b5cf6' },
    { name: 'Economy', value: 25, color: '#10b981' },
    { name: 'Energy', value: 20, color: '#f97316' },
    { name: 'Politics', value: 15, color: '#3b82f6' },
    { name: 'Other', value: 10, color: '#6b7280' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IntelliNews</h1>
                <p className="text-xs text-gray-400">Strategic Intelligence</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('main')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currentPage === 'main' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4" />
                Main
              </button>
              <button
                onClick={() => setCurrentPage('news')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currentPage === 'news' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <FileText className="w-4 h-4" />
                News
              </button>
              <button
                onClick={() => setCurrentPage('analytics')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currentPage === 'analytics' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={() => setCurrentPage('user')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  currentPage === 'user' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <User className="w-4 h-4" />
                My Page
              </button>
            </nav>

            <div className="flex items-center gap-3">
              {subscriptions.length > 0 && (
                <div className="hidden md:flex items-center gap-2 bg-purple-500/20 px-3 py-1.5 rounded-lg border border-purple-500/30">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">{subscriptions.length} Active</span>
                </div>
              )}
              <button
                className="md:hidden text-white"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <div className="md:hidden py-4 space-y-2 border-t border-white/10">
              <button onClick={() => { setCurrentPage('main'); setShowMobileMenu(false); }} className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-gray-300 hover:bg-white/10">
                <Home className="w-4 h-4" />Main
              </button>
              <button onClick={() => { setCurrentPage('news'); setShowMobileMenu(false); }} className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-gray-300 hover:bg-white/10">
                <FileText className="w-4 h-4" />News
              </button>
              <button onClick={() => { setCurrentPage('analytics'); setShowMobileMenu(false); }} className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-gray-300 hover:bg-white/10">
                <BarChart3 className="w-4 h-4" />Analytics
              </button>
              <button onClick={() => { setCurrentPage('user'); setShowMobileMenu(false); }} className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-gray-300 hover:bg-white/10">
                <User className="w-4 h-4" />My Page
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* MAIN PAGE */}
        {currentPage === 'main' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 py-12">
              <h1 className="text-5xl font-bold text-white">Latest Global Intelligence</h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Strategic insights from 28 countries • Comprehensive coverage across all regions
              </p>
            </div>

            {/* Latest Intelligence Grid with actual news */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => openArticle(item)}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-blue-300">
                        {regions.find(r => r.id === item.region)?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.impact === 'Critical' ? 'bg-red-500/20 text-red-300' :
                        item.impact === 'High' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {item.impact}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {item.brief}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                      {categories.find(c => c.id === item.category)?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-blue-300">Countries</span>
                </div>
                <div className="text-3xl font-bold text-white">28</div>
                <div className="text-sm text-blue-300 mt-1">Global coverage</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-purple-300">News Sources</span>
                </div>
                <div className="text-3xl font-bold text-white">{allSources.length}</div>
                <div className="text-sm text-purple-300 mt-1">Premium outlets</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-green-300">Categories</span>
                </div>
                <div className="text-3xl font-bold text-white">13</div>
                <div className="text-sm text-green-300 mt-1">Topic areas</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Languages className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-orange-300">Languages</span>
                </div>
                <div className="text-3xl font-bold text-white">5</div>
                <div className="text-sm text-orange-300 mt-1">Available</div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Explore Detailed Intelligence
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Filter by region, country, category, or time period for comprehensive analysis
              </p>
              <button
                onClick={() => setCurrentPage('news')}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* NEWS PAGE with Filters */}
        {currentPage === 'news' && (
          <div className="space-y-6">
            {/* Filters Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Filter className="w-6 h-6" />
                  Filter Intelligence
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={clearFilters} className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm">
                    Clear All
                  </button>
                  <button onClick={saveCurrentFilters} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all text-sm flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />Save
                  </button>
                  <button onClick={copyFilterURL} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm flex items-center gap-2">
                    <Share2 className="w-4 h-4" />Share
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Time Range with Custom Option */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />Time Period
                  </label>
                  <select value={filters.useCustomDate ? 'custom' : filters.timeRange} onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setFilters(prev => ({ ...prev, useCustomDate: true }));
                    } else {
                      setFilters(prev => ({ ...prev, timeRange: e.target.value, useCustomDate: false }));
                    }
                  }} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="24h" className="bg-slate-800">Last 24 Hours</option>
                    <option value="7d" className="bg-slate-800">Last 7 Days</option>
                    <option value="30d" className="bg-slate-800">Last 30 Days</option>
                    <option value="90d" className="bg-slate-800">Last 90 Days</option>
                    <option value="1y" className="bg-slate-800">Last Year</option>
                    <option value="5y" className="bg-slate-800">Last 5 Years</option>
                    <option value="all" className="bg-slate-800">All Time</option>
                    <option value="custom" className="bg-slate-800">Custom Range</option>
                  </select>
                </div>

                {/* Custom Date Range - From/To */}
                {filters.useCustomDate && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />From Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />To Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Regions with Select All */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />Regions ({filters.regions.length})
                  </label>
                  <button onClick={() => setShowFilters(prev => ({ ...prev, regions: !prev.regions }))} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all">
                    <span>{filters.regions.length > 0 ? `${filters.regions.length} selected` : 'Select regions'}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFilters.regions ? 'rotate-180' : ''}`} />
                  </button>
                  {showFilters.regions && (
                    <div className="absolute z-20 mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                      <div className="p-3 border-b border-white/10 sticky top-0 bg-slate-800">
                        <button onClick={() => selectAllFilters('regions')} className="w-full px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold">
                          Select All Regions
                        </button>
                      </div>
                      {regions.map(region => (
                        <label key={region.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">
                          <input type="checkbox" checked={filters.regions.includes(region.id)} onChange={() => toggleFilter('regions', region.id)} className="w-4 h-4 rounded border-white/20" />
                          <span className="text-2xl">{region.emoji}</span>
                          <span className="text-white flex-1">{region.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Countries with Select All & Search */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />Countries ({filters.countries.length})
                  </label>
                  <button onClick={() => setShowFilters(prev => ({ ...prev, countries: !prev.countries }))} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all">
                    <span>{filters.countries.length > 0 ? `${filters.countries.length} selected` : 'Select countries'}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFilters.countries ? 'rotate-180' : ''}`} />
                  </button>
                  {showFilters.countries && (
                    <div className="absolute z-20 mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-xl">
                      <div className="p-3 border-b border-white/10 sticky top-0 bg-slate-800 space-y-2">
                        <input type="text" placeholder="Search countries..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                        <button onClick={() => selectAllFilters('countries')} className="w-full px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold">
                          Select All Countries
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {searchedCountries.map(country => (
                          <label key={country.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">
                            <input type="checkbox" checked={filters.countries.includes(country.id)} onChange={() => toggleFilter('countries', country.id)} className="w-4 h-4 rounded border-white/20" />
                            <span className="text-xl">{country.flag}</span>
                            <span className="text-white text-sm">{country.name}</span>
                          </label>
                        ))}
                        {searchedCountries.length === 0 && (
                          <div className="px-4 py-6 text-center text-gray-400 text-sm">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Categories with Select All */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Filter className="w-4 h-4 inline mr-1" />Categories ({filters.categories.length})
                  </label>
                  <button onClick={() => setShowFilters(prev => ({ ...prev, categories: !prev.categories }))} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all">
                    <span>{filters.categories.length > 0 ? `${filters.categories.length} selected` : 'Select categories'}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFilters.categories ? 'rotate-180' : ''}`} />
                  </button>
                  {showFilters.categories && (
                    <div className="absolute z-20 mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                      <div className="p-3 border-b border-white/10 sticky top-0 bg-slate-800">
                        <button onClick={() => selectAllFilters('categories')} className="w-full px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold">
                          Select All Categories
                        </button>
                      </div>
                      {categories.map(category => {
                        const Icon = category.icon;
                        return (
                          <label key={category.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">
                            <input type="checkbox" checked={filters.categories.includes(category.id)} onChange={() => toggleFilter('categories', category.id)} className="w-4 h-4 rounded border-white/20" />
                            <Icon className={`w-5 h-5 text-${category.color}-400`} />
                            <span className="text-white">{category.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Custom Topic */}
                {filters.categories.includes('custom') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Sparkles className="w-4 h-4 inline mr-1" />Custom Topic
                    </label>
                    <input type="text" value={filters.customTopic} onChange={(e) => setFilters(prev => ({ ...prev, customTopic: e.target.value }))} placeholder="Enter your topic..." className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                )}

                {/* Languages with Select All */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Languages className="w-4 h-4 inline mr-1" />Languages ({filters.languages.length})
                  </label>
                  <button onClick={() => setShowFilters(prev => ({ ...prev, languages: !prev.languages }))} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all">
                    <span>{filters.languages.length > 0 ? `${filters.languages.length} selected` : 'Select languages'}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFilters.languages ? 'rotate-180' : ''}`} />
                  </button>
                  {showFilters.languages && (
                    <div className="absolute z-20 mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-xl">
                      <div className="p-3 border-b border-white/10 sticky top-0 bg-slate-800">
                        <button onClick={() => selectAllFilters('languages')} className="w-full px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold">
                          Select All Languages
                        </button>
                      </div>
                      {languages.map(lang => (
                        <label key={lang.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">
                          <input type="checkbox" checked={filters.languages.includes(lang.id)} onChange={() => toggleFilter('languages', lang.id)} className="w-4 h-4 rounded border-white/20" />
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-white text-sm">{lang.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sources with Select All & Search */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-1" />Sources ({filters.sources.length})
                    {relevantSources.length < allSources.length && (
                      <span className="text-xs text-blue-400 ml-2">({relevantSources.length} relevant)</span>
                    )}
                  </label>
                  <button onClick={() => setShowFilters(prev => ({ ...prev, sources: !prev.sources }))} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all">
                    <span>{filters.sources.length > 0 ? `${filters.sources.length} selected` : 'All sources'}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFilters.sources ? 'rotate-180' : ''}`} />
                  </button>
                  {showFilters.sources && (
                    <div className="absolute z-20 mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-xl">
                      <div className="p-3 border-b border-white/10 sticky top-0 bg-slate-800 space-y-2">
                        <input type="text" placeholder="Search sources..." value={sourceSearch} onChange={(e) => setSourceSearch(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                        <button onClick={() => selectAllFilters('sources')} className="w-full px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold">
                          Select All Sources
                        </button>
                        {relevantSources.length < allSources.length && (
                          <div className="text-xs text-blue-300">Showing {relevantSources.length} relevant sources</div>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {searchedSources.map(source => (
                          <label key={source.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">
                            <input type="checkbox" checked={filters.sources.includes(source.id)} onChange={() => toggleFilter('sources', source.id)} className="w-4 h-4 rounded border-white/20" />
                            <div className="flex-1">
                              <div className="text-white text-sm">{source.name}</div>
                              <div className="text-xs text-gray-400">{source.url}</div>
                            </div>
                          </label>
                        ))}
                        {searchedSources.length === 0 && (
                          <div className="px-4 py-6 text-center text-gray-400 text-sm">No sources found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Keywords Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Search className="w-4 h-4 inline mr-1" />Keywords
                  </label>
                  <input type="text" value={filters.searchKeywords} onChange={(e) => setFilters(prev => ({ ...prev, searchKeywords: e.target.value }))} placeholder="Search by title or keywords..." className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="mt-6 flex items-center gap-4">
                <button onClick={applyFilters} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />Search Intelligence
                </button>
                <button onClick={subscribeToFilters} className="px-6 py-3 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5" />Subscribe
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.regions.length > 0 || filters.countries.length > 0 || filters.categories.length > 0 || filters.sources.length > 0 || filters.searchKeywords) && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />Active Filters
                  </h3>
                  <button onClick={copyFilterURL} className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-1">
                    <Copy className="w-3 h-3" />Copy URL
                  </button>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  {filters.timeRange !== '7d' && (<div><span className="font-medium text-blue-300">Time:</span> {filters.timeRange}</div>)}
                  {filters.regions.length > 0 && (<div><span className="font-medium text-blue-300">Regions:</span> {filters.regions.map(r => regions.find(reg => reg.id === r)?.name).join(', ')}</div>)}
                  {filters.countries.length > 0 && (<div><span className="font-medium text-blue-300">Countries:</span> {filters.countries.map(c => Object.values(allCountries).flat().find(country => country.id === c)?.name).join(', ')}</div>)}
                  {filters.categories.length > 0 && (<div><span className="font-medium text-blue-300">Categories:</span> {filters.categories.map(c => categories.find(cat => cat.id === c)?.name).join(', ')}{filters.customTopic && ` (${filters.customTopic})`}</div>)}
                  {filters.sources.length > 0 && (<div><span className="font-medium text-blue-300">Sources:</span> {filters.sources.length} selected</div>)}
                  {filters.languages.length > 0 && (<div><span className="font-medium text-blue-300">Languages:</span> {filters.languages.map(l => languages.find(lang => lang.id === l)?.name).join(', ')}</div>)}
                  {filters.searchKeywords && (<div><span className="font-medium text-blue-300">Keywords:</span> "{filters.searchKeywords}"</div>)}
                </div>
              </div>
            )}

            {/* Strategic Intelligence Briefing - Shown after filtering */}
            {!loading && filteredNews.length > 0 && (
              <div className="space-y-6 mb-8">
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    Top 3 Critical Intelligence Briefings
                  </h2>
                  <p className="text-gray-300 text-sm mb-6">
                    Based on your filters: {filters.categories.length > 0 && `${filters.categories.length} categories`} 
                    {filters.countries.length > 0 && `, ${filters.countries.length} countries`}
                    {filters.regions.length > 0 && `, ${filters.regions.length} regions`}
                  </p>

                  {/* Top 3 Critical News */}
                  <div className="space-y-4">
                    {filteredNews
                      .filter(item => item.impact === 'Critical' || item.impact === 'High')
                      .slice(0, 3)
                      .map((item, idx) => (
                        <div key={item.id} className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-2xl font-bold text-red-400">#{idx + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                  item.impact === 'Critical' ? 'bg-red-500 text-white' :
                                  'bg-orange-500 text-white'
                                }`}>
                                  {item.impact} Impact
                                </span>
                                <span className="text-xs text-gray-400">
                                  {Object.values(allCountries).flat().find(c => c.id === item.country)?.flag} 
                                  {' '}
                                  {Object.values(allCountries).flat().find(c => c.id === item.country)?.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {categories.find(c => c.id === item.category)?.name}
                                </span>
                              </div>
                              <h3 
                                onClick={() => openArticle(item)}
                                className="text-xl font-bold text-white mb-2 hover:text-blue-400 cursor-pointer transition-colors"
                              >
                                {item.title}
                              </h3>
                              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                {item.brief}
                              </p>
                              
                              {/* Analytical Insights */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                  <div className="text-xs text-blue-300 mb-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Trend Direction
                                  </div>
                                  <div className="text-sm font-semibold text-white capitalize">{item.trend}</div>
                                </div>
                                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                  <div className="text-xs text-purple-300 mb-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Published
                                  </div>
                                  <div className="text-sm font-semibold text-white">
                                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                </div>
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                  <div className="text-xs text-green-300 mb-1 flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    Source
                                  </div>
                                  <div className="text-sm font-semibold text-white">
                                    {allSources.find(s => s.id === item.source)?.name}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => openArticle(item)}
                                className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold flex items-center gap-2"
                              >
                                Read Full Analysis
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Strategic Summary Section */}
                  <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-400" />
                      Strategic Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="text-xs text-gray-400 mb-1">Total Articles</div>
                        <div className="text-3xl font-bold text-white">{filteredNews.length}</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="text-xs text-gray-400 mb-1">Critical Impact</div>
                        <div className="text-3xl font-bold text-red-400">
                          {filteredNews.filter(n => n.impact === 'Critical').length}
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="text-xs text-gray-400 mb-1">High Impact</div>
                        <div className="text-3xl font-bold text-orange-400">
                          {filteredNews.filter(n => n.impact === 'High').length}
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="text-xs text-gray-400 mb-1">Countries Covered</div>
                        <div className="text-3xl font-bold text-blue-400">
                          {[...new Set(filteredNews.map(n => n.country))].length}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Charts Toggle */}
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() => setCurrentPage('analytics')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                      >
                        <BarChart3 className="w-5 h-5" />
                        View Interactive Analytics & Charts
                      </button>
                      <p className="text-xs text-gray-400 text-center">
                        Explore trends, compare countries, and analyze key metrics with interactive charts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Results */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-300 mt-4">Analyzing intelligence...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{filteredNews.length} Intelligence Reports</h2>
                </div>

                {filteredNews.length === 0 ? (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
                    <p className="text-gray-400">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  filteredNews.map((item) => (
                    <div key={item.id} onClick={() => openArticle(item)} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full">
                              {regions.find(r => r.id === item.region)?.name}
                            </span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
                              {categories.find(c => c.id === item.category)?.name}
                            </span>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              item.impact === 'Critical' ? 'bg-red-500/20 text-red-300' :
                              item.impact === 'High' ? 'bg-orange-500/20 text-orange-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {item.impact}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                          <p className="text-gray-400 leading-relaxed mb-4">{item.brief}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {allSources.find(s => s.id === item.source)?.name}
                            </span>
                            {readArticles.includes(item.id) && (
                              <span className="flex items-center gap-1 text-green-400">
                                <Check className="w-4 h-4" />Read
                              </span>
                            )}
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); saveArticle(item); }} className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ARTICLE DETAIL PAGE */}
        {currentPage === 'article' && selectedArticle && (
          <div className="space-y-6">
            <button onClick={() => setCurrentPage('news')} className="text-gray-400 hover:text-white flex items-center gap-2 transition-all">
              <ArrowRight className="w-4 h-4 rotate-180" />Back to News
            </button>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full">
                    {regions.find(r => r.id === selectedArticle.region)?.name}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                    {categories.find(c => c.id === selectedArticle.category)?.name}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedArticle.impact === 'Critical' ? 'bg-red-500/20 text-red-300' :
                    selectedArticle.impact === 'High' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {selectedArticle.impact}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight">{selectedArticle.title}</h1>
                <p className="text-xl text-gray-300 leading-relaxed">{selectedArticle.brief}</p>
                <div className="flex items-center gap-6 text-sm text-gray-400 pt-4 border-t border-white/10">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {allSources.find(s => s.id === selectedArticle.source)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button onClick={() => saveArticle(selectedArticle)} className="px-6 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />Save
                  </button>
                  <button onClick={() => { setShowSubscribeModal(true); setSelectedNewsForSubscription(selectedArticle); }} className="px-6 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2">
                    <Bell className="w-4 h-4" />Subscribe
                  </button>
                </div>
              </div>
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">{selectedArticle.content}</div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full hover:bg-white/20 transition-all cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USER PAGE */}
        {currentPage === 'user' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Intelligence Dashboard</h1>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5" />Saved Filters ({savedFilters.length})
              </h2>
              {savedFilters.length === 0 ? (
                <p className="text-gray-400">No saved filters yet.</p>
              ) : (
                <div className="space-y-3">
                  {savedFilters.map(sf => (
                    <div key={sf.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-all">
                      <div>
                        <h3 className="text-white font-semibold">{sf.name}</h3>
                        <p className="text-sm text-gray-400">Created {new Date(sf.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => { loadSavedFilter(sf); setCurrentPage('news'); }} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all">
                        Load
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />Subscriptions ({subscriptions.length})
              </h2>
              {subscriptions.length === 0 ? (
                <p className="text-gray-400">No subscriptions.</p>
              ) : (
                <div className="space-y-3">
                  {subscriptions.map(sub => (
                    <div key={sub.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{sub.topic}</h3>
                        <p className="text-sm text-gray-400">Email notifications enabled</p>
                      </div>
                      <button onClick={() => setSubscriptions(prev => prev.filter(s => s.id !== sub.id))} className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all">
                        Unsubscribe
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />AI Assistant
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
                  {chatMessages.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Ask me anything!</p>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="Ask about trends..." className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={sendChatMessage} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS PAGE - Enhanced with Interactive Filters */}
        {currentPage === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Analytics & Trends</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Interactive Charts</span>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Chart Filters */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Chart Filters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Compare Countries</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all" className="bg-slate-800">All Countries</option>
                    <option value="azerbaijan" className="bg-slate-800">Azerbaijan</option>
                    <option value="usa" className="bg-slate-800">United States</option>
                    <option value="china" className="bg-slate-800">China</option>
                    <option value="germany" className="bg-slate-800">Germany</option>
                    <option value="india" className="bg-slate-800">India</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="5y" className="bg-slate-800">Last 5 Years</option>
                    <option value="3y" className="bg-slate-800">Last 3 Years</option>
                    <option value="1y" className="bg-slate-800">Last Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Metrics</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all" className="bg-slate-800">All Metrics</option>
                    <option value="commodities" className="bg-slate-800">Commodities (Gold, Oil)</option>
                    <option value="economic" className="bg-slate-800">Economic (GDP, Growth)</option>
                    <option value="energy" className="bg-slate-800">Energy Production</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-6 h-6 text-yellow-400" />
                  <span className="text-sm text-yellow-300">Gold Price</span>
                </div>
                <div className="text-3xl font-bold text-white">$2,400</div>
                <div className="text-sm text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.5% YTD
                </div>
                <button className="mt-3 text-xs text-yellow-300 hover:text-yellow-200 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-orange-300">Oil Price</span>
                </div>
                <div className="text-3xl font-bold text-white">$92.5</div>
                <div className="text-sm text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +7.2% YTD
                </div>
                <button className="mt-3 text-xs text-orange-300 hover:text-orange-200 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-blue-300">Global GDP Growth</span>
                </div>
                <div className="text-3xl font-bold text-white">3.2%</div>
                <div className="text-sm text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  Stable
                </div>
                <button className="mt-3 text-xs text-blue-300 hover:text-blue-200 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-green-300">Renewable Energy</span>
                </div>
                <div className="text-3xl font-bold text-white">45%</div>
                <div className="text-sm text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% Growth
                </div>
                <button className="mt-3 text-xs text-green-300 hover:text-green-200 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>
            </div>

            {/* Interactive Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gold Trends - Interactive */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    Gold Market Trends (2020-2025)
                  </h3>
                  <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={goldTrendData}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    <Legend />
                    <Area type="monotone" dataKey="price" stroke="#f59e0b" fill="url(#goldGradient)" name="Price ($/oz)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <button className="px-3 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30">1 Year</button>
                  <button className="px-3 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30">3 Years</button>
                  <button className="px-3 py-2 bg-yellow-500/10 text-yellow-300 rounded-lg hover:bg-yellow-500/20 border border-yellow-500/30">5 Years</button>
                </div>
              </div>

              {/* Oil Price Trends - Interactive */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    Oil Price Analysis
                  </h3>
                  <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { year: '2020', price: 42 },
                    { year: '2021', price: 68 },
                    { year: '2022', price: 95 },
                    { year: '2023', price: 82 },
                    { year: '2024', price: 88 },
                    { year: '2025', price: 92.5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#f97316" strokeWidth={2} name="Crude Oil ($/barrel)" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Compare with:</span>
                  <button className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">Brent</button>
                  <button className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded text-xs border border-orange-500/30">WTI</button>
                  <button className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded text-xs">Natural Gas</button>
                </div>
              </div>

              {/* Topic Distribution - Interactive */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    News Topic Distribution
                  </h3>
                  <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 text-xs">
                    Export Data
                  </button>
                </div>
              </div>

              {/* Country Comparison - Interactive */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Country GDP Comparison
                  </h3>
                  <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { country: 'USA', gdp: 25.5, growth: 2.1 },
                    { country: 'China', gdp: 18.3, growth: 5.2 },
                    { country: 'Japan', gdp: 4.9, growth: 1.3 },
                    { country: 'Germany', gdp: 4.3, growth: 0.8 },
                    { country: 'India', gdp: 3.7, growth: 6.5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="country" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    <Legend />
                    <Bar dataKey="gdp" fill="#3b82f6" name="GDP (Trillion $)" />
                    <Bar dataKey="growth" fill="#10b981" name="Growth (%)" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">+ Add Country</button>
                  <button className="px-3 py-1 bg-green-500/20 text-green-300 rounded text-xs">+ Add Azerbaijan</button>
                </div>
              </div>

              {/* Regional Energy Production */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    Regional Energy Production & Growth
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 text-xs flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Export
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    { region: 'Europe', production: 3200, growth: 5.2, renewable: 45 },
                    { region: 'Asia', production: 5800, growth: 8.7, renewable: 38 },
                    { region: 'N. America', production: 4100, growth: 3.1, renewable: 42 },
                    { region: 'Middle East', production: 2900, growth: 6.4, renewable: 15 },
                    { region: 'Africa', production: 1200, growth: 12.3, renewable: 28 },
                    { region: 'S. America', production: 1800, growth: 4.5, renewable: 52 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="region" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    <Legend />
                    <Bar dataKey="production" fill="#f97316" name="Production (TWh)" />
                    <Bar dataKey="growth" fill="#10b981" name="Growth (%)" />
                    <Bar dataKey="renewable" fill="#3b82f6" name="Renewable (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategic Insights */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                AI-Powered Insights
              </h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Gold Price Forecast</h4>
                      <p className="text-sm text-gray-300">Based on current trends and central bank buying patterns, gold prices are projected to reach $2,600-$2,800 within 12-18 months.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Energy Transition Trend</h4>
                      <p className="text-sm text-gray-300">Renewable energy adoption accelerating across all regions, with South America leading at 52% renewable share.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Subscribe</h3>
              <button onClick={() => setShowSubscribeModal(false)} className="text-gray-400 hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" placeholder="your@email.com" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="realtime" className="bg-slate-800">Real-time</option>
                  <option value="daily" className="bg-slate-800">Daily</option>
                  <option value="weekly" className="bg-slate-800">Weekly</option>
                </select>
              </div>
              <button onClick={() => { setSubscriptions(prev => [...prev, { id: Date.now(), topic: selectedNewsForSubscription?.title || 'Current filters' }]); setShowSubscribeModal(false); alert('Subscribed!'); }} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;