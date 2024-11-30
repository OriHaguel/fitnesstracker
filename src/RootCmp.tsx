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

export function RootCmp() {
    const location = useLocation();
    const { data: user, isLoading } = userService.useAuthUser();

    const showNavbar = location.pathname !== '/' && location.pathname !== '/auth';

    // Don't render anything while checking auth status to prevent flashes
    if (isLoading) {
        return null;
    }

    // Handle auth-required routes
    if ((location.pathname === '/' || location.pathname === '/auth') && user) {
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