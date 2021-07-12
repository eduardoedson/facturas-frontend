import { useState, useEffect } from 'react'
import Backend from '../services/Backend'

const ClientesView = () => {
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
        <div>
          <label className="inputLabel">Código: </label>
          <input className="input" value={novoCodigo} onChange={(e) => setNovoCodigo(e.target.value)} />
        </div>
        <div>
          <label className="inputLabel">Nome: </label>
          <input className="input" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        </div>
        <span className="btn addBtn" onClick={addCliente}>Adicionar</span>
      </div>
      <div className="form form-alteracao">
        <div>
          <label className="inputLabel">ID: </label>
          <input className="input" value={alterID} readOnly={true} />
        </div>
        <div>
          <label className="inputLabel">Código: </label>
          <input className="input" value={novoCodigo} onChange={(e) => setNovoCodigo(e.target.value)} />
        </div>
        <div>
          <label className="inputLabel">Nome: </label>
          <input className="input" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
        </div>
        <span className="btn altBtn" onClick={alterarCliente}>Confirmar</span>
      </div>
      <hr />
      {clientes && clientes.length > 0 ?
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => {
              return (
                <tr key={cliente.id}>
                  <td>{cliente.codigo}</td>
                  <td>{cliente.nome}</td>
                  <td className="options">
                    <span className="btn altBtn" onClick={() => ativarAlteracao(cliente)}>Alterar</span>
                    <span className="btn delBtn" onClick={() => deletarCliente(cliente.id)}>Excluir</span>
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

export default ClientesView;