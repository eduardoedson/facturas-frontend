import { useState, useEffect } from 'react'
import Backend from '../services/Backend'

const FacturasView = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [clientes, setClientes] = useState([])
  const [produtosSelecionados, setProdutosSelecionados] = useState([])
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

  const getProduto = async (id) => {
    return await Backend.get(`/produto/get/${id}`).then(res => res.data)
  }

  const adicionarProduto = async () => {
    const produto = await getProduto(document.getElementById('list-produtos').value)
    setTotal(total + produto.valor)
    setProdutosSelecionados([...produtosSelecionados, produto])
  }

  const addFactura = async () => {
    await Backend.post('/factura/create', {
      id_cliente: document.getElementById('list-cliente').value,
      produtos: String(produtosSelecionados.map(produtos => produtos.id)),
      valor_total : total
    }).then(res => setFacturas(res.data))
    setProdutosSelecionados([])
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
      <div>
        <div>
          <label className="inputLabel">Cliente: </label>
          <select id="list-cliente">
            {clientes.map(cliente => { return (<option key={cliente.id} value={cliente.id}>{cliente.nome}</option>)})}
          </select>
        </div>

        <div>
          <label className="inputLabel">Produto: </label>
          <select id="list-produtos">
            {produtos.map(produto => { return (<option key={produto.id} value={produto.id}>{produto.nome}</option>)})}
          </select> - <span onClick={adicionarProduto}>Adicionar Produto</span>
        </div>
        <hr />

        <div>
          <label className="inputLabel">Produtos: (Total: R$ {total}) </label>
          <ul>
            {produtosSelecionados.map(produto => { return (<li key={produto.id}>{produto.nome} - R$ {produto.valor}</li>) })}
          </ul>
        </div>
        <span onClick={addFactura}>Finalizar Factura</span>
        <hr />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map(factura => { return (
            <tr>
              <td>{factura.id}</td>
              <td>{factura.nome}</td>
              <td>R$ {factura.valor_total}</td>
              <td>{factura.created_at.split('T')[0]}</td>
            </tr>
          )})}
        </tbody>
      </table>
      
    </div>
  )
}

export default FacturasView