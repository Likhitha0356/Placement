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

/* placement distribution */

const placementData = [
  { name: "Ready", value: 520 },
  { name: "Needs Improvement", value: 410 },
  { name: "Not Ready", value: 270 }
];

/* weak students detection */

const weakStudents = [
  { skill: "Aptitude", students: 120 },
  { skill: "Mock Interview", students: 150 },
  { skill: "Technical", students: 95 },
  { skill: "Resume", students: 110 }
];

const COLORS = ["#22c55e","#facc15","#ef4444"];

function AnalyticsChart(){

return(

<div className="grid grid-cols-2 gap-8 mt-10">

{/* Placement Chart */}

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-lg font-semibold mb-4">
Placement Readiness Distribution
</h3>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={placementData}
dataKey="value"
outerRadius={110}
label
>

{placementData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index]}/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

{/* Weak Students Chart */}

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-lg font-semibold mb-4">
Weak Skills Detection
</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={weakStudents}>

<XAxis dataKey="skill"/>
<YAxis/>
<Tooltip/>

<Bar
dataKey="students"
fill="#ef4444"
radius={[8,8,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)

}

export default AnalyticsChart