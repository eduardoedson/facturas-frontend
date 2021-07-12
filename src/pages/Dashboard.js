import { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Backend from '../services/Backend'

const Dashboard = () => {
  const [dados, setDados] = useState(null)

  const getDados = async () => {
    await Backend.get('/dashboard/FacturasPorCliente')
    .then(res => {
      const temp = {
        type: 'column',
        title: { text: 'Facturas por Cliente' },
        series: res.data.map(r => { 
          return ({ name: r.nome,  data: [parseInt(r.count)], type: 'column' }) })
      }
      setDados(temp)
    })
  }

  useEffect(() => {
    getDados()
  }, [])


  return (
    <div className="container">
      <h1>Dashboard</h1>
      <hr />
      {dados ? 
        <HighchartsReact
          highcharts={Highcharts}
          options={dados}
        />
      : <span className="erroMsg">Nada para mostrar.</span>}
    </div>
  );
}

export default Dashboard;
