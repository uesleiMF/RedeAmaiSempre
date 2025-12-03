import React from 'react';
import { Link } from 'react-router-dom';

const Card = (props) => {
  
  const produto = props.data;
  return (
    <Link to={`/view/${produto._id}`} className="col">
      <div className="card">
        <img src={produto.capa} alt={produto.titulo} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{produto.titulo}</h5>
          <span className="badge bg-primary">{produto.tipo}</span>
        </div>
      </div>
    </Link>
  )
}

export default Card
