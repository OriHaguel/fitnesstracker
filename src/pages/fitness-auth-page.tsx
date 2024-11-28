import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userService } from '@/services/user/user.service.remote';
import { login, signup } from '@/store/actions/user.actions';
import { Dumbbell, Mail, Lock, ArrowRight, Github, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedUser } from '../services/user/user.service.remote';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isSignup: boolean) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      onLogin(credentials, isSignup)
      setIsLoading(false)
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
    }
  };
  function handleChange({ target }: { target: HTMLInputElement }) {
    const { name: field, value } = target
    setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
  }

  async function onLogin(credentials: SavedUser, isSignup: boolean) {
    const method = isSignup ? signup : login
    await method(credentials)
    navigate('/dashboard')

  }
  const formFields = {
    login: [
      { id: "gmail", label: "gmail", name: 'gmail', type: "gmail", placeholder: "Enter your email", icon: <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" /> },
      { id: "password", label: "Password", name: 'password', type: "password", placeholder: "Enter your password", icon: <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" /> },
    ],
    signup: [
      { id: "signup-username", label: "Username", name: 'username', type: "text", placeholder: "Choose a username", icon: <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" /> },
      { id: "signup-gmail", label: "gmail", name: 'gmail', type: "gmail", placeholder: "Enter your email", icon: <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" /> },
      { id: "signup-password", label: "Password", name: 'password', type: "password", placeholder: "Create a password", icon: <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" /> },
    ],
  };

  interface Field {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    name: string
  }

  const renderFormFields = (fields: Field[]) => (
    fields.map(({ id, label, type, placeholder, icon, name }) => (
      <div key={id} className="space-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          {icon}
          <Input
            name={name}
            onChange={handleChange}
            id={id}
            type={type}
            placeholder={placeholder}
            className="pl-10"
            required
          />
        </div>
      </div>
    ))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="text-4xl font-bold tracking-tight flex items-center text-blue-600">
            <Dumbbell className="mr-2 h-8 w-8" />
            FitLife
          </div>
        </div>
      </nav>

      {/* Auth Container */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Welcome to FitLife</CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <div className="h-[280px]">
                <TabsContent value="login" className="h-full mt-0">
                  <form onSubmit={(ev) => handleSubmit(ev, false)} className="h-full flex flex-col">
                    <div className="space-y-4 flex-grow">
                      {renderFormFields(formFields.login)}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 h-auto mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center">
                          Login
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="h-full mt-0">
                  <form onSubmit={(ev) => handleSubmit(ev, true)} className="h-full flex flex-col">
                    <div className="space-y-4 flex-grow">
                      {renderFormFields(formFields.signup)}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 h-auto mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center">
                          Create Account
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm mt-16">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="py-6 h-auto">
                  <Github className="mr-2 h-5 w-5" />
                  Github
                </Button>
                <Button variant="outline" className="py-6 h-auto">
                  <Mail className="mr-2 h-5 w-5" />
                  Gmail
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;