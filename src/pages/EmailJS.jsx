
function EmailJS() {

    const handleSendMessage = () => {
    };
  
    return (
      <div>
        <form className="mt-8" onSubmit={handleSendMessage}>
          <div className="flex flex-col space-y-4">
            <label
              htmlFor="email"
              className="text-lg font-medium uppercase text-white"
            >
              Send email directly
            </label>
            <input
              type="text"
              id="message"
              name="message"
              placeholder="Enter your message here"
              className="p-3   rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="p-3  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 uppercase text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              send
            </button>
          </div>
        </form>
        
      </div>
    );
  }
  
  export default EmailJS;
