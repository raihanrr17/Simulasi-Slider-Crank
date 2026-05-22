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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

ChartJS.defaults.elements.point.radius = 0
ChartJS.defaults.elements.point.hoverRadius = 3

export default function Graph3Panel({ history }) {
  const data = useMemo(() => ({
    labels: history.map(h => h.t.toFixed(2)),
    datasets: [
      {
        label: "Position x(t)",
        data: history.map(h => h.x),
        borderColor: "#4bc0c0",
        backgroundColor: "transparent",
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 3,
        borderWidth: 2,
      },
      {
        label: "Velocity v(t)",
        data: history.map(h => h.v),
        borderColor: "#ff6384",
        backgroundColor: "transparent",
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 3,
        borderWidth: 2,
      },
      {
        label: "Acceleration a(t)",
        data: history.map(h => h.a),
        borderColor: "#ffcd56",
        backgroundColor: "transparent",
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 3,
        borderWidth: 2,
        yAxisID: "y2",
      }
    ]
  }), [history])

  const options = {
    responsive: true,
    animation: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#ccc" }
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
          color: "#aaa",
        },
        title: { display: true, text: "Time (s)", color: "#aaa" }
      },
      y: {
        type: "linear",
        position: "left",
        title: { display: true, text: "x  /  v", color: "#aaa" },
        ticks: { color: "#aaa" },
      },
      y2: {
        type: "linear",
        position: "right",
        title: { display: true, text: "a", color: "#ffcd56" },
        ticks: { color: "#ffcd56" },
        grid: { drawOnChartArea: false },
      }
    }
  }

  return (
    <div className="panel">
      <h2>Graphs (x, v, a)</h2>
      <Line key="sliderGraph" data={data} options={options} />
    </div>
  )
}
