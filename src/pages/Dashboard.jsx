import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("user"));

        if (!stored) {
            navigate("/");
        } else {
            setUser(stored.user);
        }
    }, []);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-2xl font-bold mb-4">
                Welcome, {user.name}
            </h1>

            <div className="bg-white p-6 rounded-xl shadow">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>

            {user.role === "admin" && (
                <button
                    onClick={() => window.location.href = "/users"}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Manage Users
                </button>
            )}

            {user.role === "manager" && (
                <div className="mt-4 p-4 bg-yellow-100 rounded">
                    <p>Manager Access</p>
                </div>
            )}

            {user.role === "user" && (
                <div className="mt-4 p-4 bg-green-100 rounded">
                    <p>User Access</p>
                </div>
            )}

            <button
                onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/";
                    toast.success("Logged out successfully");
                }}
                className="mt-6 ml-4 bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            
            </button>

        </div>
    );
}