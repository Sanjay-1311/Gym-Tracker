import WorkoutActivity from "./WorkoutActivity";
import QuickActions from "./QuickActions";
function Body(){
    return (

        <>
        <div className="Body">
            <div className="first-box-elems"><WorkoutActivity />
            <QuickActions /></div>
            <p className="Recent-workout-title">Recent Workouts</p>
        

        </div>
        
        </>
        
    );
}
export default Body