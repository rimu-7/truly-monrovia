import React from 'react'

const LiberiaCover = () => {
    return (
        <div>
            <div className="relative min-h-screen flex items-center justify-start  overflow-hidden">
                {/* Background Cover Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.pexels.com/photos/1251171/pexels-photo-1251171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Liberian story cover"
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = ""
                        }}
                    />
                </div>

                {/* Text Content Overlay */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:px-12 lg:px-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight">
                            Telling the Liberian story boldly
                        </h1>
                        {/* <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg md:text-xl transition duration-300 transform hover:translate-x-1">
                            Read Issue Now
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiberiaCover
