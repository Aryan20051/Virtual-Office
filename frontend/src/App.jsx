import { useEffect, useState } from "react";
import Office from "./three/Office";

function App() {
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesk, setSelectedDesk] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Load desks
  useEffect(() => {
    fetch("http://localhost:5000/api/desks")
      .then(res => res.json())
      .then(data => {
        setDesks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load tasks when desk changes
  useEffect(() => {
    if (!selectedDesk) return;

    setTasksLoading(true);
    fetch(`http://localhost:5000/api/tasks/${selectedDesk.id}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setTasksLoading(false);
      });
  }, [selectedDesk]);

  const reloadTasks = () => {
    fetch(`http://localhost:5000/api/tasks/${selectedDesk.id}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !selectedDesk) return;

    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deskId: selectedDesk.id,
        title: newTaskTitle
      })
    })
      .then(() => {
        setNewTaskTitle("");
        reloadTasks();
      });
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE"
    }).then(() => reloadTasks());
  };

  const handleToggleTaskStatus = (taskId) => {
    fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "PATCH"
    }).then(() => reloadTasks());
  };

  if (loading) return <h2>Loading 3D office...</h2>;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Office desks={desks} setSelectedDesk={setSelectedDesk} />

      {selectedDesk && (
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            width: 300,
            padding: 18,
            borderRadius: 16,
            background: "rgba(17,17,17,0.6)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            color: "#fff",
            fontFamily: "Inter, system-ui"
          }}
        >
          <h3 style={{ marginBottom: 4 }}>{selectedDesk.owner}</h3>
          <p style={{ fontSize: 12, opacity: 0.7 }}>
            Status: {selectedDesk.status}
          </p>

          {/* Create Task */}
          <input
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="New task..."
            style={{
              width: "100%",
              marginTop: 12,
              padding: 10,
              borderRadius: 10,
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.1)",
              color: "#fff"
            }}
          />

          <button
            onClick={handleCreateTask}
            style={{
              marginTop: 10,
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "#22c55e",
              color: "#000",
              fontWeight: 600
            }}
          >
            Add Task
          </button>

          {/* Tasks */}
          <div style={{ marginTop: 18 }}>
            {tasksLoading && <p>Loading...</p>}
            {!tasksLoading && tasks.length === 0 && (
              <p style={{ opacity: 0.6 }}>No tasks</p>
            )}

            {tasks.map(task => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  marginBottom: 10,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.08)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.16)";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <span
                  onClick={() => handleToggleTaskStatus(task.id)}
                  style={{
                    flex: 1,
                    cursor: "pointer",
                    textDecoration:
                      task.status === "done"
                        ? "line-through"
                        : "none",
                    opacity: task.status === "done" ? 0.6 : 1
                  }}
                >
                  {task.status === "done" ? "✅" : "⏳"} {task.title}
                </span>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={e => (e.currentTarget.style.opacity = 0)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedDesk(null)}
            style={{
              marginTop: 12,
              width: "100%",
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
