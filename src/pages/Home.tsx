import { ChevronRight, Dumbbell, Heart, Trophy, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { userService } from '@/services/user/user.service.remote';
import { initUser, login } from '@/store/actions/user.actions';
export const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPublicRoute = location.pathname === '/' || location.pathname === '/auth';
  const { data: user, isLoading } = userService.useAuthUser();
  const navigate = useNavigate()
  useEffect(() => {
    if (isPublicRoute && user?.user) {
      initUser(user.user);
    }

  }, [isPublicRoute, user]);

  async function handleDemoUserLogin() {
    await login({ username: '', gmail: 'demo@user', password: '123', weight: [], workouts: [] })
    navigate('/dashboard')
  }


  if (isPublicRoute && isLoading) {
    return null;
  }

  if (isPublicRoute && user?.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white relative overflow-hidden min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 animate-pulse"></div>

        {/* Navigation */}
        <nav className="container mx-auto px-4 md:px-6 py-4 md:py-6 relative backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl md:text-4xl font-bold tracking-tight flex items-center">
              <Dumbbell className="mr-2 h-6 w-6 md:h-8 md:w-8" />
              FitTrack
            </div>

            {/* Desktop Navigation */}
            {/* <div className="hidden md:flex items-center space-x-6">
              <Link to={'/auth'}>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 scale-100 hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div> */}

            {/* Mobile Navigation */}
            {/* <div className="flex items-center gap-4 md:hidden">
              <Link to={'/auth'}>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 scale-100 hover:scale-105">
                  Get Started
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-white/20"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div> */}
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-blue-800/95 backdrop-blur-sm shadow-lg mt-2 py-4 px-4 rounded-lg border border-white/10 md:hidden">
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="text-white hover:bg-white/20 w-full justify-start">
                  Features
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/20 w-full justify-start">
                  Pricing
                </Button>
              </div>
            </div>
          )}
        </nav>

        {/* Rest of the Hero Section */}
        <div className="flex-1 flex items-center py-8 md:py-0">
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 leading-tight animate-fade-in">
                Transform Your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 block">
                  Fitness Journey
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 text-blue-100 max-w-2xl mx-auto leading-relaxed px-4">
                Your personal AI-powered fitness companion. Customized workouts, nutrition tracking, and real-time coaching - all in one app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center px-4">
                <Link to={'/auth'}>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-6 md:px-8 py-6 h-auto scale-100 hover:scale-105 w-full sm:w-auto"
                  >
                    Signup
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/50 bg-inherit hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-6 md:px-8 py-6 h-auto scale-100 hover:scale-105 w-full sm:w-auto"
                  onClick={handleDemoUserLogin}
                >
                  Start as a guest
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 md:py-32 container mx-auto px-4 md:px-6 bg-gradient-to-b from-white to-blue-50">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 md:mb-24 text-gray-900">
          Why Choose <span className="text-blue-600">FitTrack</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
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
              <CardContent className="pt-8 p-6 md:p-8 text-center relative">
                <div className="mb-6 bg-blue-100 w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 animate-pulse"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">Start Your Journey Today</h2>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 max-w-2xl mx-auto text-blue-100 px-4">Join thousands of users who have transformed their lives with FitTrack</p>
          <Link to={'/auth'}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 h-auto scale-100 hover:scale-105 w-full sm:w-auto"
            >
              Signup Now
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;