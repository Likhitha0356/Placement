import {PieChart,Pie,Cell,Tooltip,ResponsiveContainer} from "recharts"

const data=[
  {name:"Ready",value:520},
  {name:"Needs Improvement",value:410},
  {name:"Not Ready",value:270}
]

const COLORS=["#22c55e","#facc15","#ef4444"]

function PlacementPie(){

  return(

    <div style={{
      background:"white",
      padding:"20px",
      borderRadius:"10px",
      boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
      marginTop:"30px"
    }}>

      <h3>Placement Readiness Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >

            {data.map((entry,index)=>(
              <Cell key={index} fill={COLORS[index]}/>
            ))}

          </Pie>

          <Tooltip/>

        </PieChart>

      </ResponsiveContainer>

    </div>

  )

}

export default PlacementPie