import { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Backend from '../services/Backend'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { useHistory } from 'react-router-dom'

const Dashboard = () => {
  const history = useHistory()
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

      <div className="menu">
        <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
          <Button onClick={() => history.push('/clientes')}>Clientes</Button>
          <Button onClick={() => history.push('/produtos')}>Produtos</Button>
          <Button onClick={() => history.push('/facturas')}>Facturas</Button>
        </ButtonGroup>
      </div>

      {dados ? 
        <div className="grafico-container">
          <HighchartsReact
            className="grafico"
            highcharts={Highcharts}
            options={dados}
          />
        </div>
      : <span className="erroMsg">Nada para mostrar.</span>}
    </div>
  );
}

export default Dashboard;
