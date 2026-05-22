import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
ChartJS.defaults.elements.point.radius      = 0
ChartJS.defaults.elements.point.hoverRadius = 3

function SingleChart({ label, data, labels, borderColor, yLabel }) {
  const chartData = useMemo(() => ({
    labels,
    datasets: [{
      label,
      data,
      borderColor,
      backgroundColor: "transparent",
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 3,
      borderWidth: 2,
    }]
  }), [label, data, labels, borderColor])

  const options = {
    responsive: true,
    animation: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { maxTicksLimit: 8, color: "#aaa" },
        title: { display: true, text: "θ (rad)", color: "#aaa" }
      },
      y: {
        title: { display: true, text: yLabel, color: borderColor },
        ticks: { color: "#aaa" },
      }
    }
  }

  return (
    <div style={{ marginBottom: "12px" }}>
      <p style={{ margin: "0 0 4px 0", color: borderColor, fontWeight: "bold", fontSize: "0.85rem" }}>
        {label}
      </p>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default function Graph3Panel({ history }) {
  const labels   = useMemo(() => history.map(h => h.t.toFixed(2)), [history])
  const xData    = useMemo(() => history.map(h => h.x),        [history])
  const vData    = useMemo(() => history.map(h => h.v),        [history])
  const aData    = useMemo(() => history.map(h => h.a),        [history])
  const omegaData= useMemo(() => history.map(h => h.omegaRod), [history])

  return (
    <div className="panel">
      <h2>Graphs</h2>
      <SingleChart label="Position x(t)"        data={xData}     labels={labels} borderColor="#4bc0c0" yLabel="x (m)"       />
      <SingleChart label="Velocity vC(t)"        data={vData}     labels={labels} borderColor="#ff6384" yLabel="v (m/s)"     />
      <SingleChart label="Acceleration aC(t)"    data={aData}     labels={labels} borderColor="#ffcd56" yLabel="a (m/s²)"    />
      <SingleChart label="Angular Vel ωrod(t)"   data={omegaData} labels={labels} borderColor="#c084fc" yLabel="ω (rad/s)"   />
    </div>
  )
}
