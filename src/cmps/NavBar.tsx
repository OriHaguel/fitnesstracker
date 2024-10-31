
import { useState } from 'react';
import { Activity, Dumbbell, Calendar, ChartBar } from 'lucide-react';
// import { Home, Activity, Dumbbell, Calendar, ChartBar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NavBar() {

    const [activeNav, setActiveNav] = useState('home');
    const navItems = [
        // { id: 'home', icon: Home, label: 'Home' },
        { id: 'dashboard', icon: ChartBar, label: 'dashboard' },
        { id: 'workouts', icon: Dumbbell, label: 'Workouts' },
        { id: 'calendar', icon: Calendar, label: 'Schedule' },
        { id: 'activity', icon: Activity, label: 'Activity' },
        //add logout insted of home if you see fit
    ];
    return (
        <section>
            <nav className="fitness-dashboard__sidebar">
                <div className="flex flex-col items-center w-full">
                    {navItems.map((item) => (
                        <Link to={item.label.toLocaleLowerCase() === 'home' ? '/' : `/${item.label.toLocaleLowerCase()}`}
                            key={item.id}
                            className={`fitness-dashboard__sidebar-item ${activeNav === item.id ? 'fitness-dashboard__sidebar-item--active' : ''
                                }`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <item.icon className="fitness-dashboard__sidebar-icon" />
                            <span className="fitness-dashboard__sidebar-label">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
            <nav className="fitness-dashboard__mobile-nav">
                <div className="fitness-dashboard__mobile-nav-container">
                    {navItems.map((item) => (
                        <Link
                            to={item.label.toLocaleLowerCase() === 'home' ? '/' : `/${item.label.toLocaleLowerCase()}`}
                            key={item.id}
                            className={`fitness-dashboard__mobile-nav-item ${activeNav === item.id ? 'fitness-dashboard__mobile-nav-item--active' : ''
                                }`}
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
    )
}