import React from "react";
import styled from "styled-components";

const Song = ({ currentSong }) => {
	return (
		<div className="container">
		<div className="card mt-2 bg-warning bg-opacity-50">
		<SongContainer>
			<Img src={currentSong.cover} alt={currentSong.name}></Img>
			<H1>{currentSong.name}</H1>
			<H2>{currentSong.artist}</H2>
		</SongContainer>
		</div>
		</div>
	);
};

const SongContainer = styled.div`
	margin-top: 5vh;
	min-height: 4vh;
	max-height: 40vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Img = styled.img`
	width: 13%;
	border-radius: 30%;
	@media screen and (max-width: 300px) {
		width: 50%;
	}
`;

const H1 = styled.h2`
	padding: 0.3rem 1rem 0.8rem 0.8rem;
`;

const H2 = styled.h3`
	font-size: 0.8rem;
`;

export default Song;
