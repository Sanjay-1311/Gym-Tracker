
import React from 'react';
import { Settings, Dumbbell, ChartBar, Calendar, User } from 'lucide-react';

function Dashboard(){
    return (
    <>
    <div className="header-sec">
        <div className="Name">
            <Dumbbell size={24} className="logo" />
            <p>SculpTrack</p>
        </div>
        <div className="Main-Components">
        <div className="nav-item">
                <ChartBar size={24} />
                <p>Dashboard</p>
            </div>
            <div className="nav-item">
                <Dumbbell size={24} />
                <p>Workouts</p>
            </div>
            <div className="nav-item">
                <Calendar size={24} />
                <p>Schedule</p>
            </div>
            <div className="nav-item">
                <User size={24} />
                <p>Profile</p>
            </div>
        </div>
        <div className="Settings-icon">
            <Settings size={24} className='setting-logo'/>
            <div className='sign-in'>
                <User size={24} />
                <p>Sign In</p>
            </div>
            
        </div>
           
        
    </div>
    
    </>
    );
}
export default Dashboard