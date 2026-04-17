import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api.js";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const stored = JSON.parse(localStorage.getItem("user"));
  const role = stored?.user?.role;

  // 🔄 Fetch Users
  const fetchUsers = async () => {
    try {
      const { data } = await API.get(
        `/users?page=${page}&limit=5&search=${search}`
      );
      setUsers(data.users);
    } catch (err) {
    //   console.log(err);
         toast.error(err.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // ➕ Create User
  const handleCreate = async () => {
    try {
      await API.post("/users", form);
         toast.success("User created successfully");
      setForm({ name: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  // ✏️ Update User
  const handleEdit = async (user) => {
    const newName = prompt("Enter new name", user.name);
    if (!newName) return;

    try {
      await API.put(`/users/${user._id}`, { name: newName });
      toast.success("User updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ❌ Delete (Deactivate)
  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      toast.success("User deactivated");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deactivation failed");
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search users..."
        className="border p-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* ➕ Create User (Admin Only) */}
      {role === "admin" && (
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <h3 className="font-bold mb-2">Create User</h3>

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Name"
              className="border p-2 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="border p-2 rounded"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              className="border p-2 rounded"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            onClick={handleCreate}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
          >
            Create User
          </button>
        </div>
      )}

      {/* 📋 Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              {role === "admin" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="text-center border-t">
                <td className="p-3">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "Active" : "Inactive"}</td>

                {role === "admin" && (
                  <td>
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔄 Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

    </div>
  );
}