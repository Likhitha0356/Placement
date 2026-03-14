function Card({title,value,color}){

  return(

    <div className={`p-6 rounded-lg shadow text-white ${color}`}>

      <h3 className="text-sm">{title}</h3>

      <p className="text-2xl font-bold">{value}</p>

    </div>

  )

}

function DashboardCards(){

  return(

    <div className="grid grid-cols-4 gap-6 mt-6">

      <Card title="Total Students" value="10000" color="bg-blue-500"/>

      <Card title="Avg Aptitude" value="72" color="bg-purple-500"/>

      <Card title="Problems Solved" value="185" color="bg-green-500"/>

      <Card title="Placement Ready" value="64%" color="bg-red-500"/>

    </div>

  )

}

export default DashboardCards;