import { useEffect, useState } from "react";
import Office from "./three/Office";

function App() {
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");


  const loadTasks = (deskId) => {
    setTasksLoading(true);

    fetch(`http://localhost:5000/api/tasks/${deskId}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setTasksLoading(false);
      })
      .catch(err => {
        console.error(err);
        setTasksLoading(false);
      });
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !selectedDesk) return;

    const newTask = {
      id: `temp-${Date.now()}`,
      title: newTaskTitle,
      status: "pending"
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle("");
  };


  useEffect(() => {
    fetch("http://localhost:5000/api/desks")
      .then(res => res.json())
      .then(data => {
        setDesks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }, []);

  if (loading) {
    return <h2>Loading 3D office...</h2>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Office
        desks={desks}
        setSelectedDesk={(desk) => {
          setSelectedDesk(desk);
          loadTasks(desk.id);
        }}
      />


      {selectedDesk && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "#111",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            minWidth: "200px"
          }}
        >
          <h3>Desk Info</h3>
          <p><b>Owner:</b> {selectedDesk.owner}</p>
          <p><b>Status:</b> {selectedDesk.status}</p>
          <p><b>Light:</b> {selectedDesk.light ? "ON" : "OFF"}</p>

          <h4>Create Task</h4>

          <input
            type="text"
            placeholder="Enter task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
          />

          <button onClick={handleCreateTask}>
            Add Task
          </button>


          <h4>Tasks</h4>

          {tasksLoading && <p>Loading tasks...</p>}

          {!tasksLoading && tasks.length === 0 && (
            <p>No tasks</p>
          )}

          {!tasksLoading && tasks.map(task => (
            <p key={task.id}>
              {task.status === "done" ? "✅" : "⏳"} {task.title}
            </p>
          ))}


          <button
            style={{ marginTop: "8px" }}
            onClick={() => setSelectedDesk(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
