import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login(){

const [role,setRole] = useState("student");
const navigate = useNavigate();

const login = () => {

if(role === "faculty"){
navigate("/faculty");
}else{
navigate("/student");
}

};

return(

<div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">

<div className="bg-white p-10 rounded-xl shadow-lg w-96">

<h2 className="text-3xl font-bold text-center mb-8">
Placement AI System
</h2>

<p className="text-center text-gray-500 mb-6">
Login to continue
</p>

<select
onChange={(e)=>setRole(e.target.value)}
className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-6"
>

<option value="student">Student Login</option>
<option value="faculty">Faculty Login</option>

</select>

<button
onClick={login}
className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
>

Login

</button>

</div>

</div>

)

}

export default Login;