import logo from './logo.svg';
import './App.css';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
          <header className="text-3xl font-bold text-blue-600 mb-4">
            Welcome to My Website
          </header>
          <p className="text-lg text-gray-700 mb-8">
            We're glad to have you here. Explore and enjoy our content!
          </p>
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
            Get Started
          </button>
        </div>
      );
}

export default App;
