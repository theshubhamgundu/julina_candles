import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { notify } from '../utils/util';
import BackButton from '../components/common/BackBtn';
import { FaMapMarkerAlt, FaCrosshairs, FaBuilding, FaCheckCircle, FaCompass, FaMap } from 'react-icons/fa';
import { usePageSEO } from '../hooks/usePageSEO';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const Shipping: React.FC = () => {
    usePageSEO({
        title: 'Shipping Address | Julina Candles & Melts',
        description: 'Enter your shipping address for Julina Candles & Melts delivery.',
        canonical: '/shipping',
        noIndex: true,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.user);
    const { shippingInfo, cartItems } = useSelector((state: RootState) => state.cart);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems.length, navigate]);

    // Delivery Type: 'current_location' | 'nearest_landmark'
    const [deliveryType, setDeliveryType] = useState<'current_location' | 'nearest_landmark'>(
        shippingInfo.deliveryType || 'current_location'
    );

    const [name, setName] = useState(shippingInfo.name || user?.name || '');
    const [email, setEmail] = useState(shippingInfo.email || user?.email || '');
    const [address, setAddress] = useState(shippingInfo.address || '');
    const [landmark, setLandmark] = useState(shippingInfo.landmark || '');
    const [city, setCity] = useState(shippingInfo.city || 'Hyderabad');
    const [state, setState] = useState(shippingInfo.state || 'Telangana');
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || '');
    const [phone, setPhone] = useState(shippingInfo.phone || '');
    
    // Suggested address from Geocoder
    const [suggestedAddr, setSuggestedAddr] = useState('');

    // Captured Coordinates state
    const [latitude, setLatitude] = useState<number | undefined>(shippingInfo.latitude);
    const [longitude, setLongitude] = useState<number | undefined>(shippingInfo.longitude);

    const [locatingGPS, setLocatingGPS] = useState(false);

    // Reverse Geocoding - purely suggestive, non-destructive
    const handleReverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
            const data = await res.json();
            if (data && data.address) {
                const { address: addr } = data;
                
                const detectedCity = addr.city || addr.town || addr.village || addr.county || '';
                const detectedState = addr.state || '';
                const detectedPinCode = addr.postcode || '';

                const parts = [];
                if (addr.building || addr.house_number) parts.push(addr.building || addr.house_number);
                if (addr.road || addr.pedestrian || addr.street) parts.push(addr.road || addr.pedestrian || addr.street);
                if (addr.suburb || addr.neighbourhood || addr.residential) parts.push(addr.suburb || addr.neighbourhood || addr.residential);

                const sAddr = parts.join(', ') || data.display_name?.split(',').slice(0, 3).join(', ') || '';
                setSuggestedAddr(sAddr);

                // Safely update empty fields
                setCity(prev => prev || detectedCity);
                setPinCode(prev => prev || detectedPinCode);
                
                if (detectedState) {
                    const match = INDIAN_STATES.find(s => s.toLowerCase() === detectedState.toLowerCase());
                    if (match) setState(prev => prev || match);
                }
            }
        } catch (e) {
            console.error("GPS Reverse geocode fallback error:", e);
        }
    };

    // High accuracy GPS Auto-Detection
    const handleDetectGPS = () => {
        if (!navigator.geolocation) {
            notify('Geolocation is not supported by your browser', 'error');
            return;
        }

        setLocatingGPS(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                setLatitude(lat);
                setLongitude(lng);
                handleReverseGeocode(lat, lng);
                setLocatingGPS(false);
                notify('Exact GPS location captured successfully!', 'success');
            },
            (error) => {
                console.error("GPS detection error:", error);
                notify('Unable to detect location. Please grant location permissions in your browser.', 'error');
                setLocatingGPS(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName || !email || !phone || !address) {
            notify('Please fill all required fields including Full Name, Email, Phone & Address', 'error');
            return;
        }
        if (deliveryType === 'nearest_landmark' && (!city || !state || !pinCode)) {
            notify('Please fill City, State and Pincode', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            notify('Please enter a valid email address', 'error');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            notify('Please enter a valid 10-digit mobile number', 'error');
            return;
        }
        if (deliveryType === 'current_location' && (!latitude || !longitude)) {
            notify('Please tap "Get My Location" to capture your GPS coordinates', 'error');
            return;
        }

        dispatch(saveShippingInfo({
            name: trimmedName,
            email,
            address,
            landmark,
            city,
            state,
            country: 'India',
            pinCode,
            phone,
            latitude: deliveryType === 'current_location' ? latitude : undefined,
            longitude: deliveryType === 'current_location' ? longitude : undefined,
            deliveryType,
        }));

        navigate('/checkout');
    };

    const inputClass = "w-full px-4 py-3 border-2 border-[#ede3cf] rounded-xl bg-white text-sm focus:border-[#185e33] focus:ring-1 focus:ring-[#185e33]/30 outline-none transition-all placeholder:text-gray-400";
    const labelClass = "block text-xs font-bold text-[#185e33] uppercase tracking-wider mb-1.5";

    return (
        <div className="min-h-screen bg-[#faf6ee] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <BackButton />

                {/* Page Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#185e33]">
                        Delivery Address
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Select your preferred delivery location method
                    </p>
                </div>

                {/* Delivery Option Prompt Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setDeliveryType('current_location')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                            deliveryType === 'current_location'
                                ? 'bg-white border-[#185e33] shadow-md ring-2 ring-[#185e33]/20'
                                : 'bg-white/70 border-[#ede3cf] hover:border-[#185e33]/50'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2.5 rounded-xl bg-[#185e33]/10 text-[#185e33]">
                                <FaMapMarkerAlt className="text-xl" />
                            </div>
                            {deliveryType === 'current_location' && (
                                <FaCheckCircle className="text-[#185e33] text-lg" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 mb-0.5">
                                Deliver to Current Location
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Pinpoint exact coordinates using GPS
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setDeliveryType('nearest_landmark')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                            deliveryType === 'nearest_landmark'
                                ? 'bg-white border-[#185e33] shadow-md ring-2 ring-[#185e33]/20'
                                : 'bg-white/70 border-[#ede3cf] hover:border-[#185e33]/50'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2.5 rounded-xl bg-[#c4633c]/10 text-[#c4633c]">
                                <FaBuilding className="text-xl" />
                            </div>
                            {deliveryType === 'nearest_landmark' && (
                                <FaCheckCircle className="text-[#185e33] text-lg" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 mb-0.5">
                                Deliver to Another Location
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Enter a different delivery address manually
                            </p>
                        </div>
                    </button>
                </div>

                {/* Main Form Box */}
                <div className="bg-white rounded-2xl border-2 border-[#ede3cf] p-6 shadow-lg">

                    {/* GPS Auto-Detect Header (Shown for Current Location mode) */}
                    {deliveryType === 'current_location' && (
                        <div className="mb-6 p-4 rounded-xl bg-[#f7f4ec] border border-[#ede3cf] flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div>
                                <h4 className="font-bold text-xs text-[#185e33] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                    <FaCompass /> GPS Location Detection
                                </h4>
                                <p className="text-xs text-gray-600">
                                    {latitude && longitude
                                        ? `Captured Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                                        : "Tap button to set exact delivery coordinates"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDetectGPS}
                                disabled={locatingGPS}
                                className="w-full sm:w-auto bg-[#185e33] hover:bg-[#134b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 active:scale-95"
                            >
                                <FaCrosshairs className={locatingGPS ? "animate-spin" : ""} />
                                <span>{locatingGPS ? "Detecting GPS..." : "📍 Get My Location"}</span>
                            </button>
                        </div>
                    )}

                    {/* Address & Contact Information Form */}
                    <form onSubmit={submitHandler} className="space-y-4">
                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputClass}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                    placeholder="Order confirmation email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone / WhatsApp Number */}
                        <div>
                            <label className={labelClass}>Phone / WhatsApp Number <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputClass}
                                placeholder="10-digit mobile number"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className={labelClass}>
                                House / Flat No. & Street Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={inputClass}
                                placeholder="House/Flat No., Building Name, Street"
                                required
                            />
                            {suggestedAddr && deliveryType === 'current_location' && (
                                <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                    <FaMap className="text-gray-400" /> Suggested: <button type="button" onClick={() => setAddress(suggestedAddr)} className="text-[#185e33] underline hover:text-[#134b28] text-left">{suggestedAddr}</button>
                                </p>
                            )}
                        </div>

                        {/* Landmark Field */}
                        <div>
                            <label className={labelClass}>
                                Landmark / Delivery Notes {deliveryType === 'nearest_landmark' && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="text"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Opposite SBI ATM, Gate No. 2"
                                required={deliveryType === 'nearest_landmark'}
                            />
                        </div>

                        {/* City, State & Pincode Row — only shown for Another Location */}
                        {deliveryType === 'nearest_landmark' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>City <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>State <span className="text-red-500">*</span></label>
                                    <select
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className={inputClass}
                                        required
                                    >
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Pin Code <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={pinCode}
                                        onChange={(e) => setPinCode(e.target.value)}
                                        className={inputClass}
                                        placeholder="6 digits"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#185e33] hover:bg-[#134b28] text-white font-bold py-3.5 px-4 rounded-full transition-colors shadow-md text-base mt-6 flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Checkout ➔</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;

