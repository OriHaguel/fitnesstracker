import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userService } from '@/services/user/user.service.remote';
import { login, signup } from '@/store/actions/user.actions';
import { Dumbbell, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SavedUser } from '../services/user/user.service.remote';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState(userService.getEmptyCredentials());
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isSignup: boolean) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      await onLogin(credentials, isSignup);
      setIsLoading(false);
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      setIsLoading(false);
    }
  };

  function handleChange({ target }: { target: HTMLInputElement }) {
    const { name: field, value } = target;
    setCredentials(prevCreds => ({ ...prevCreds, [field]: value }));
  }

  async function onLogin(credentials: SavedUser, isSignup: boolean) {
    const method = isSignup ? signup : login;
    await method(credentials);
    navigate('/dashboard');
  }

  const formFields = {
    login: [
      { id: "gmail", label: "Email", name: 'gmail', type: "text", placeholder: "Enter your email", icon: <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> },
      { id: "password", label: "Password", name: 'password', type: "password", placeholder: "Enter your password", icon: <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> },
    ],
    signup: [
      { id: "signup-username", label: "Username", name: 'username', type: "text", placeholder: "Choose a username", icon: <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> },
      { id: "signup-gmail", label: "Email (You don't need a real Email)", name: 'gmail', type: "email", placeholder: "Enter your email", icon: <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> },
      { id: "signup-password", label: "Password", name: 'password', type: "password", placeholder: "Create a password", icon: <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /> },
    ],
  };

  interface Field {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    name: string;
  }

  const renderFormFields = (fields: Field[]) => (
    fields.map(({ id, label, type, placeholder, icon, name }) => (
      <div key={id} className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <Link to={'/'}>
            <div className="text-3xl md:text-4xl font-bold tracking-tight flex items-center text-blue-600">
              <Dumbbell className="mr-2 h-6 w-6 md:h-8 md:w-8" />
              FitTrack
            </div>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome to FitTrack</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Sign in to start tracking your fitness journey
            </p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <form onSubmit={(ev) => handleSubmit(ev, false)} className="space-y-6">
                  <div className="space-y-4">
                    {renderFormFields(formFields.login)}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-base py-5 h-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <form onSubmit={(ev) => handleSubmit(ev, true)} className="space-y-6">
                  <div className="space-y-4">
                    {renderFormFields(formFields.signup)}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-base py-5 h-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;