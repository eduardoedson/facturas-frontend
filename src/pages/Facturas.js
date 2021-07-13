import { useState, useEffect } from 'react'
import Backend from '../services/Backend'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

const useStyles = makeStyles((theme) => ({ 
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
    borderRadius: 12,
  },
  listSection: { backgroundColor: 'inherit' },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  },
  table: { minWidth: 650 },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: { marginTop: theme.spacing(2) },
}))

const FacturasView = () => {
  const classes = useStyles()
  const [errorMsg, setErrorMsg] = useState('')
  const [cliente, setCliente] = useState(null)
  const [clientes, setClientes] = useState([])
  const [produtosSelecionados, setProdutosSelecionados] = useState([])
  const [produto, setProduto] = useState(null)
  const [produtos, setProdutos] = useState([])
  const [total, setTotal] = useState(0)
  const [facturas, setFacturas] = useState([])

  const getFacturas = async () => {
    await Backend.get('/factura/list')
    .then(res => { 
      setErrorMsg('')
      setFacturas(res.data)
    })
    .catch(() => { setErrorMsg('Erro ao carregar lista de facturas.') })
  }

  const getProdutos = async () => {
    await Backend.get('/produto/list')
    .then(res => { 
      setErrorMsg('')
      setProdutos(res.data)
    })
    .catch(() => { setErrorMsg('Erro ao carregar lista de produtos.') })
  }

  const getClientes = async () => {
    await Backend.get('/cliente/list')
    .then(res => { 
      setErrorMsg('')
      setClientes(res.data)
    })
    .catch(() => { setErrorMsg('Erro ao carregar lista de clientes.') })
  }

  const adicionarProduto = async () => {
    setTotal(total + produto.valor)
    setProdutosSelecionados([...produtosSelecionados, produto])
    console.log(produtosSelecionados)
  }

  const addFactura = async () => {
    await Backend.post('/factura/create', {
      id_cliente: cliente,
      produtos: String(produtosSelecionados.map(produtos => produtos.id)),
      valor_total : total
    }).then(res => setFacturas(res.data))
    setProdutosSelecionados([])
    setTotal(0)
  }

  useEffect(() => {
    getProdutos()
    getClientes()
    getFacturas()
  }, [])
  
  return (
    <div className="container">
      <h1>Facturas</h1>
      <hr />
      <span className="erroMsg">{errorMsg}</span> 

      <div className="form">
        <FormControl className={classes.formControl}>
          <InputLabel>Cliente</InputLabel>
          <Select value={cliente} onChange={(e) => setCliente(e.target.value)}>
            {clientes.map(cliente => { return (<MenuItem key={cliente.id} value={cliente.id}>{cliente.nome}</MenuItem>)})}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel>Produto</InputLabel>
          <Select value={produto} onChange={(e) => setProduto(e.target.value)}>
            {produtos.map(produto => { return (<MenuItem key={produto.id} value={produto}>{produto.nome}</MenuItem>)})}
          </Select>
        </FormControl>

        <Button variant="outlined" color="primary" onClick={adicionarProduto}>Adicionar Produto</Button>
      </div>
      <hr />

      <div>
        <List className={classes.root} subheader={<li />}>
        <ListSubheader>Total Factura - R$ {total}</ListSubheader>
          {produtosSelecionados.map(produto => { 
            return (
              <ListItem key={produto.id}>
                <ListItemText primary={`${produto.nome} - R$ ${produto.valor}`} />
              </ListItem>
            )})}
        </List>
      </div>< br/>
      <Button variant="outlined" color="primary" onClick={addFactura}>Finalizar Factura</Button>
      <hr />

      {facturas && facturas.length > 0 ?
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturas.map(factura => {
                return (
                  <TableRow key={factura.id}>
                    <TableCell>{factura.id}</TableCell>
                    <TableCell>{factura.nome}</TableCell>
                    <TableCell>R$ {factura.valor_total}</TableCell>
                    <TableCell>{factura.created_at.split('T')[0].split('-').reverse().join('/')}</TableCell>
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

export default FacturasView