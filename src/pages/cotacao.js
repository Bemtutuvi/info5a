import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { useState } from "react";


export default function Home() {
  const { data, error, isLoading } = useSWR(
    "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL?token=927c456f9a4bec44887e5cc0e2d154c8f843f33855ec2ec0d15db596ee7d19cd",
    fetcher,
    { refreshInterval: 5000 }
  );

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dadosCotacao, setDadosCotacao] = useState();

  if (error) return <div className="mensagem erro">Erro ao carregar dados.</div>;
  if (isLoading || !data) return <div className="mensagem carregando">Carregando...</div>;

  const usdbrl = data.USDBRL;

  async function buscarCotacaoPorData() {
    try {
      if (!startDate || !endDate) {
        throw new Error("Selecione uma data de início e de fim");
      }

      const cleanStartDate = startDate.split("-").join("");
      const cleanEndDate = endDate.split("-").join("");
      const url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${cleanStartDate}&end_date=${cleanEndDate}`;

      const dados = await fetcher(url);
      setDadosCotacao(dados);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="container">
      <h1 className="titulo">💰 Cotação Dólar Hoje (USD/BRL)</h1>

      <div className="bloco-cotacao">
        <p><strong>Compra:</strong> R$ {usdbrl.bid}</p>
        <p><strong>Venda:</strong> R$ {usdbrl.ask}</p>
        <p><strong>Alta:</strong> R$ {usdbrl.high}</p>
        <p><strong>Baixa:</strong> R$ {usdbrl.low}</p>
        <p><strong>Variação:</strong> {usdbrl.varBid} ({usdbrl.pctChange}%)</p>
        <small className="atualizado">
          Atualizado: {new Date(Number(usdbrl.timestamp) * 1000).toLocaleString()}
        </small>
      </div>

      <section className="busca">
        <h2 className="subtitulo">📆 Buscar Cotação por Data</h2>
        <div className="formulario">
          <div className="campo">
            <label htmlFor="date-start">Data Início:</label>
            <input
              id="date-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="date-end">Data Fim:</label>
            <input
              id="date-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={buscarCotacaoPorData}>Buscar</button>
        </div>

        <div className="grid-cotacoes">
          {dadosCotacao &&
            dadosCotacao.map((dado) => (
              <div key={dado.timestamp} className="card-cotacao">
                <p><strong>Compra:</strong> R$ {dado.bid}</p>
                <p><strong>Venda:</strong> R$ {dado.ask}</p>
                <p><strong>Alta:</strong> R$ {dado.high}</p>
                <p><strong>Baixa:</strong> R$ {dado.low}</p>
                <p><strong>Variação:</strong> {dado.varBid} ({dado.pctChange}%)</p>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
