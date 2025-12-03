import styled from "styled-components";

export const Container = styled.footer`
  width: 100%;
  background: #111;
  color: #fff;
  text-align: center;
  padding: 25px 0;
  margin-top: 40px;
  box-shadow: 0 -3px 10px rgba(0,0,0,0.3);

  span {
    display: block;
    font-size: 14px;
    margin-top: 4px;
    opacity: 0.9;
  }
`;

export const Social = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;

  a {
    color: #fff;
    font-size: 26px;
    transition: 0.3s ease;

    &:hover {
      color: #ffcc00;
      transform: scale(1.1);
    }
  }
`;

/* Ícones adicionais (caso precise no Footer ou Home) */
export const Icon = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;

  a {
    color: #ffcc00;
    font-size: 32px;
    transition: 0.3s ease;

    &:hover {
      color: #fff;
      transform: scale(1.15);
    }
  }
`;
