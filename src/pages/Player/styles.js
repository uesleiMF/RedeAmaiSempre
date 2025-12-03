import styled from "styled-components";

export const Container = styled.div`
  background-color: #A020F0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10rem;
  min-width: 768px;
  max-width: 1024px;

  h2 {
    text-align: center;
    padding: 0 0 2rem 0;
    font-weight: 500;
    color: white;
  }
  
  `
  export const Card = styled.div`
 
    x {
    width: 55%;
    border-radius: 20%;
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
`
export const Logo = styled.a`

h6 {
  font-size: 18px;
  color: black;
 
  justify-content: center;
align-items: center;
 
}

img {
    width: 9rem;
    margin: 0 0.9rem;
    border-radius: 25%;
    margin-top: auto;
    align-items: center;
    

  }
`;
export const Social = styled.div`
  a {
    font-size: 2.9rem;
    color: #A020F0;
    text-decoration: none;
    justify-content: center;
  align-items: center;
   
  }
  s {
    font-size: 2.5rem;
    color: #00ff00;
    text-decoration: none;
  }

 
  b {
   
    font-size: 3.5rem;
    color: #A020F0;
    text-decoration: none;
    justify-content: center;
  align-items: center;
   
  }
  c {
    font-size: 6.5rem;
    color: #A020F0;
    text-decoration: none;
    justify-content: center;
  align-items: center;
    
  }
`;
export const CadContainer = styled.div`
  padding: 4rem 4rem 1rem 4rem;
  background-color: #9370DB;
  border-radius:100px;
  min-width: 768px;
  max-width: 1024px;
  
  form {
    display: flex;
    flex-direction: column;

    & > input {
      font-size: 1.2rem;
      width: 25rem;
      height: 2.5rem;
      padding: 0.4rem 0.6rem;
      margin: 0.4rem 0;
    }
  }
`

export const LostPass = styled.div`
  display: flex;
  justify-content: space-between;

  a {
    font-size: 0.8rem;
    text-decoration: none;
    color: #3a6cdf;

    &:hover {
      text-decoration: underline;
    }
  }

  & > input {
    background-color: #b1b1b1;
    border: none;
    padding: 0.6rem 1.5rem;
    border-radius: 1rem;
    color: #fff;
    cursor: pointer;
  }
`

export const Create = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;

  & > span {
    padding: 0.5rem;
  }

  a {
    padding: 0.6rem;
    border-radius: 1rem;
    color: #000;
    border: 1px solid #000;
    cursor: pointer;
    text-decoration: none;
    font-size: 0.8rem;

    &:hover {
      background-color: #b1b1b1;
      transition: all 200ms ease;
    }
  }




  
`