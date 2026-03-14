import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import DashboardCards from "../components/DashboardCards"
import AnalyticsChart from "../components/AnalyticsChart"
import PlacementPie from "../components/PlacementPie"

function FacultyDashboard(){

  return(

    <div style={{background:"#f3f4f6",minHeight:"100vh"}}>

      <Sidebar/>

      <div style={{marginLeft:"220px"}}>

        <Navbar/>

        <div style={{padding:"30px"}}>

          <h1>Faculty Analytics Dashboard</h1>

          <p style={{color:"#6b7280"}}>
            Monitor department placement readiness
          </p>

          <DashboardCards/>

          <AnalyticsChart/>

          <PlacementPie/>

        </div>

      </div>

    </div>

  )

}

export default FacultyDashboard