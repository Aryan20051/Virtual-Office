export default function TaskPanel({
  selectedDesk,
  tasks,
  newTaskTitle,
  setNewTaskTitle,
  handleCreateTask,
  handleToggleTaskStatus,
  handleDeleteTask,
  closePanel,
  showPanel
}) {
  if (!selectedDesk) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        right: showPanel ? 24 : -340,
        opacity: showPanel ? 1 : 0,
        width: 300,
        padding: 18,
        borderRadius: 16,
        background: "rgba(17,17,17,0.6)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        color: "#fff",
        transition: "all 0.25s ease"
      }}
    >
      <h3>{selectedDesk.owner}</h3>

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
          background: "#22c55e",
          fontWeight: 600
        }}
      >
        Add Task
      </button>

      <div style={{ marginTop: 16 }}>
        {tasks.map(task => (
          <div
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              marginBottom: 8,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)"
            }}
          >
            <span
              onClick={() => handleToggleTaskStatus(task.id)}
              style={{
                cursor: "pointer",
                textDecoration:
                  task.status === "done" ? "line-through" : "none"
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
                cursor: "pointer"
              }}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={closePanel}
        style={{
          marginTop: 10,
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
  );
}
