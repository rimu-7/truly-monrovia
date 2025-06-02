import React from 'react'
import { FaArrowRight } from 'react-icons/fa6';


const LiberiaAbout = () => {
    return (
        <div>
            <div className="flex flex-col lg:flex-row p-6 md:p-12 bg-gray-50">
                {/* First Column - About TM Magazine */}
                <div className="w-full lg:w-1/2 lg:pr-4 mb-8 lg:mb-0">
                    <div className="h-full p-8 md:p-12 bg-white rounded-xl  transition-all duration-300 transform  flex flex-col justify-between">
                        <div>
                            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
                                About <span className="text-blue-600">TM</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                                TM Magazine is the gateway to Liberia - its beauty, voice and cultural fire.
                            </p>
                        </div>
                        <button className="self-start flex gap-2 justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full text-lg transition-all duration-300 hover:translate-x-1 ">
                            Read More <FaArrowRight />
                        </button>
                    </div>
                </div>

                {/* Second Column - The New Liberia */}
                <div className="w-full lg:w-1/2 lg:pl-4">
                    <div className="h-full p-8 md:p-12 bg-orange-200 rounded-xl  transition-all duration-300 transform  flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                The New <span className="text-white">Liberia</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
                                Exploring a nation on the rise as Liberia embraces its future while honoring its heritage.
                            </p>
                        </div>
                        <button className="self-start flex gap-2 justify-center items-center bg-gray-900 hover:bg-black text-white font-medium py-3 px-8 rounded-full text-lg transition-all duration-300 hover:translate-x-1">
                            Read Issue <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiberiaAbout
