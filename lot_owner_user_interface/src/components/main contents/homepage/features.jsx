import React from 'react';
import { ReactComponent as CctvIcon } from '../../../assets/images/lock-hashtag-svgrepo-com.svg'; 
import { ReactComponent as CarIcon } from '../../../assets/images/maps-and-flags-map-location-svgrepo-com.svg';
import { ReactComponent as KeyIcon } from '../../../assets/images/valet-head-svgrepo-com.svg';
import { ReactComponent as MapIcon } from '../../../assets/images/maps-svgrepo-com.svg';

const Features = () => {
    return (
        <div id="features" className="bg-gray-100 py-8 flex justify-center min-h-[40vh]">
            <div className="container place-items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-w-[90vw]">

                {/* Feature Block 1 */}
                <div className="feature_block bg-white p-6 w-full md:w-[250px] h-auto md:h-[250px] rounded-lg shadow-md flex flex-col border transition-transform duration-300 transform hover:-translate-y-2 hover:bg-[#16d445] group">
                    <div className="flex items-center mb-4">
                        <CctvIcon className="h-16 w-16 text-[#16d445] mr-4 group-hover:text-white" />
                        <div className="text-black text-xl font-extrabold group-hover:text-white">
                            Safe And <br /> Secure
                        </div>
                    </div>
                    <div className="text-gray-600 text-base group-hover:text-white">
                        Advanced security with 24-hour surveillance to keep your parking lot safe and secure.
                    </div>
                </div>

                {/* Feature Block 2 */}
                <div className="feature_block bg-white p-6 w-full md:w-[250px] h-auto md:h-[250px] rounded-lg shadow-md flex flex-col border transition-transform duration-300 transform hover:-translate-y-2 hover:bg-[#16d445] group">
                    <div className="flex items-center mb-4">
                        <CarIcon className="h-16 w-16 text-[#16d445] mr-4 group-hover:text-white" />
                        <div className="text-black text-xl font-extrabold group-hover:text-white">
                            Flexible <br /> Booking
                        </div>
                    </div>
                    <div className="text-gray-600 text-base group-hover:text-white">
                        Convenient online booking with options for date-wise, hour-wise, and on-the-go reservations.
                    </div>
                </div>

                {/* Feature Block 3 */}
                <div className="feature_block bg-white p-6 w-full md:w-[250px] h-auto md:h-[250px] rounded-lg shadow-md flex flex-col border transition-transform duration-300 transform hover:-translate-y-2 hover:bg-[#16d445] group">
                    <div className="flex items-center mb-4">
                        <KeyIcon className="h-16 w-16 text-[#16d445] mr-4 group-hover:text-white" />
                        <div className="text-black text-xl font-extrabold group-hover:text-white">
                            Automated <br /> Services
                        </div>
                    </div>
                    <div className="text-gray-600 text-base group-hover:text-white">
                        Streamlined management with automated hardware to enhance the efficiency of your parking operations.
                    </div>
                </div>

                {/* Feature Block 4 */}
                <div className="feature_block bg-white p-6 w-full md:w-[250px] h-auto md:h-[250px] rounded-lg shadow-md flex flex-col border transition-transform duration-300 transform hover:-translate-y-2 hover:bg-[#16d445] group">
                    <div className="flex items-center mb-4">
                        <MapIcon className="h-16 w-16 text-[#16d445] mr-4 group-hover:text-white" />
                        <div className="text-black text-xl font-extrabold group-hover:text-white">
                            Easy Access <br /> Anytime
                        </div>
                    </div>
                    <div className="text-gray-600 text-base group-hover:text-white">
                        Effortless access with our user-friendly interface, ensuring a seamless parking experience.
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Features;
