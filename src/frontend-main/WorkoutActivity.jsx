import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", workouts: 3 },
  { day: "Tue", workouts: 1 },
  { day: "Wed", workouts: 2 },
  { day: "Thu", workouts: 0 },
  { day: "Fri", workouts: 1 },
  { day: "Sat", workouts: 4 },
  { day: "Sun", workouts: 2 },
];

function WorkoutActivity() {
  return (
    <div className="workout-activity-container">
      <div className="workout-activity-title">Workout Activity</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="workouts" fill="#1997e6" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WorkoutActivity;
