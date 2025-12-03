import React from 'react';
import { Link } from 'react-router-dom';

const Cardu = (props) => {
  
  const user = props.data;
  return (
    <Link to={`/vieww/${user._id}`} className="col">
      <div className="card">
        <img src={user.capa} alt={user.name} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <span className="badge bg-primary">{user.tipo}</span>
        </div>
      </div>
    </Link>
  )
}

export default Cardu
