import React from "react";

const NotFoundPage: React.FC = () => {
    return (
        <div className=" bg-gray-50 flex items-center justify-center p-52">
            <div className="max-w-md w-full text-center">
                {/* <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-exclamation-triangle text-2xl text-gray-500"></i>
                </div> */}
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-xl font-semibold text-gray-600 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-500 mb-8">
                    The page you're looking for doesn't exist.
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
