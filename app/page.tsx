export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-400">
      {/* Navigation */}
      <nav className="bg-white bg-opacity-10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-white text-2xl font-bold">FirstRepo</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-white hover:text-blue-100 transition">
                Features
              </a>
              <a href="#about" className="text-white hover:text-blue-100 transition">
                About
              </a>
              <a href="#contact" className="text-white hover:text-blue-100 transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to FirstRepo
        </h1>
        <p className="text-xl md:text-2xl text-blue-50 mb-8 max-w-3xl mx-auto">
          This is awesome. Build amazing things with our landing page template.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Get Started
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white bg-opacity-5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Fast & Reliable",
                description: "Built with Next.js for optimal performance",
              },
              {
                title: "Modern Design",
                description: "Beautiful and responsive user interface",
              },
              {
                title: "Easy to Customize",
                description: "Tailwind CSS for quick customization",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white hover:bg-opacity-20 transition"
              >
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-blue-50">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-30 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 FirstRepo. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
