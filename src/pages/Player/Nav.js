import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";

const Nav = ({ libraryStatus, setLibraryStatus }) => {
	return (
		
		
		
		<NavContainer>
			
			<Button onClick={() => setLibraryStatus(!libraryStatus)}>
			Procurar
				<FontAwesomeIcon icon={faMusic} />
			</Button>
			<Button1 onClick={() => setLibraryStatus(!libraryStatus)}>
			Voltar
				
			</Button1>
		</NavContainer>
	
	);
};

const NavContainer = styled.div`
	min-height: 10vh;
	display: flex;
	justify-content: space-around;
	align-items: center;
	@media screen and (max-width: 350px) {
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
	}
`;

const H1 = styled.h1`
	transition: all 0.5s ease;

	@media screen and (max-width: 768px) {
		visibility: ${(p) => (p.libraryStatus ? "hidden" : "visible")};
		opacity: ${(p) => (p.libraryStatus ? "0" : "100")};
		transition: all 0.5s ease;
	}
`;

const Button = styled.button`
	background: transparent;
	border: none;
	border-radius: 30%;
	cursor: pointer;
	box-shadow: 0 6px 5px rgb(130, 23, 192);
	border: 2px solid rgb(65, 65, 65);
	padding: 0.2rem;
	transition: all 0.3s ease;
	&:hover {
		background: rgb(65, 65, 65);
		color: white;
	}
`;
const Button1 = styled.button`
	background: transparent;
	border: none;
	border-radius: 30%;
	box-shadow: 0 6px 5px rgb(130, 23, 192);
	cursor: pointer;
	border: 2px solid rgb(65, 65, 65);
	padding: 0.2rem;
	transition: all 0.3s ease;
	&:hover {
		background: rgb(65, 65, 65);
		color: white;
	}
`;


export default Nav;
