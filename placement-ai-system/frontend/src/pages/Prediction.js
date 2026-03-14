import Sidebar from "../components/Sidebar"

function Prediction(){

return(

<div className="app-layout">

<Sidebar/>

<div className="main">

<h2>Placement Prediction</h2>

<div className="grid-2">

<div className="card">

<h3>Student Information</h3>

<p>
Enter details to predict placement readiness
</p>

<input placeholder="Section"/>
<input placeholder="Roll Number"/>
<input placeholder="Department"/>
<input placeholder="Aptitude Score"/>
<input placeholder="Mock Interview"/>
<input placeholder="Problems Solved"/>
<input placeholder="Hackathon Count"/>
<input placeholder="Resume Score"/>
<input placeholder="Projects Count"/>

<button className="btn-primary">
Predict Placement Readiness
</button>

</div>

<div className="card">

<h3>Prediction Result</h3>

<p>
AI-powered placement readiness analysis
</p>

<div style={{textAlign:"center",marginTop:"80px"}}>
Enter student details to generate prediction
</div>

</div>

</div>

</div>

</div>

)

}

export default Prediction