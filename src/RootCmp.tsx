import { Routes, Route, useLocation, Navigate } from 'react-router'
import Calendar from './pages/Calendar'
import { NavBar } from './cmps/NavBar'
import AuthPage from './pages/fitness-auth-page'
import WorkoutListPage from './pages/workout-list-page'
import WorkoutEditPage from './pages/workout-edit-page'
import Home from './pages/Home'
import { WorkoutTrackingPage } from './pages/workout-tracking-page'
import { userService } from './services/user/user.service.remote'
import { initUser } from './store/actions/user.actions'
import { StatsPage } from './pages/workout-analytics-chartjs'
import { FitnessDashboard } from './pages/fitness-dashboard'


export function RootCmp() {
    const location = useLocation();
    const { data: user, isLoading } = userService.useAuthUser();
    const showNavbar = location.pathname !== '/' && location.pathname !== '/auth';
    const isPublicRoute = location.pathname === '/' || location.pathname === '/auth';

    if (isPublicRoute && isLoading) {
        return null;
    }

    if (isPublicRoute && user?.user) {
        initUser(user.user)
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
                    <Route path='/graph' element={<StatsPage />} />
                </Routes>
            </main>
        </div>
    )
}