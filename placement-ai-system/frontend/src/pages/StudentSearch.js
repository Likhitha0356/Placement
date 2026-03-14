import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

import {
PieChart,
Pie,
Cell,
Tooltip,
BarChart,
Bar,
XAxis,
YAxis,
ResponsiveContainer
} from "recharts";

const COLORS = ["#3b82f6","#22c55e","#facc15","#ef4444","#8b5cf6","#ef4444"];

function StudentSearch(){

const [roll,setRoll] = useState("");
const [student,setStudent] = useState(null);
const [chartType,setChartType] = useState("pie");

const searchStudent = () => {

setStudent({
sec:"A",
dept:"CSE",
aptitude:78,
mock:74,
problems:210,
hackathons:2,
technical:82,
resume:80,
projects:3,
readiness:"Needs Improvement",
probability:"74%"
});

};

const chartData = student ? [

{ name:"Aptitude", value:student.aptitude },
{ name:"Mock Interview", value:student.mock },
{ name:"Technical", value:student.technical },
{ name:"Projects", value:student.projects },
{ name:"Hackathons", value:student.hackathons }

] : [];

return(

<div className="min-h-screen bg-gray-100">

<Sidebar/>

<div className="ml-64">

<Navbar/>

<div className="p-10">

<h2 className="text-2xl font-bold mb-6">
Student Search
</h2>

{/* Search */}

<div className="bg-white p-6 rounded-xl shadow mb-8 flex gap-4">

<input
placeholder="Enter Roll Number"
value={roll}
onChange={(e)=>setRoll(e.target.value)}
className="border px-4 py-2 rounded-lg"
/>

<button
onClick={searchStudent}
className="bg-blue-600 text-white px-6 py-2 rounded-lg"
>
Search
</button>

</div>

{/* Student Details */}

{student && (

<div className="bg-white p-8 rounded-xl shadow mb-10">

<h3 className="text-xl font-semibold mb-6">
Student Details
</h3>

<div className="grid grid-cols-4 gap-6">

<div className="bg-blue-100 p-4 rounded">
<p>Section</p>
<h2 className="font-bold">{student.sec}</h2>
</div>

<div className="bg-green-100 p-4 rounded">
<p>Department</p>
<h2 className="font-bold">{student.dept}</h2>
</div>

<div className="bg-purple-100 p-4 rounded">
<p>Aptitude Score</p>
<h2 className="font-bold">{student.aptitude}</h2>
</div>

<div className="bg-yellow-100 p-4 rounded">
<p>Mock Interview</p>
<h2 className="font-bold">{student.mock}</h2>
</div>

<div className="bg-red-100 p-4 rounded">
<p>Problems Solved</p>
<h2 className="font-bold">{student.problems}</h2>
</div>

<div className="bg-indigo-100 p-4 rounded">
<p>Hackathons</p>
<h2 className="font-bold">{student.hackathons}</h2>
</div>

<div className="bg-pink-100 p-4 rounded">
<p>Technical Score</p>
<h2 className="font-bold">{student.technical}</h2>
</div>

<div className="bg-gray-200 p-4 rounded">
<p>Resume Score</p>
<h2 className="font-bold">{student.resume}</h2>
</div>

<div className="bg-blue-200 p-4 rounded">
<p>Projects</p>
<h2 className="font-bold">{student.projects}</h2>
</div>

<div className="bg-green-200 p-4 rounded">
<p>Placement Probability</p>
<h2 className="font-bold">{student.probability}</h2>
</div>

<div className="bg-orange-200 p-4 rounded">
<p>Placement Readiness</p>
<h2 className="font-bold">{student.readiness}</h2>
</div>

</div>

</div>

)}

{/* Chart Selector */}

{student && (

<div className="bg-white p-6 rounded-xl shadow mb-6">

<label className="mr-4 font-semibold">
Select Chart Type:
</label>

<select
value={chartType}
onChange={(e)=>setChartType(e.target.value)}
className="border px-3 py-2 rounded"
>

<option value="pie">Pie Chart</option>
<option value="bar">Bar Chart</option>

</select>

</div>

)}

{/* Chart */}

{student && (

<div className="bg-white p-8 rounded-xl shadow">

<ResponsiveContainer width="100%" height={350}>

{chartType === "pie" ? (

<PieChart>

<Pie
data={chartData}
dataKey="value"
outerRadius={120}
label
>

{chartData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index]} />
))}

</Pie>

<Tooltip/>

</PieChart>

) : (

<BarChart data={chartData}>

<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Bar
dataKey="value"
fill="#3b82f6"
radius={[8,8,0,0]}
/>

</BarChart>

)}

</ResponsiveContainer>

</div>

)}

</div>

</div>

</div>

)

}

export default StudentSearch;