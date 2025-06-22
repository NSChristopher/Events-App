import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Users, Heart, Sparkles, PartyPopper, MapPin } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                VividEvents
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <PartyPopper className="h-20 w-20 text-purple-600 animate-bounce" />
              <Sparkles className="h-8 w-8 text-pink-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent mb-6">
            Bring Events to Life
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Create, discover, and join amazing events in your community. VividEvents makes organizing 
            and attending events as vibrant and exciting as the events themselves!
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start Creating Events <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90 backdrop-blur-sm hover:transform hover:scale-105">
            <CardHeader className="text-center">
              <Calendar className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-xl text-purple-800">Create Amazing Events</CardTitle>
              <CardDescription className="text-gray-600">
                Design beautiful events with rich descriptions, dates, locations, and invite your friends to join the fun.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90 backdrop-blur-sm hover:transform hover:scale-105">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-pink-600 mx-auto mb-4" />
              <CardTitle className="text-xl text-pink-800">Connect & Invite</CardTitle>
              <CardDescription className="text-gray-600">
                Send invitations to friends, manage RSVPs, and see who's attending. Build your community one event at a time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90 backdrop-blur-sm hover:transform hover:scale-105">
            <CardHeader className="text-center">
              <Heart className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
              <CardTitle className="text-xl text-yellow-800">Discover & Join</CardTitle>
              <CardDescription className="text-gray-600">
                Explore exciting events in your area, RSVP with a click, and never miss out on memorable experiences.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white/90 rounded-xl shadow-xl p-8 mb-16 backdrop-blur-sm border border-purple-200">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            How VividEvents Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Create Your Event</h4>
              <p className="text-gray-600">Set up your event with all the details - title, date, location, and description. Make it as vibrant as you want!</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Invite Friends</h4>
              <p className="text-gray-600">Send invitations to friends and watch as they RSVP. Track who's coming and plan accordingly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Enjoy Together</h4>
              <p className="text-gray-600">Meet up, have fun, and create lasting memories. Then plan your next amazing event!</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Make Events Vivid?</h3>
          <p className="text-xl mb-6 opacity-90">
            Join our community of event creators and make every gathering memorable.
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Create Your First Event
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Full Stack Template
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Modern Full Stack Template
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A complete starter template with React 18, Express.js, Prisma, and JWT authentication.
            Get your project up and running in minutes, not hours.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>User Authentication</CardTitle>
              <CardDescription>
                Complete JWT-based authentication with registration, login, and protected routes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>CRUD Operations</CardTitle>
              <CardDescription>
                Full create, read, update, and delete functionality for posts with user ownership.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>
                Built with React 18, Vite, Tailwind CSS, Express.js, Prisma, and SQLite.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tech Stack
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Frontend</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• React 18 with TypeScript</li>
                <li>• Vite for fast development</li>
                <li>• Tailwind CSS for styling</li>
                <li>• ShadCN UI components</li>
                <li>• Lucide React icons</li>
                <li>• Sonner for toast notifications</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Backend</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Express.js REST API</li>
                <li>• Prisma ORM</li>
                <li>• SQLite database</li>
                <li>• JWT authentication</li>
                <li>• Cookie-based sessions</li>
                <li>• CORS enabled</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;