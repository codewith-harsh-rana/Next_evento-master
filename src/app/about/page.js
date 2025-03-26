import React from 'react';

const page = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">About Us</h1>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Welcome to our website! We are dedicated to providing the best services and solutions to our customers. 
                    Our team is passionate about innovation, collaboration, and delivering exceptional value.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    Our mission is to create a positive impact through our work and build long-lasting relationships with our clients. 
                    Thank you for visiting, and we look forward to working with you!
                </p>
            </div>
        </div>
    );
};

export default page;