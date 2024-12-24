import { useState } from 'react';
import { Dumbbell, Calendar, ChartBar, CalendarCheck, BarChart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '@/store/actions/user.actions';

export function NavBar() {
    const [activeNav, setActiveNav] = useState('home');
    const navigate = useNavigate()
    const navItems = [
        { id: 'dashboard', icon: ChartBar, label: 'Dashboard' },
        { id: 'workouts', icon: Dumbbell, label: 'Workouts' },
        { id: 'calendar', icon: Calendar, label: 'Schedule' },
        { id: 'today', icon: CalendarCheck, label: 'Today' },
        { id: 'graph', icon: BarChart, label: 'Graph' },
    ];

    const handleLogout = async () => {
        // Add your logout logic here
        try {
            logout()
            navigate('/')

        } catch (error) {
            console.log("🚀 ~ handleLogout ~ error:", error)
        }

        console.log('Logout clicked');
    };

    return (
        <section>
            <nav className="fitness-dashboard__sidebar">
                <div className="flex flex-col items-center w-full h-full">
                    <div className="flex-grow">
                        {navItems.map((item) => (
                            <Link
                                to={item.label.toLocaleLowerCase() === 'home' ? '/' : `/${item.label.toLocaleLowerCase()}`}
                                key={item.id}
                                className={`fitness-dashboard__sidebar-item ${activeNav === item.id ? 'fitness-dashboard__sidebar-item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <item.icon className="fitness-dashboard__sidebar-icon" />
                                <span className="fitness-dashboard__sidebar-label">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="fitness-dashboard__sidebar-item mt-auto"
                    >
                        <LogOut className="fitness-dashboard__sidebar-icon" />
                        <span className="fitness-dashboard__sidebar-label">Logout</span>
                    </button>
                </div>
            </nav>
            <nav className="fitness-dashboard__mobile-nav">
                <div className="fitness-dashboard__mobile-nav-container">
                    {navItems.map((item) => (
                        <Link
                            to={item.label.toLocaleLowerCase() === 'home' ? '/' : `/${item.label.toLocaleLowerCase()}`}
                            key={item.id}
                            className={`fitness-dashboard__mobile-nav-item ${activeNav === item.id ? 'fitness-dashboard__mobile-nav-item--active' : ''}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <item.icon
                                className="fitness-dashboard__mobile-nav-item-icon"
                                strokeWidth={2}
                            />
                            <span className="fitness-dashboard__mobile-nav-item-label">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>
        </section>
    );
}