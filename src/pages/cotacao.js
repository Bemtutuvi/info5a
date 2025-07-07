import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { useState } from "react";

export default function Home() {
  const { data, error, isLoading } = useSWR(
    "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL?token=927c456f9a4bec44887e5cc0e2d154c8f843f33855ec2ec0d15db596ee7d19cd",
    fetcher,
    { refreshInterval: 5000 } // Atualiza a cada 60s //1000 == 1 segundo refresh page
  );

  if (error) return <div>Erro ao carregar dados.</div>;
  if (isLoading || !data) return <div>Carregando...</div>;

  const usdbrl = data.USDBRL;

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dadosCotacao, setDadosCotacao] = useState();

  async function buscarCotacaoPorData() {
    try {
      if (!startDate || !endDate) {
        throw new Error("Selecione uma data de início e de fim");
      }
      // https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=20240101&end_date=20241231

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
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Cotação Dólar Hoje (USD/BRL)</h1>
      <p>
        <strong>Compra:</strong> R$ {usdbrl.bid}
      </p>
      <p>
        <strong>Venda:</strong> R$ {usdbrl.ask}
      </p>
      <p>
        <strong>Alta:</strong> R$ {usdbrl.high}
      </p>
      <p>
        <strong>Baixa:</strong> R$ {usdbrl.low}
      </p>
      <p>
        <strong>Variação:</strong> {usdbrl.varBid} ({usdbrl.pctChange}%)
      </p>
      <small>
        Atualizado: {new Date(Number(usdbrl.timestamp) * 1000).toLocaleString()}
      </small>

      <div style={{ marginTop: 20 }}>
        <h1>Buscar Cotação USD/BRL</h1>
        <label htmlFor="date-start">Data Início:</label>
        <input
          className="scheme-dark"
          id="date-start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <br />
        <label htmlFor="date-end">Data Fim:</label>
        <input
          className="scheme-dark"
          id="date-end"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <br />
        <button onClick={buscarCotacaoPorData}>Buscar</button>

        <div className="grid grid-cols-3 gap-3 py-2">
          {dadosCotacao &&
            dadosCotacao.map((dado) => {
              return (
                <div className="border-2 border-white rounded-lg">
                  <p>
                    <strong>Compra:</strong> R$ {dado.bid}
                  </p>
                  <p>
                    <strong>Venda:</strong> R$ {dado.ask}
                  </p>
                  <p>
                    <strong>Alta:</strong> R$ {dado.high}
                  </p>
                  <p>
                    <strong>Baixa:</strong> R$ {dado.low}
                  </p>
                  <p>
                    <strong>Variação:</strong> {dado.varBid} ({dado.pctChange}%)
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
///fazer
