import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [token, setToken]= useState(localStorage.getItem("token"));
  const navigate = useNavigate();


  // console.log(token);
  useEffect(() => {
    if (!token) return navigate("/", { replace: true });

    const fetchMeAndNotes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/me", {
           headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          } 
          });
        if (!res.ok) throw new Error("Unauthorized hai");
        const data = await res.json();
        const {user: u, tenant: t} = data;
        setUser(u);
        setTenant(t);

        const notesRes = await fetch("http://localhost:3000/api/notes",
           { 
              method: "GET",
              headers: { 
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
              } 
            });
        const notesData = await notesRes.json();
        setNotes(notesData.notes || []);
      } catch (err) {
        console.error("error message: " ,err);
        localStorage.removeItem("token");
        setToken(null);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchMeAndNotes();
  }, [navigate, token]);




  const addNote = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      if(form.description === ""){
        alert("Description can't be empty");
        return;
      }
      const res = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 403) {
        alert(data.message);
        return;
      }
      if (!res.ok) throw new Error(data.message || "Failed to add");
      setNotes(prev => [data, ...prev]);
      setForm({ title: "", description: "" });
    } catch (err) {
      alert(err.message || "Error");
    } finally {
      setAdding(false);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm("Delete note?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/notes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed");
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const upgradeTenant = async () => {
    if (!tenant) return;
    if (!confirm("Upgrade tenant to PRO?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/tenants/${tenant.slug}/upgrade`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upgrade failed");
      setTenant(data.tenant);
      alert("Upgraded to PRO");
    } catch (err) {
      alert(err.message || "Upgrade failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto ">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Today</h1>
          <p className="text-sm text-gray-600">{tenant?.name} — {tenant?.plan}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">{user?.email} ({user?.role})</div>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </header>

      {user?.role === "ADMIN" && tenant?.plan === "FREE" && (
        <div className="mb-4">
          <button onClick={upgradeTenant} className="bg-green-600 text-white px-3 py-2 rounded">
            Upgrade tenant to PRO
          </button>
        </div>
      )}

      <section className="mb-6">
        <form onSubmit={addNote} className="space-y-2">
          <div className="mb-2">
            <label className="text-md mb-2" >Title</label>
            <input required placeholder="Title....." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded border-gray-700 outline-none" />
          </div>
          <div>
            <label className="text-md mb-1" >Description</label>
            <textarea placeholder="Description here ....." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded border-gray-700 outline-none" />
          </div>
          <div>
            <button disabled={adding} className="bg-blue-600 text-white px-4 py-2 rounded">{adding ? "Adding..." : "Add note"}</button>
          </div>
        </form>
      </section>

      <section>

        {notes.length === 0 ? (
         <div>
             <div className="text-center text-gray-500">No notes yet! start capturing your ideas by making notes</div>
             <div className="text-center text-gray-500">Have a nice day!</div>
         </div>
        ) : (
          <div className="space-y-3">
            {
             
              notes.map(note => {console.log("Note:", note); return (
                
                  <div key={note._id} className="p-4 border rounded flex justify-between">
                    <div>
                      <div className="font-semibold">{note.title}</div>
                      <p className="text-sm text-gray-600">{note.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => deleteNote(note._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                  </div>
                )})
            }
          </div>
        )}
      </section>


    </div>
  );
}
