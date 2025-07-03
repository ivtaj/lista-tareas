import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [prioridad, setPrioridad] = useState('baja');
  const [filtroActivo, setFiltroActivo] = useState('todas');
  const [error, setError] = useState('');
  const [temaOscuro, setTemaOscuro] = useState(false);

  const alternarTema = () => {
    setTemaOscuro(!temaOscuro);
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  useEffect(() => {
    document.body.style.background = temaOscuro ? '#000000' : '#ffffff';
    document.body.style.color = temaOscuro ? '#ffffff' : '#000000';
  }, [temaOscuro]);

  const cargarTareas = async (priority = null) => {
    try {
      const url = priority ? `${API_URL}/tasks?priority=${priority}` : `${API_URL}/tasks`;
      const response = await fetch(url);
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const filtrarTareas = (filtro) => {
    setFiltroActivo(filtro);
    if (filtro === 'todas') {
      cargarTareas();
    } else {
      cargarTareas(filtro);
    }
  };

  const agregarTarea = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: titulo, priority: prioridad }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }
      
      const nuevaTarea = await response.json();
      if (filtroActivo === 'todas' || filtroActivo === nuevaTarea.priority) {
        setTareas([...tareas, nuevaTarea]);
      }
      setTitulo('');
      setPrioridad('baja');
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      setTareas(tareas.filter(tarea => tarea.id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  return (
    <div className={`app ${temaOscuro ? 'tema-oscuro' : ''}`}>
      <div className="header">
        <h1>Lista de Tareas</h1>
        <button onClick={alternarTema} className="tema-btn">
          {temaOscuro ? '☀️' : '🌙'}
        </button>
      </div>
      
      <form onSubmit={agregarTarea} className="form">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="input"
        />
        
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          className="select"
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        
        <button type="submit" className="button">
          Agregar tarea
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}

      <div className="filtros">
        <button 
          onClick={() => filtrarTareas('todas')}
          className={`filtro-btn ${filtroActivo === 'todas' ? 'activo' : ''}`}
        >
          Todas
        </button>
        <button 
          onClick={() => filtrarTareas('alta')}
          className={`filtro-btn ${filtroActivo === 'alta' ? 'activo' : ''}`}
        >
          Alta
        </button>
        <button 
          onClick={() => filtrarTareas('media')}
          className={`filtro-btn ${filtroActivo === 'media' ? 'activo' : ''}`}
        >
          Media
        </button>
        <button 
          onClick={() => filtrarTareas('baja')}
          className={`filtro-btn ${filtroActivo === 'baja' ? 'activo' : ''}`}
        >
          Baja
        </button>
      </div>

      <ul className="lista">
        {tareas.map((tarea) => (
          <li key={tarea.id} className={`tarea prioridad-${tarea.priority}`}>
            <span className="titulo">{tarea.title}</span>
            <span className="prioridad">{tarea.priority}</span>
            <button 
              onClick={() => eliminarTarea(tarea.id)}
              className="delete-btn"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;