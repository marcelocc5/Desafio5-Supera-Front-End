import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [inicio, setinicio] = useState("");
  const [termino, settermino] = useState("");
  const [nomeOperador, setnomeOperador] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [saldoPeriodo, setSaldoPeriodo] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8080/transferencias/");
      const data = await response.json();
      setTransactions(data);
    };
    fetchData();
  }, []);

  const searchTransactions = async (inicio, termino, nomeOperador) => {
    const newinicio = encodeURIComponent(inicio + " 00:00:00+05");
    const newtermino = encodeURIComponent(termino + " 00:00:00+05");
    const newnomeOperador = nomeOperador;
    let response;
    console.log(nomeOperador);
    console.log(inicio, "  ", termino);

    if (
      (inicio.length === 0 || termino.length === 0) &&
      nomeOperador.length === 0
    ) {
      response = await fetch("http://localhost:8080/transferencias/");
    } else if (
      (inicio.length === 0 || termino.length === 0) &&
      nomeOperador.length >= 1
    ) {
      response = await fetch(
        `http://localhost:8080/transferencias/nome/${newnomeOperador}`
      );
    } else {
      response = await fetch(
        `http://localhost:8080/transferencias/findByPeriod?dataIni=${newinicio}&dataFim=${newtermino}`
      );
    }

    const data = await response.json();
    setTransactions(data);

    let saldo = 0;
    data.forEach((transaction) => {
      saldo += transaction.valor;
    });
    setSaldoPeriodo(saldo);
    setSaldoTotal(saldo);
  };

  return (
    <div className="container">
      <div className="data-inicio">
        <label htmlFor="inicio">Data início:</label>
        <input
          type="date"
          id="inicio"
          value={inicio}
          onChange={(e) => setinicio(e.target.value)}
        />
      </div>
      <div className="data-fim">
        <label htmlFor="termino">Data fim:</label>
        <input
          type="date"
          id="termino"
          value={termino}
          onChange={(e) => settermino(e.target.value)}
        />
      </div>
      <div className="nome-operador">
        <label htmlFor="nomeOperador">Nome do operador:</label>
        <input
          type="text"
          id="nomeOperador"
          value={nomeOperador}
          onChange={(e) => setnomeOperador(e.target.value)}
        />
      </div>

      <div className="form-pesquisar">
        <br />

        <button
          onClick={() => searchTransactions(inicio, termino, nomeOperador)}
        >
          Pesquisar
        </button>
      </div>
      <br />
      <table>
        <thead>
          <tr className="saldo">
            <th className="saldo-total">
              <label>
                <b>Saldo total:</b>
              </label>
              <span>{"R$ " + saldoTotal.toFixed(2)}</span>
            </th>
            <th className="saldo-periodo">
              <label>
                <b>Saldo no período:</b>
              </label>
              <span>{"R$ " + saldoPeriodo.toFixed(2)}</span>
            </th>
          </tr>
          <tr>
            <th>Data</th>
            <th>Valor</th>
            <th>Tipo de Transferência</th>
            <th>Nome do Operador</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td>{item.dataTransferencia.substring(0, 10)}</td>
              <td>{"R$ " + item.valor}</td>
              <td>{item.tipo}</td>
              <td>{item.nomeOperadorTransacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
