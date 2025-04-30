import React from "react";
import { Settings, Dumbbell, ChartBar, Calendar, User } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="bg-gray-900 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-blue-500" />
          <span className="text-white text-xl font-semibold">SculptTrack</span>
        </div>

        <nav className="flex items-center gap-6">
          {[
            { icon: ChartBar, label: "Dashboard" },
            { icon: Dumbbell, label: "Workouts" },
            { icon: Calendar, label: "Schedule" },
            { icon: User, label: "Profile" },
          ].map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-2 text-gray-300 hover:text-blue-500 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-gray-300 hover:text-blue-500 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-blue-500 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-sm">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
