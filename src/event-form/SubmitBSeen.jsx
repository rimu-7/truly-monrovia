
import EventForm from "./FormBSeen";
// import ImageGallery from "./ImageGallery";

const SubmitBSeen = () => {

  return (
    <div className="">
      <div className="min-h-screen py-20">

          <>
            {/* <div className="bg-gray-800 rounded-lg py-12 px-4 sm:px-6 lg:px-8 font-inter max-w-7xl w-full mx-auto">
              <h1 className="text-4xl sm:text-5xl text-center text-yellow-300 font-extrabold mb-4">
                {activeEvent.eventTitle}
              </h1>
              <p className="text-lg text-center mb-8">
                powered by truly monrovia - a creative experience like no other
              </p>

              <h2 className="text-3xl sm:text-4xl text-center text-yellow-300 font-bold mb-6">
                About the Event
              </h2>
              <p className="leading-relaxed text-center md:text-left mb-8">
                {activeEvent.eventDescription}
              </p>
            </div> */}
            <div className="">
              <EventForm />
            </div>
          </>
       
      </div>
    </div>
  );
};

export default SubmitBSeen;
