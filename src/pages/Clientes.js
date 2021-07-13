import { useState, useEffect } from 'react'
import Backend from '../services/Backend'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({ table: { minWidth: 650 }})

const ClientesView = () => {
  const classes = useStyles()
  const [alterID, setAlterID] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [clientes, setClientes] = useState([])
  const [novoNome, setNovoNome] = useState('')
  const [novoCodigo, setNovoCodigo] = useState('')

  const getClientes = async () => {
    await Backend.get('/cliente/list')
    .then(res => { 
      setErrorMsg('')
      setClientes(res.data)
    })
    .catch(() => { setErrorMsg('Erro ao carregar lista de clientes.') })
  }

  const addCliente = async () => {
    await Backend.post('/cliente/create', {
      codigo : novoCodigo,
      nome   : novoNome
    }).then(() => {
      setErrorMsg('')
      setNovoNome('')
      setNovoCodigo('')
      getClientes()
    }).catch(() => {
      setErrorMsg('Erro ao adicionar cliente.')
    })
  }

  const deletarCliente = async (id) => {
    await Backend.delete(`/cliente/delete/${id}`)
    .then(() => {
      setErrorMsg('')
      getClientes()
    }).catch(() => {
      setErrorMsg('Erro ao deletar cliente.')
    })
  }

  const alterarCliente = async () => {
    await Backend.put(`/cliente/update/${alterID}`, {
      codigo : novoCodigo,
      nome   : novoNome
    }).then(() => {
      setAlterID(0)
      setErrorMsg('')
      setNovoNome('')
      setNovoCodigo('')
      getClientes()
    }).catch(() => {
      setErrorMsg('Erro ao atualizar cliente.')
    })

    document.getElementsByClassName('form-alteracao')[0].style.display = 'none'
    document.getElementsByClassName('form-add')[0].style.display = 'flex'
  }

  const ativarAlteracao = (params) => {
    document.getElementsByClassName('form-alteracao')[0].style.display = 'flex'
    document.getElementsByClassName('form-add')[0].style.display = 'none'

    setAlterID(params.id)
    setNovoCodigo(params.codigo)
    setNovoNome(params.nome)
  }

  useEffect(() => { 
    document.getElementsByClassName('form-alteracao')[0].style.display = 'none'
    getClientes()
  }, [])

  return (
    <div className="container">
      <h1>Clientes</h1>
      <hr />
      <span className="erroMsg">{errorMsg}</span> 

      <div className="form form-add">
        <TextField label="Código" value={novoCodigo} onChange={(e) => setNovoCodigo(e.target.value)} />
        <TextField label="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        <Button variant="outlined" color="primary" onClick={addCliente}>Adicionar</Button>
      </div>

      <div className="form form-alteracao">
        <TextField label="ID" value={alterID} disabled={true} />
        <TextField label="Código" value={novoCodigo} onChange={(e) => setNovoCodigo(e.target.value)} />
        <TextField label="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        <Button variant="outlined" color="primary" onClick={alterarCliente}>Confirmar</Button>
      </div>
      <hr />

      {clientes && clientes.length > 0 ?
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map(cliente => {
                return (
                  <TableRow  key={cliente.id}>
                    <TableCell>{cliente.codigo}</TableCell>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell style={{ display: 'flex', gap: '12px'}}>
                      <Button variant="outlined" color="primary" onClick={() => ativarAlteracao(cliente)}>Alterar</Button>
                      <Button variant="outlined" color="secondary" onClick={() => deletarCliente(cliente.id)}>Excluir</Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      : null}
    </div>
  )
}

export default ClientesView;