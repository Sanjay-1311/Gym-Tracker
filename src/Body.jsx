import WorkoutActivity from "./WorkoutActivity";
import QuickActions from "./QuickActions";
import Initial from "./Welcome-initial";
function Body(){
    return (

        <>
        <div className="Body">
            <div className="Initial-elems">
                <Initial />
            </div>
            <div className="first-box-elems"><WorkoutActivity />
            <QuickActions /></div>
            <p className="Recent-workout-title">Recent Workouts</p>
        

        </div>
        
        </>
        
    );
}
export default Body