import { useNavigate } from "react-router-dom";

function Navbar() {

const navigate = useNavigate();

const logout = () => {
  navigate("/");
};

return(

<div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

<h1 className="text-xl font-semibold">
Placement Analytics Dashboard
</h1>

<div className="flex items-center gap-4">

<span className="text-gray-600">
Faculty
</span>

<img
src="https://i.pravatar.cc/40"
alt="profile"
className="rounded-full border"
/>

<button
onClick={logout}
className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
>

Logout

</button>

</div>

</div>

)

}

export default Navbar;