import { Routes, Route, useLocation } from 'react-router'
import Calendar from './pages/Calendar'
import { NavBar } from './cmps/NavBar'
import AuthPage from './pages/fitness-auth-page'
import WorkoutListPage from './pages/workout-list-page'
import WorkoutEditPage from './pages/workout-edit-page'
import Home from './pages/Home'
import { WorkoutTrackingPage } from './pages/workout-tracking-page'
import { StatsPage } from './pages/workout-analytics-chartjs'
import { FitnessDashboard } from './pages/fitness-dashboard'


export function RootCmp() {
    const location = useLocation();
    const showNavbar = location.pathname !== '/' && location.pathname !== '/auth';


    return (
        <div className={`bg-gradient-to-br ${showNavbar && 'main-container'} from-blue-50`}>
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