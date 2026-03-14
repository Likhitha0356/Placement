import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function StudentDashboard(){

return(

<div className="min-h-screen bg-gray-100">

<Sidebar/>

<div className="ml-64">

<Navbar/>

<div className="p-10">

<h2 className="text-2xl font-bold mb-6">
Student Dashboard
</h2>

<div className="grid grid-cols-4 gap-6">

{/* Aptitude */}

<div className="p-6 rounded-xl shadow-lg bg-blue-500 text-white hover:scale-105 transition">

<p>Aptitude Score</p>
<h2 className="text-3xl font-bold">78</h2>

</div>

{/* Projects */}

<div className="p-6 rounded-xl shadow-lg bg-purple-500 text-white hover:scale-105 transition">

<p>Projects</p>
<h2 className="text-3xl font-bold">3</h2>

</div>

{/* Hackathons */}

<div className="p-6 rounded-xl shadow-lg bg-green-500 text-white hover:scale-105 transition">

<p>Hackathons</p>
<h2 className="text-3xl font-bold">2</h2>

</div>

{/* Technical */}

<div className="p-6 rounded-xl shadow-lg bg-yellow-500 text-white hover:scale-105 transition">

<p>Technical Score</p>
<h2 className="text-3xl font-bold">82</h2>

</div>

</div>

{/* Placement Status */}

<div className="mt-10 bg-white p-8 rounded-xl shadow">

<h3 className="text-xl font-semibold mb-4">
Placement Readiness
</h3>

<div className="grid grid-cols-2 gap-6">

<div className="bg-green-100 p-6 rounded-lg">

<p>Placement Probability</p>

<h2 className="text-3xl font-bold">
74%
</h2>

</div>

<div className="bg-yellow-100 p-6 rounded-lg">

<p>Status</p>

<h2 className="text-2xl font-bold">
Needs Improvement
</h2>

</div>

</div>

</div>

</div>

</div>

</div>

)

}

export default StudentDashboard;