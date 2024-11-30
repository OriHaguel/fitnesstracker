import { Routes, Route, useLocation, Navigate } from 'react-router'
import FitnessDashboard from './pages/fitness-dashboard'
import Calendar from './pages/Calendar'
import { NavBar } from './cmps/NavBar'
import AuthPage from './pages/fitness-auth-page'
import WorkoutListPage from './pages/workout-list-page'
import WorkoutEditPage from './pages/workout-edit-page'
import Home from './pages/Home'
import { WorkoutTrackingPage } from './pages/workout-tracking-page'
import { userService } from './services/user/user.service.remote'
import { useEffect } from 'react'

export function RootCmp() {
    const location = useLocation();
    const { data: user, isLoading } = userService.useAuthUser();
    const showNavbar = location.pathname !== '/' && location.pathname !== '/auth';
    const isPublicRoute = location.pathname === '/' || location.pathname === '/auth';

    useEffect(() => {
        if (user) {
            userService.saveLoggedinUser(user.user)
        }
    }, [user]);

    // Don't render anything until we know the auth state on public routes
    if (isPublicRoute && isLoading) {
        return null;
    }

    // Once we know the auth state, handle redirects
    if (isPublicRoute && user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="main-container">
            {showNavbar && <NavBar />}
            <main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/dashboard' element={<FitnessDashboard />} />
                    <Route path='/schedule' element={<Calendar />} />
                    <Route path='/auth' element={<AuthPage />} />
                    <Route path='/workouts' element={<WorkoutListPage />} />
                    <Route path='/workouts/:id' element={<WorkoutEditPage />} />
                    <Route path='/workouts/new' element={<WorkoutEditPage />} />
                    <Route path='/today' element={<WorkoutTrackingPage />} />
                </Routes>
            </main>
        </div>
    )
}