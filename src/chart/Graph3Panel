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

export default function Graph3Panel({ history }) {

  const data = useMemo(() => ({
    labels: history.map(h => h.t.toFixed(2)),
    datasets: [
      {
        label: "Position x(t)",
        data: history.map(h => h.x),
        borderColor: "#4bc0c0",
        tension: 0.1
      },
      {
        label: "Velocity v(t)",
        data: history.map(h => h.v),
        borderColor: "#ff6384",
        tension: 0.1
      },
      {
        label: "Acceleration a(t)",
        data: history.map(h => h.a),
        borderColor: "#ffcd56",
        tension: 0.1
      }
    ]
  }), [history])

  const options = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (s)"
        }
      },
      y: {
        title: {
          display: true,
          text: "Value"
        }
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
