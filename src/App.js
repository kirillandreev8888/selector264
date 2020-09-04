import React from 'react';
import './App.scss';
import { Helmet } from "react-helmet"
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav } from "react-bootstrap"
//components


function App() {
	const titles = ["애니메이션", "アニメ", "はさぎ", "하사기"];
	function randomInteger(min, max) {
		let rand = min - 0.5 + Math.random() * (max - min + 1);
		return Math.round(rand);
	}

	return (
		<div className="App">
			<Helmet>
				<title>{titles[randomInteger(0,titles.length)]}</title>
			</Helmet>
		</div>
	);
}

export default App;
