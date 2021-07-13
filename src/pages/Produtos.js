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

const ProdutosView = () => {
  const classes = useStyles()
  const [alterID, setAlterID] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [produtos, setProdutos] = useState([])
  const [novoNome, setNovoNome] = useState('')
  const [novoValor, setNovoValor] = useState('')

  const getProdutos = async () => {
    await Backend.get('/produto/list')
    .then(res => { 
      setErrorMsg('')
      setProdutos(res.data)
    })
    .catch(() => { setErrorMsg('Erro ao carregar lista de produtos.') })
  }

  const addProduto = async () => {
    await Backend.post('/produto/create', {
      valor : novoValor,
      nome  : novoNome
    }).then(() => {
      setErrorMsg('')
      setNovoNome('')
      setNovoValor('')
      getProdutos()
    }).catch(() => {
      setErrorMsg('Erro ao adicionar produto.')
    })
  }

  const deletarProduto = async (id) => {
    await Backend.delete(`/produto/delete/${id}`)
    .then(() => {
      setErrorMsg('')
      getProdutos()
    }).catch(() => {
      setErrorMsg('Erro ao deletar produto.')
    })
  }

  const alterarProduto = async () => {
    await Backend.put(`/produto/update/${alterID}`, {
      valor : novoValor,
      nome  : novoNome
    }).then(() => {
      setAlterID(0)
      setErrorMsg('')
      setNovoNome('')
      setNovoValor('')
      getProdutos()
    }).catch(() => {
      setErrorMsg('Erro ao atualizar produto.')
    })

    document.getElementsByClassName('form-alteracao')[0].style.display = 'none'
    document.getElementsByClassName('form-add')[0].style.display = 'flex'
  }

  const ativarAlteracao = (params) => {
    document.getElementsByClassName('form-alteracao')[0].style.display = 'flex'
    document.getElementsByClassName('form-add')[0].style.display = 'none'

    setAlterID(params.id)
    setNovoValor(params.valor)
    setNovoNome(params.nome)
  }

  useEffect(() => { 
    document.getElementsByClassName('form-alteracao')[0].style.display = 'none'
    getProdutos()
  }, [])

  return (
    <div className="container">
      <h1>Clientes</h1>
      <hr />
      <span className="erroMsg">{errorMsg}</span> 

      <div className="form form-add">
        <TextField label="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        <TextField label="Valor" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} />
        <Button variant="outlined" color="primary" onClick={addProduto}>Adicionar</Button>
      </div>

      <div className="form form-alteracao">
        <TextField label="ID" value={alterID} disabled={true} />
        <TextField label="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        <TextField label="Valor" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} />
        <Button variant="outlined" color="primary" onClick={alterarProduto}>Confirmar</Button>
      </div>
      <hr />

      {produtos && produtos.length > 0 ?
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtos.map(produto => {
                return (
                  <TableRow  key={produto.id}>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>R$ {produto.valor}</TableCell>
                    <TableCell style={{ display: 'flex', gap: '12px'}}>
                      <Button variant="outlined" color="primary" onClick={() => ativarAlteracao(produto)}>Alterar</Button>
                      <Button variant="outlined" color="secondary" onClick={() => deletarProduto(produto.id)}>Excluir</Button>
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

export default ProdutosView;