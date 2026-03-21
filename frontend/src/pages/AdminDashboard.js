import {useEffect,useState} from "react";
import axios from "axios";
import API from "../api";


function AdminDashboard(){

const [students,setStudents] = useState([]);

const user = JSON.parse(localStorage.getItem("user"));

useEffect(()=>{

axios.get("/admin/students",{

params:{
role:user.role,
department:user.department
}

})
.then(res=>setStudents(res.data));

},[]);

return(

<div style={{padding:"40px"}}>

<h2>Admin Dashboard</h2>

<table border="1" cellPadding="10">

<thead>
<tr>
<th>Adm No</th>
<th>Name</th>
<th>Department</th>
<th>Email</th>
</tr>
</thead>

<tbody>

{students.map(s=>(
<tr key={s._id}>
<td>{s.adm_no}</td>
<td>{s.name}</td>
<td>{s.department}</td>
<td>{s.email}</td>
</tr>
))}

</tbody>

</table>

</div>

);

}

export default AdminDashboard;