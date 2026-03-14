function TopStudents(){

const students = [
{ roll:"CSE101", probability:92 },
{ roll:"CSE102", probability:89 },
{ roll:"CSE103", probability:87 },
{ roll:"CSE104", probability:85 },
{ roll:"CSE105", probability:83 }
]

return(

<div className="bg-white p-6 rounded-xl shadow mt-10">

<h3 className="text-lg font-semibold mb-4">
Top Placement-Ready Students
</h3>

<table className="w-full">

<thead>

<tr className="text-left border-b">

<th className="py-2">Roll Number</th>
<th>Placement Probability</th>

</tr>

</thead>

<tbody>

{students.map((s,index)=>(

<tr key={index} className="border-b">

<td className="py-2">{s.roll}</td>
<td>{s.probability}%</td>

</tr>

))}

</tbody>

</table>

</div>

)

}

export default TopStudents