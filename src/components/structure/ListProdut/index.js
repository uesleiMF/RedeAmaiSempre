import React, { useState, useEffect } from 'react'
import Card from '../Card';
import Api from '../../../api/api';
// Ele vai fazer uma requisicao para a API(/musicas) e vai listar em varios card.
const ListProdut = () => {
  // estado - memoria do componente
  const [produtos, setProdutos] = useState([]);
  // const [count, setCount] = useState(0);

  // UseEffect
  // criar o componente ou quando o componete ou o estado tem uma atualizacao.
  useEffect(() => {
    getProdutos();
  }, [])

  // useEffect(() => {
  //   document.title = `voce clicou ${count}`;
  // }, [count])

  const getProdutos = async () => {
    const request = await Api.fetchGetAll();
    // data = recebe os dados da api (musicas).
    const data = await request.json();
    // atualizo meu estado em memoria com as musicas - para atualizar no DOM.
    setProdutos(data);
  }

  // const handleButton = () => {
  //   setCount(count + 1);
  // }


  return (
    <div className="row row-cols-1 row-cols-md-3 mt-3 g-4">
      {/* <button onClick={handleButton}>Incrementa</button>
      <p>{count}</p> */}
      {produtos.map((produto) => (
        <Card data={produto} key={produto._id}/>
      ))}
    </div>
  )
}

export default ListProdut
