import { useState, useEffect } from 'react'
import Backend from '../services/Backend'

const ProdutosView = () => {
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
      <h1>Produtos</h1>
      <hr />
      <span className="erroMsg">{errorMsg}</span> 

      <div className="form form-add">
        <div>
          <label className="inputLabel">Nome: </label>
          <input className="input" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        </div>
        <div>
          <label className="inputLabel">Valor: </label>
          <input className="input" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} />
        </div>
        <span className="btn addBtn" onClick={addProduto}>Adicionar</span>
      </div>
      <div className="form form-alteracao">
        <div>
          <label className="inputLabel">ID: </label>
          <input className="input" value={alterID} readOnly={true} />
        </div>
        <div>
          <label className="inputLabel">Nome: </label>
          <input className="input" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        </div>
        <div>
          <label className="inputLabel">Valor: </label>
          <input className="input" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} />
        </div>
        <span className="btn altBtn" onClick={alterarProduto}>Confirmar</span>
      </div>
      <hr />
      {produtos && produtos.length > 0 ?
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => {
              return (
                <tr key={produto.id}>
                  <td>{produto.codigo}</td>
                  <td>{produto.nome}</td>
                  <td className="options">
                    <span className="btn altBtn" onClick={() => ativarAlteracao(produto)}>Alterar</span>
                    <span className="btn delBtn" onClick={() => deletarProduto(produto.id)}>Excluir</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      : null}
    </div>
  )
}

export default ProdutosView;