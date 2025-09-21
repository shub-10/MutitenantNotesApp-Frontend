import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;


function Login(){
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form , setForm] = useState({email: "",password:"", tenant:"", role:"" });
  const navigate = useNavigate();

   
  const submitForm = async (e) => {
      e.preventDefault();
      try {
          const endpoint = isSignup? "signup": "login";

          const res = await fetch(`${apiUrl}/api/${endpoint}`, {
            method: "POST", 
            headers: {"Content-Type": "application/json"}, body: JSON.stringify(form),
          });

          const data = await res.json();
          console.log("data : ", data);
          // console.log(data.token);
         
          if(!res.ok){
            alert(data.message.toLowerCase() === "invalid credentials"? "Invalid credentials":"Unauthorized access. Choose your respective Tenant !!!!");
            throw new Error(err.message || "Request failed");
          }

          if(isSignup){
            alert("You have succesfully signed up !");
            setIsSignup(false);
            setForm({ ...form, password: "" });
          }
          else{
            localStorage.setItem("token", data.token);
            // console.log("token " ,localStorage.getItem("token"));
            navigate("/home");
          }

      } catch (error) {
          console.log("error", error);
      }
  };

  const handleChange = (e) =>{
        setForm({ ...form, [e.target.name]: e.target.value });
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
          <div className="w-full max-w-md h-auto bg-white flex flex-col justify-center items-center space-y-3 p-3">
              <h2 className="text-2xl font-bold">{isSignup? "Sign Up": "Login"}</h2>

              <form  onSubmit={submitForm} className="w-3/4 space-y-4 mb-5">
                  <div className="w-full flex flex-col">
                      <label className="text-sm mb-1">Email</label>
                      <input type="email" name="email" placeholder="" className=" border border-gray-300 p-2 rounded-lg" value={form.email} onChange={handleChange} required/>
                  </div>

                  <div className="w-full flex flex-col relative">
                    <label className="text-sm mb-1">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="border border-gray-300 p-2 rounded-lg pr-12"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div>
                      <label className="text-sm mb-1">Organization</label>
                      <select name="tenant" className="w-full border rounded-lg p-2" value={form.tenant} onChange={handleChange} required >
                        <option value="">Select</option>
                        <option value="acme">Acme</option>
                        <option value="globex">Globex</option>
                      </select>
                    </div>
                  
                  {isSignup && (
                      <>

                        <div>
                          <label className="text-sm mb-1">Role</label>
                          <select name="role" className="w-full border rounded-lg p-2" value={form.role} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MEMBER">Member</option>
                          </select>
                        </div>
                      </>
                    )}
                  

                  <button type="submit" className="w-full bg-blue-400 p-2 rounded-lg text-white text-sm font-semibold mb-r">{ isSignup? "Sign Up": "Login"}</button>

              </form>
              <p className="text-sm text-center mt-4">
                {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
                <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-blue-600 underline">
                  {isSignup ? "Login" : "Sign Up"}
                </button>
              </p>
          </div>  
    </div>
  );


}

export default Login;