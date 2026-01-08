import { useEffect, useRef, useState } from "react";
import Office from "./three/Office";
import { playSound } from "./utils/sound";
import rainSound from "./assets/sounds/rain.mp3";
import clickSound from "./assets/sounds/click.mp3";
import ControlsBar from "./components/ControlsBar";
import TaskPanel from "./components/TaskPanel";

function App() {
  /* 🏢 Core state */
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesk, setSelectedDesk] = useState(null);

  /* 📝 Tasks */
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  /* 🎬 Panel animation */
  const [showPanel, setShowPanel] = useState(false);

  /* 🌗 Day / Night */
  const [isNight, setIsNight] = useState(
    localStorage.getItem("nightMode") === "false" ? false : true
  );

  /* 🌧️ Rain audio */
  const [isRainMuted, setIsRainMuted] = useState(
    localStorage.getItem("rainMuted") === "true"
  );
  const rainAudioRef = useRef(null);

  /* 🌧️ Start rain ambience ONCE */
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

  /* Load tasks when desk selected */
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

  /* 📝 Task handlers */
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

  /* 🎛️ Controls */
  const toggleRain = () => setIsRainMuted(prev => !prev);
  const toggleNight = () => setIsNight(prev => !prev);

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

      <ControlsBar
        isNight={isNight}
        toggleNight={toggleNight}
        isRainMuted={isRainMuted}
        toggleRain={toggleRain}
      />

      <TaskPanel
        selectedDesk={selectedDesk}
        tasks={tasks}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        handleCreateTask={handleCreateTask}
        handleToggleTaskStatus={handleToggleTaskStatus}
        handleDeleteTask={handleDeleteTask}
        closePanel={closePanel}
        showPanel={showPanel}
      />
    </div>
  );
}

export default App;
