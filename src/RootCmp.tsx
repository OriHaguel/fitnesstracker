import { Routes, Route, useLocation } from 'react-router'
import { Home } from './pages/Home'
import FitnessDashboard from './pages/fitness-dashboard'
import Calendar from './pages/Calendar'
import { NavBar } from './cmps/NavBar'
import AuthPage from './pages/fitness-auth-page'
import WorkoutListPage from './pages/workout-list-page'
import WorkoutEditPage from './pages/workout-edit-page'

export function RootCmp() {
    const location = useLocation();

    const showNavbar = location.pathname !== '/' && location.pathname !== '/auth';

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
                </Routes>
            </main>
        </div>
    )
}


