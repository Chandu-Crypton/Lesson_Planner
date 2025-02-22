import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import DarkModeToggle from "../components/DarkModeToggle"

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "demouser" && password === "demopass") {
      setAuth(true);
      navigate("/planner");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
     <div className="flex justify-end p-4">
        <DarkModeToggle />
      </div>
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
     
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} className="mt-2" />
        <Button className="mt-4 w-3/4" onClick={handleLogin}>Login</Button>
      </div>
    </div>
    </>
  );
 
}
