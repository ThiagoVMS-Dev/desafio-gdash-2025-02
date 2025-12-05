import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard(){
  const [data, setData] = useState([])
  useEffect(()=>{ load() },[])
  async function load(){
    try{
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/weather?page=1&limit=50`)
      setData(res.data.data || res.data)
    }catch(err){
      console.error(err)
    }
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>Weather Dashboard</h1>
      <table border="1" cellPadding="6">
        <thead><tr><th>Timestamp</th><th>Temp (C)</th><th>Source</th></tr></thead>
        <tbody>
          {data.map(r=>(
            <tr key={r._id}>
              <td>{new Date(r.timestamp).toLocaleString()}</td>
              <td>{r.tempC ?? (r.payload && r.payload.current_weather && r.payload.current_weather.temperature)}</td>
              <td>{r.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
