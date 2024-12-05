import React, { useEffect, useState } from "react";
import fetchTasks from "../../utils/FetchTasks";
import background from "/video/background.mp4";

export const FirstPage = () => {
	const [currentTaskValue, setCurrentTaskValue] = useState("");
  const [taskList, setTaskList] = useState([]); 
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editTaskIndex, setEditTaskIndex] = useState(null);

useEffect(() => {
  fetchTasks(setTaskList);
}, []);

// Handler for changing the value in the input field
  const handleInputChange = (e) => {
    setCurrentTaskValue(e.target.value);
  };

  // Handler for adding or saving a task
  const handleAddOrUpdateTask = () => {
    if (currentTaskValue.trim().length >= 3 && currentTaskValue.trim().length <= 200) {
      if (editTaskIndex !== null) {
        const updatedTaskList = taskList.map((task, index) =>
          index === editTaskIndex ? { ...task, value: currentTaskValue } : task
        );
        setTaskList(updatedTaskList);
        setEditTaskIndex(null);
      } else {
        setTaskList([...taskList, { value: currentTaskValue, completed: false }]);
      }
      setCurrentTaskValue("");
    }
  };

  // Task deletion handler
  const handleDeleteTask = (index) => {
    const updatedTaskList = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTaskList);
  };

 // Task editing handler
  const handleEditTask = (index) => {
    setCurrentTaskValue(taskList[index].value);
    setEditTaskIndex(index);
  };

  // Task execution handler
  const handleTaskCompletion = (index) => {
    const completedTask = taskList[index];
    const updatedTaskList = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTaskList);
    setCompletedTasks([...completedTasks, completedTask]);
  };

  // Checking the validity of the input field
  const isButtonDisabled = currentTaskValue.trim().length < 3 || currentTaskValue.trim().length > 200;

  return (
    <div className="container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src={background} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="card">
        <h1 className="header">To-Do List</h1>
        <input
          className="input-task"
          type="text"
          value={currentTaskValue}
          onChange={handleInputChange}
          placeholder="Введите задачу"
        />
        <button
          className="add-btn"
          onClick={handleAddOrUpdateTask}
          disabled={isButtonDisabled}
        >
          {editTaskIndex !== null ? "Сохранить" : "Добавить"}
        </button>

        <ul className="task-list">
          {taskList.map((task, index) => (
            <li className="task-item" key={index}>
              <input
                id={`task-checkbox-${index}`}
                name="task"
                className="checkbox"
                type="checkbox"
                onChange={() => handleTaskCompletion(index)}
              />
              <span className="task-text">{task.value}</span>
              <button
                className="edit-btn"
                onClick={() => handleEditTask(index)}
                disabled={currentTaskValue !== ""}
                title={currentTaskValue !== "" ? "Очистите поле ввода" : ""}
              >
                Редактировать
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(index)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>

        {/* List of completed tasks */}
        {completedTasks.length > 0 && (
          <>
            <h2>Готово</h2>
            <ul className="completed-task-list">
              {completedTasks.map((task, index) => (
                <li className="task-item" key={index}>
                  <span className="completed-task-text">{task.value}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}