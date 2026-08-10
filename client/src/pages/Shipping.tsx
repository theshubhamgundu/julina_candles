import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../redux/reducers/cart.reducer';
import { RootState } from '../redux/store';
import { notify } from '../utils/util';
import BackButton from '../components/common/BackBtn';
import { FaCrosshairs, FaMapMarkerAlt, FaTruck, FaShieldAlt } from 'react-icons/fa';
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
        description: 'Enter your delivery address for Julina Candles & Melts.',
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

    const [name, setName] = useState(shippingInfo.name || user?.name || '');
    const [email, setEmail] = useState(shippingInfo.email || user?.email || '');
    const [address, setAddress] = useState(shippingInfo.address || '');
    const [landmark, setLandmark] = useState(shippingInfo.landmark || '');
    const [city, setCity] = useState(shippingInfo.city || '');
    const [state, setState] = useState(shippingInfo.state || 'Telangana');
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || '');
    const [phone, setPhone] = useState(shippingInfo.phone || '');

    // Captured Coordinates state
    const [latitude, setLatitude] = useState<number | undefined>(shippingInfo.latitude);
    const [longitude, setLongitude] = useState<number | undefined>(shippingInfo.longitude);
    const [locatingGPS, setLocatingGPS] = useState(false);

    // Auto-fill address via GPS Reverse Geocoding
    const handleDetectGPS = () => {
        if (!navigator.geolocation) {
            notify('Geolocation is not supported by your browser', 'error');
            return;
        }

        setLocatingGPS(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                setLatitude(lat);
                setLongitude(lng);

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

                        const formattedStreet = parts.join(', ') || data.display_name?.split(',').slice(0, 3).join(', ') || '';
                        
                        if (formattedStreet) setAddress(formattedStreet);
                        if (detectedCity) setCity(detectedCity);
                        if (detectedPinCode) setPinCode(detectedPinCode);

                        if (detectedState) {
                            const match = INDIAN_STATES.find(s => s.toLowerCase() === detectedState.toLowerCase());
                            if (match) setState(match);
                        }
                        notify('Location details filled automatically!', 'success');
                    }
                } catch (e) {
                    console.error("GPS Reverse geocode error:", e);
                    notify('GPS location detected!', 'success');
                } finally {
                    setLocatingGPS(false);
                }
            },
            (error) => {
                console.error("GPS detection error:", error);
                notify('Unable to detect location. Please type your address manually.', 'error');
                setLocatingGPS(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedName = name.trim();

        if (!trimmedName || !email || !phone || !address || !city || !state || !pinCode) {
            notify('Please fill all required fields', 'error');
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
        if (!/^\d{6}$/.test(pinCode.trim())) {
            notify('Please enter a valid 6-digit Pincode', 'error');
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
            pinCode: pinCode.trim(),
            phone,
            latitude,
            longitude,
            deliveryType: 'nearest_landmark',
        }));

        navigate('/checkout');
    };

    const inputClass = "w-full px-4 py-3 border-2 border-[#ede3cf] rounded-xl bg-white text-sm focus:border-[#5C2333] focus:ring-1 focus:ring-[#5C2333]/30 outline-none transition-all placeholder:text-gray-400";
    const labelClass = "block text-xs font-bold text-[#5C2333] uppercase tracking-wider mb-1.5";

    return (
        <div className="min-h-screen bg-[#faf6ee] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <BackButton />

                {/* Page Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5C2333]">
                        Delivery Address
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Enter your shipping details for order delivery
                    </p>
                </div>

                {/* Main Form Box */}
                <div className="bg-white rounded-2xl border-2 border-[#ede3cf] p-6 shadow-lg">

                    {/* Auto-Fill via GPS Header */}
                    <div className="mb-6 p-4 rounded-xl bg-[#f7f4ec] border border-[#ede3cf] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-[#5C2333]/10 text-[#5C2333]">
                                <FaMapMarkerAlt className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-[#5C2333] uppercase tracking-wider mb-0.5">
                                    Auto-Fill Location
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Use GPS to automatically fill your current city & address
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleDetectGPS}
                            disabled={locatingGPS}
                            className="w-full sm:w-auto bg-[#5C2333] hover:bg-[#134b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 active:scale-95"
                        >
                            <FaCrosshairs className={locatingGPS ? "animate-spin" : ""} />
                            <span>{locatingGPS ? "Detecting..." : "Use Current Location"}</span>
                        </button>
                    </div>

                    {/* Standard E-Commerce Address Form */}
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
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputClass}
                                placeholder="10-digit mobile number"
                                required
                            />
                        </div>

                        {/* Flat / House No. & Street Address */}
                        <div>
                            <label className={labelClass}>
                                Flat, House No., Building & Street <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={inputClass}
                                placeholder="House/Flat No., Building Name, Street"
                                required
                            />
                        </div>

                        {/* Landmark Field */}
                        <div>
                            <label className={labelClass}>Landmark (Optional)</label>
                            <input
                                type="text"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Near HDFC Bank, Opposite Park"
                            />
                        </div>

                        {/* City, State & Pincode Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>City <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g. Hyderabad"
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
                                <label className={labelClass}>Pincode <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={pinCode}
                                    onChange={(e) => setPinCode(e.target.value)}
                                    className={inputClass}
                                    placeholder="6-digit Pincode"
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>

                        {/* Security / Delivery Trust Info */}
                        <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-[#ede3cf]/60">
                            <span className="flex items-center gap-1.5 text-[#5C2333] font-medium">
                                <FaTruck /> Fast & Secure Pan-India Shipping
                            </span>
                            <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                <FaShieldAlt /> Safe Checkout
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#5C2333] hover:bg-[#134b28] text-white font-bold py-3.5 px-4 rounded-full transition-colors shadow-md text-base mt-4 flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Payment ➔</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;

