import { useEffect, useRef, useState } from "react";
import Office from "./three/Office";
import { playSound } from "./utils/sound";
import rainSound from "./assets/sounds/rain.mp3";
import clickSound from "./assets/sounds/click.mp3";

function App() {
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesk, setSelectedDesk] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // 🌧️ Rain
  const rainAudioRef = useRef(null);
  const [isRainMuted, setIsRainMuted] = useState(
    localStorage.getItem("rainMuted") === "true"
  );

  // 🌗 Day / Night
  const [isNight, setIsNight] = useState(
    localStorage.getItem("nightMode") !== "false"
  );

  // 🎬 Panel animation
  const [showPanel, setShowPanel] = useState(false);

  /* 🌧️ Start rain ambience */
  useEffect(() => {
    const rain = new Audio(rainSound);
    rain.loop = true;
    rain.volume = 0.12;
    rain.muted = isRainMuted;
    rain.play();
    rainAudioRef.current = rain;

    return () => rain.pause();
  }, []);

  /* Persist rain mute */
  useEffect(() => {
    localStorage.setItem("rainMuted", isRainMuted);
    if (rainAudioRef.current) {
      rainAudioRef.current.muted = isRainMuted;
    }
  }, [isRainMuted]);

  /* Persist night mode */
  useEffect(() => {
    localStorage.setItem("nightMode", isNight);
  }, [isNight]);

  /* Load desks */
  useEffect(() => {
    fetch("http://localhost:5000/api/desks")
      .then(res => res.json())
      .then(data => {
        setDesks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* Load tasks */
  useEffect(() => {
    if (!selectedDesk) return;

    setTasksLoading(true);
    fetch(`http://localhost:5000/api/tasks/${selectedDesk.id}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setTasksLoading(false);
        setShowPanel(true);
      });
  }, [selectedDesk]);

  const reloadTasks = () => {
    fetch(`http://localhost:5000/api/tasks/${selectedDesk.id}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !selectedDesk) return;
    playSound(clickSound, 0.25);

    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deskId: selectedDesk.id,
        title: newTaskTitle
      })
    }).then(() => {
      setNewTaskTitle("");
      reloadTasks();
    });
  };

  const handleDeleteTask = (taskId) => {
    playSound(clickSound, 0.2);
    fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE"
    }).then(() => reloadTasks());
  };

  const handleToggleTaskStatus = (taskId) => {
    playSound(clickSound, 0.2);
    fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "PATCH"
    }).then(() => reloadTasks());
  };

  const toggleRain = () => {
    setIsRainMuted(prev => !prev);
  };

  const closePanel = () => {
    setShowPanel(false);
    setTimeout(() => setSelectedDesk(null), 250);
  };

  if (loading) return <h2>Loading 3D office...</h2>;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Office
        desks={desks}
        setSelectedDesk={setSelectedDesk}
        isNight={isNight}
      />

      {/* 🌧️ Rain Toggle */}
      <button
        onClick={toggleRain}
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          padding: "8px 12px",
          borderRadius: 10,
          border: "none",
          background: "rgba(17,17,17,0.6)",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        {isRainMuted ? "🔇 Rain Muted" : "🌧️ Rain On"}
      </button>

      {/* 🌗 Day / Night */}
      <button
        onClick={() => setIsNight(prev => !prev)}
        style={{
          position: "absolute",
          bottom: 20,
          left: 140,
          padding: "8px 12px",
          borderRadius: 10,
          border: "none",
          background: "rgba(17,17,17,0.6)",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        {isNight ? "🌙 Night" : "🌞 Day"}
      </button>

      {/* 🎬 Animated Panel */}
      {selectedDesk && (
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
      )}
    </div>
  );
}

export default App;
