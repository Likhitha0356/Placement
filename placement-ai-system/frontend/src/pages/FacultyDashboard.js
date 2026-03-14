import Sidebar from "../components/Sidebar"
import DashboardCards from "../components/DashboardCards"
import AnalyticsChart from "../components/AnalyticsChart"

function FacultyDashboard(){

return(

<div className="app-layout">

<Sidebar/>

<div className="main">

<h2>Placement Analytics Dashboard</h2>

<DashboardCards/>

<AnalyticsChart/>

</div>

</div>

)

}

export default FacultyDashboard