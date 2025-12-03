import React, { useState, useEffect } from 'react'
import Cardu from '../Cardu';
import Apii from '../../../api/apii';
// Ele vai fazer uma requisicao para a API(/musicas) e vai listar em varios card.
const Listu = () => {
  // estado - memoria do componente
  const [users, setUsers] = useState([]);
  // const [count, setCount] = useState(0);

  // UseEffect
  // criar o componente ou quando o componete ou o estado tem uma atualizacao.
  useEffect(() => {
    getUsers();
  }, [])

  // useEffect(() => {
  //   document.title = `voce clicou ${count}`;
  // }, [count])

  const getUsers = async () => {
    const request = await Apii.fetchGetAll();
    // data = recebe os dados da api (musicas).
    const data = await request.json();
    // atualizo meu estado em memoria com as musicas - para atualizar no DOM.
    setUsers(data);
  }

  // const handleButton = () => {
  //   setCount(count + 1);
  // }


  return (
    <div className="row row-cols-1 row-cols-md-3 mt-3 g-4">
      {/* <button onClick={handleButton}>Incrementa</button>
      <p>{count}</p> */}
      {users.map((user) => (
        <Cardu data={user} key={user._id}/>
      ))}
    </div>
  )
}

export default Listu
