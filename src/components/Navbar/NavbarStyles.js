import styled from "styled-components";

export const Container = styled.nav`
  width: 100%;
  height: 80px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  top: 0;
  z-index: 999;
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.3s;
  }

  img:hover {
    transform: scale(1.05);
  }
`;

export const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 25px;
  height: 20px;
  cursor: pointer;
  z-index: 1000;

  span {
    display: block;
    height: 3px;
    width: 100%;
    background: #fff;
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: 1px;
  }

  /* Transformação em X quando aberto */
  &.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  &.open span:nth-child(2) {
    opacity: 0;
  }
  &.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const OverlayMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(26, 26, 26, 0.95);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-100%)")};
    transition: transform 0.3s ease-in-out;
    z-index: 998;
  }
`;

export const List = styled.ul`
  display: flex;
  list-style: none;
  gap: 20px;
  align-items: center;

  li {
    a {
      color: #fff;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.3s;

      &:hover {
        color: #ffcc00;
      }
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
