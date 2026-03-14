import {Link} from "react-router-dom"

function Sidebar(){

return(

<div className="sidebar">

<div className="sidebar-title">
AI Placement
</div>

<div className="sidebar-sub">
Dashboard System
</div>

<ul>

<Link to="/faculty"><li>Dashboard</li></Link>
<Link to="/students"><li>Student Data</li></Link>
<Link to="/analytics"><li>Analytics</li></Link>
<Link to="/prediction"><li className="active">Placement Prediction</li></Link>
<Link to="/reports"><li>Reports</li></Link>

</ul>

</div>

)

}

export default Sidebar