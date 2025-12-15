import React from 'react';

const RedCrossSymbol = ({
    size = 'md',
    className = '',
    showBackground = true,
    animate = false,
    variant = 'circle' // 'circle', 'white', 'red', 'original'
}) => {
    const circularSizeClasses = {
        sm: 'red-cross-circle-sm',
        md: 'red-cross-circle-md',
        lg: 'red-cross-circle-lg',
        xl: 'red-cross-circle-xl',
        '2xl': 'red-cross-circle-2xl'
    };

    // Use the pure CSS circular cross design (default and most readable)
    if (variant === 'circle' || !variant) {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <div className={`
                    red-cross-circle ${circularSizeClasses[size]}
                    ${animate ? 'red-cross-logo animate-heartbeat' : ''}
                `}>
                </div>
            </div>
        );
    }

    // Legacy image-based implementation for other variants
    const imageSizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
        '2xl': 'w-24 h-24'
    };

    const backgroundClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
        xl: 'w-24 h-24',
        '2xl': 'w-28 h-28'
    };

    const getImageFilter = () => {
        switch (variant) {
            case 'white':
                return 'filter brightness-0 invert';
            case 'red':
                return 'filter hue-rotate(0deg) saturate(2) brightness(0.8)';
            case 'original':
            default:
                return '';
        }
    };

    const getFallbackCross = () => {
        const crossColor = variant === 'white' ? 'bg-white' : 'bg-red-cross-600';
        return (
            <div className="relative">
                <div className={`w-8 h-2 ${crossColor} rounded`}></div>
                <div className={`w-2 h-8 ${crossColor} rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>
            </div>
        );
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            {showBackground && (
                <div className={`
                    ${backgroundClasses[size]} 
                    bg-red-cross-600 rounded-full flex items-center justify-center overflow-hidden
                    ${animate ? 'red-cross-logo animate-heartbeat' : ''}
                `}>
                    <img
                        src="/red-cross-symbol.jpg"
                        alt="Red Cross Symbol"
                        className={`${imageSizeClasses[size]} object-contain ${getImageFilter()}`}
                        onError={(e) => {
                            // Fallback to CSS cross if image fails to load
                            e.target.style.display = 'none';
                            const fallback = e.target.parentNode.querySelector('.fallback-cross');
                            if (fallback) fallback.style.display = 'flex';
                        }}
                    />
                    <div className="fallback-cross hidden items-center justify-center">
                        {getFallbackCross()}
                    </div>
                </div>
            )}

            {!showBackground && (
                <div className={`${imageSizeClasses[size]} flex items-center justify-center`}>
                    <img
                        src="/red-cross-symbol.jpg"
                        alt="Red Cross Symbol"
                        className={`${imageSizeClasses[size]} object-contain ${getImageFilter()}`}
                        onError={(e) => {
                            // Fallback to CSS cross if image fails to load
                            e.target.style.display = 'none';
                            const fallback = e.target.parentNode.querySelector('.fallback-cross');
                            if (fallback) fallback.style.display = 'flex';
                        }}
                    />
                    <div className="fallback-cross hidden items-center justify-center">
                        {getFallbackCross()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RedCrossSymbol;