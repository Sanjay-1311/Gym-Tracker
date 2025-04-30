import React from "react";
import DashboardHeader from "./Header";
import Initial from "./Welcome-initial";
import StatsRow from "./StatsRow";
import WorkoutActivity from "./WorkoutActivity";
import QuickActions from "./QuickActions";
import Title from "./Title";
import RecentWorkouts from "./RecentWorkouts";

function Dashboard() {
  return (
    <>
      <Title />
      <DashboardHeader />
      <div className="Body">
        <div className="Initial-elems">
          <Initial />
        </div>
        <StatsRow />
        <div className="first-box-elems">
          <WorkoutActivity />
          <QuickActions />
        </div>
        <RecentWorkouts />
      </div>
    </>
  );
}

export default Dashboard; 