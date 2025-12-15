import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    return (
        <div className={`flex flex-col items-center justify-center animate-fade-in ${className}`}>
            <div className="relative">
                {/* Outer ring */}
                <div
                    className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClasses[size]}`}
                />
                {/* Inner spinning element */}
                <div
                    className={`absolute top-0 left-0 animate-spin rounded-full border-2 border-transparent border-t-red-cross-600 border-r-red-cross-500 ${sizeClasses[size]}`}
                    style={{ animationDuration: '1s' }}
                />
                {/* Red Cross symbol in center */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'lg' || size === 'xl' ? 'block' : 'hidden'}`}>
                    <div className="w-2 h-2 bg-red-cross-600 animate-pulse"></div>
                </div>
            </div>
            {text && (
                <p className="mt-3 text-sm text-gray-600 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;