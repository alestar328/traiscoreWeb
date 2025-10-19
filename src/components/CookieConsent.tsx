import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CookieConsent.css';

interface CookieConsentProps {
    onAccept?: (preferences: CookiePreferences) => void;
    onDecline?: () => void;
}

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always true, cannot be disabled
        analytics: false,
        marketing: false,
        preferences: false
    });

    useEffect(() => {
        // Check if user has already made a choice
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            setShowBanner(true);
        } else {
            const savedPreferences = JSON.parse(cookieConsent);
            setPreferences(savedPreferences);
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
        };
        setPreferences(allAccepted);
        localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
        setShowBanner(false);
        onAccept?.(allAccepted);
    };

    const handleAcceptSelected = () => {
        localStorage.setItem('cookieConsent', JSON.stringify(preferences));
        setShowBanner(false);
        setShowPreferences(false);
        onAccept?.(preferences);
    };

    const handleDecline = () => {
        const necessaryOnly: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        setPreferences(necessaryOnly);
        localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
        setShowBanner(false);
        onDecline?.();
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Cannot disable necessary cookies
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const resetConsent = () => {
        localStorage.removeItem('cookieConsent');
        setShowBanner(true);
    };

    if (!showBanner) {
        return (
            <div className="cookie-consent-reset">
                <button onClick={resetConsent} className="reset-consent-btn">
                    Manage Cookie Preferences
                </button>
            </div>
        );
    }

    return (
        <div className="cookie-consent-overlay">
            <div className="cookie-consent-banner">
                <div className="cookie-consent-content">
                    <div className="cookie-consent-header">
                        <h3>🍪 Cookie Preferences</h3>
                        <p>
                            We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                            By clicking "Accept All", you consent to our use of cookies.
                        </p>
                    </div>

                    {!showPreferences ? (
                        <div className="cookie-consent-actions">
                            <button 
                                onClick={() => setShowPreferences(true)}
                                className="cookie-btn cookie-btn-secondary"
                            >
                                Customize
                            </button>
                            <button 
                                onClick={handleDecline}
                                className="cookie-btn cookie-btn-secondary"
                            >
                                Decline All
                            </button>
                            <button 
                                onClick={handleAcceptAll}
                                className="cookie-btn cookie-btn-primary"
                            >
                                Accept All
                            </button>
                        </div>
                    ) : (
                        <div className="cookie-preferences">
                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <h4>Necessary Cookies</h4>
                                    <div className="cookie-toggle disabled">
                                        <input 
                                            type="checkbox" 
                                            checked={true} 
                                            disabled 
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                                <p>Essential for the website to function properly. Cannot be disabled.</p>
                            </div>

                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <h4>Analytics Cookies</h4>
                                    <div className="cookie-toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.analytics}
                                            onChange={() => togglePreference('analytics')}
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                                <p>Help us understand how visitors interact with our website.</p>
                            </div>

                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <h4>Marketing Cookies</h4>
                                    <div className="cookie-toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.marketing}
                                            onChange={() => togglePreference('marketing')}
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                                <p>Used to deliver personalized advertisements.</p>
                            </div>

                            <div className="cookie-category">
                                <div className="cookie-category-header">
                                    <h4>Preference Cookies</h4>
                                    <div className="cookie-toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.preferences}
                                            onChange={() => togglePreference('preferences')}
                                        />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                                <p>Remember your settings and preferences.</p>
                            </div>

                            <div className="cookie-preferences-actions">
                                <button 
                                    onClick={() => setShowPreferences(false)}
                                    className="cookie-btn cookie-btn-secondary"
                                >
                                    Back
                                </button>
                                <button 
                                    onClick={handleAcceptSelected}
                                    className="cookie-btn cookie-btn-primary"
                                >
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="cookie-consent-links">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms-of-service">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
