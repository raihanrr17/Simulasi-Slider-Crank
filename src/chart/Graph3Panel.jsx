import { useMemo, useState } from "react"
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

function SingleChart({ data, labels, borderColor, yLabel }) {
  const chartData = useMemo(() => ({
    labels,
    datasets: [{
      data,
      borderColor,
      backgroundColor: "transparent",
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 3,
      borderWidth: 2,
    }]
  }), [data, labels, borderColor])

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

  return <Line data={chartData} options={options} />
}

function ChartExpander({ label, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", textAlign: "left",
        background: open ? `${color}18` : "rgba(255,255,255,0.04)",
        border: `1px solid ${open ? color : color + "44"}`,
        borderRadius: open ? "6px 6px 0 0" : 6,
        padding: "6px 12px", color,
        fontWeight: "bold", fontSize: "0.85rem",
        cursor: "pointer", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        transition: "all 0.15s",
      }}>
        <span>
          <span style={{
            display: "inline-block", width: 10, height: 10,
            borderRadius: 2, background: color,
            marginRight: 8, verticalAlign: "middle"
          }} />
          {label}
        </span>
        <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{
          border: `1px solid ${color}33`, borderTop: "none",
          borderRadius: "0 0 6px 6px", padding: "10px 10px 6px",
          background: "rgba(0,0,0,0.2)",
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function Graph3Panel({ history }) {
  const labels    = useMemo(() => history.map(h => h.t.toFixed(2)), [history])
  const xData     = useMemo(() => history.map(h => h.x),            [history])
  const vData     = useMemo(() => history.map(h => h.v),            [history])
  const aData     = useMemo(() => history.map(h => h.a),            [history])
  const omegaData = useMemo(() => history.map(h => h.omegaRod),     [history])

  return (
    <div className="panel">
      <h2>Graphs</h2>
      <ChartExpander label="Position x(t)" color="#4bc0c0" defaultOpen>
        <SingleChart data={xData}     labels={labels} borderColor="#4bc0c0" yLabel="x (m)"    />
      </ChartExpander>
      <ChartExpander label="Velocity vC(t)" color="#ff6384" defaultOpen>
        <SingleChart data={vData}     labels={labels} borderColor="#ff6384" yLabel="v (m/s)"  />
      </ChartExpander>
      <ChartExpander label="Acceleration aC(t)" color="#ffcd56" defaultOpen>
        <SingleChart data={aData}     labels={labels} borderColor="#ffcd56" yLabel="a (m/s²)" />
      </ChartExpander>
      <ChartExpander label="Angular Velocity ωrod(t)" color="#c084fc" defaultOpen>
        <SingleChart data={omegaData} labels={labels} borderColor="#c084fc" yLabel="ω (rad/s)"/>
      </ChartExpander>
    </div>
  )
}
