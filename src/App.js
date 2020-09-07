import React from 'react';
import './App.scss';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Switch, Route, Redirect } from "react-router-dom"
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from "react-bootstrap"
//custom
import logo from "./static/logo.svg"
// import axios from "axios"
// import { parse } from 'node-html-parser';

//components
import List from './components/pages/List';
//firebase
import firebase from "firebase/app"
import "firebase/database"
import { FirebaseDatabaseProvider } from "@react-firebase/database"
import { config } from "./config"
import CreateTitle from './components/pages/CreateTitle';
import EditTitle from './components/pages/EditTitle';


function App() {

	// useEffect(() => {
	// 	const url = "https://shikimori.one/animes/z21-one-piece";
	// 	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	// 	fetch(proxyurl + url)
	// 	.then(response => response.text())
	// 	.then(contents => console.log(contents))
	// }, [])
	// const [image, setImage] = useState("");

	// axios.get("https://cors-anywhere.herokuapp.com/https://shikimori.one/animes/z21-one-piece", { headers: { 'X-Requested-With': 'XMLHttpRequest' } }).then(
	// 	res => {
	// 		const root = parse(res.data);
	// 		setImage( root.querySelector('.c-poster center img').getAttribute("src"))
	// 	}
	// )

	return (

		<HelmetProvider>
			<div className="App">
				<Helmet>
					<meta charSet="utf-8" />
					<title>하사기</title>
				</Helmet>
				<Navbar bg="dark" variant="dark">
					<Navbar.Brand><img id="logo" src={logo} alt="Logo" /></Navbar.Brand>
					<Nav className="mr-auto">
						<Nav.Link href="/list">Список</Nav.Link>
						<Nav.Link href="/add">Добавить</Nav.Link>
						<Nav.Link href="/archive">Архив</Nav.Link>
					</Nav>
				</Navbar>

				<FirebaseDatabaseProvider firebase={firebase} {...config}>
					<div className="main-content">
						<Switch>
							<Route path="/list">
								<List></List>
							</Route>
							<Route path="/add">
								<CreateTitle></CreateTitle>
							</Route>
							<Route path="/edit">
								<EditTitle></EditTitle>
							</Route>
							<Route path="/archive">
								<h1>This is archive</h1>
							</Route>
							<Redirect from="/" to="/list" />
						</Switch>
					</div>
				</FirebaseDatabaseProvider>
			</div>
		</HelmetProvider>
	);
}

export default App;
