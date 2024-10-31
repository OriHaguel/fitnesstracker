
import { ChevronRight, Dumbbell, Heart, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white relative overflow-hidden min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 animate-pulse"></div>

        <nav className="container mx-auto px-6 py-6 relative backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="text-4xl font-bold tracking-tight flex items-center">
              <Dumbbell className="mr-2 h-8 w-8" />
              FitLife
            </div>
            <div className="space-x-6">
              <Button variant="ghost" className="text-white hover:bg-white">Features</Button>
              <Button variant="ghost" className="text-white hover:bg-white">Pricing</Button>
              <Link to={'/auth'}>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 scale-100 hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight animate-fade-in">
                Transform Your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 block">
                  Fitness Journey
                </span>
              </h1>
              <p className="text-2xl md:text-3xl mb-12 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Your personal AI-powered fitness companion. Customized workouts, nutrition tracking, and real-time coaching - all in one app.
              </p>
              <div className="flex gap-8 justify-center">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 h-auto scale-100 hover:scale-105"
                  >
                    Download Now
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </a>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/50  hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 h-auto scale-100 hover:scale-105 text-black"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-32 container mx-auto px-6 bg-gradient-to-b from-white to-blue-50">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-24 text-gray-900">
          Why Choose <span className="text-blue-600">FitLife</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <Dumbbell className="text-blue-600 h-8 w-8" />,
              title: "Smart Workouts",
              description: "AI-powered workout plans that adapt to your progress and goals"
            },
            {
              icon: <Heart className="text-blue-600 h-8 w-8" />,
              title: "Health Tracking",
              description: "Monitor your vital stats, nutrition, and wellness metrics in real-time"
            },
            {
              icon: <Trophy className="text-blue-600 h-8 w-8" />,
              title: "Goal Setting",
              description: "Set and track your fitness goals with detailed progress analytics"
            }
          ].map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-white/80 backdrop-blur-sm hover:-translate-y-2">
              <CardContent className="pt-8 p-8 text-center relative">
                <div className="mb-6 bg-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 animate-pulse"></div>
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">Start Your Journey Today</h2>
          <p className="text-2xl md:text-3xl mb-12 max-w-2xl mx-auto text-blue-100">Join thousands of users who have transformed their lives with FitLife</p>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block"
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-xl px-12 py-8 h-auto scale-100 hover:scale-105"
            >
              Download Now
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};


