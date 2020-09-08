import React, { useState, useEffect } from 'react';
import './App.scss';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Switch, Route, Redirect, withRouter } from "react-router-dom"
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap"
//custom
import logo from "./static/logo.svg"
import { Random } from "random-js"
// import axios from "axios"
// import { parse } from 'node-html-parser';

//components
import List from './components/pages/List';
import CreateTitle from './components/pages/CreateTitle';
import EditTitle from './components/pages/EditTitle';
import ListWrapper from './components/pages/ListWrapper';
//firebase
import firebase from "firebase/app"
import "firebase/database"
import { FirebaseDatabaseProvider } from "@react-firebase/database"
import { config } from "./config"



function App(props) {
	const [user, setUser] = useState("ker264");

	//костыли для кнопки случайного выбора
	const [listOfTitles, setListOfTitles] = useState([]);
	const [rndTitle, setRndTitle] = useState("");

	useEffect(() => {//в началае достает пользователя из localstorage
		let savedUser = localStorage.getItem("savedUser");
		if (savedUser !== null)
			setUser(savedUser)
	}, [])
	useEffect(() => {//при изменении также сохраняет значение в localstorage
		localStorage.setItem("savedUser", user)
	}, [user])

	// useEffect(() => {
	// 	if (props.location.pathname === "/list")
	// 		setRandomButtonVisibility(true)
	// 	else
	// 		setRandomButtonVisibility(false)

	// }, [props.location])

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
					<NavDropdown variant="info" title={user} id="basic-nav-dropdown" style={{ marginRight: "30px" }}>
						<NavDropdown.Item onSelect={() => setUser("ker264")} >ker264</NavDropdown.Item>
						<NavDropdown.Item onSelect={() => setUser("LordAsheron")}>LordAsheron</NavDropdown.Item>
						{/* <NavDropdown.Divider /> */}
					</NavDropdown>
				</Navbar>

				<FirebaseDatabaseProvider firebase={firebase} {...config}>
					<div className="main-container d-flex">
						<div className="main-content">
							<Switch>
								<Route path="/list">
									<ListWrapper user={user} setListOfTitles={setListOfTitles}></ListWrapper>
								</Route>
								<Route path="/add">
									<CreateTitle user={user}></CreateTitle>
								</Route>
								<Route path="/edit">
									<EditTitle user={user}></EditTitle>
								</Route>
								<Route path="/archive">
									<List user={user} path="archive"></List>
								</Route>
								<Redirect from="/" to="/list" />
							</Switch>
						</div>
						<div className="side-content">
							{/* <div className="side-menu"> */}
							<Button variant={(props.location.pathname === "/list")? "outline-success" : "danger"} onClick={() => {
								setRndTitle(listOfTitles[new Random().integer(0,listOfTitles.length-1)]);
							}}>Выбрать случайное </Button>
							<h4 style={{margin: "auto"}}>{rndTitle}</h4>
							{/* </div> */}
						</div>
					</div>

				</FirebaseDatabaseProvider>
			</div>
		</HelmetProvider>
	);
}

export default withRouter(App);
