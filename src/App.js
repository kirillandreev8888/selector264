import React, { useState, useEffect } from 'react';
import './App.scss';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Switch, Route, Redirect, withRouter } from "react-router-dom"
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap"
import { LinkContainer } from 'react-router-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
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
	//в началае достает пользователя из localstorage
	const [user, setUser] = useState(!localStorage.getItem("savedUser") ? "ker264" : localStorage.getItem("savedUser"));
	const [minmode, setMinmode] = useState(!localStorage.getItem("savedMinmode") ? "Full" : localStorage.getItem("savedMinmode"));

	//костыли для кнопки случайного выбора
	const [listOfTitles, setListOfTitles] = useState([]);
	const [rndTitle, setRndTitle] = useState({ name: "", pic: "" });

	//!react router обновляет весь главный компонент целиком, если идет переход по url
	//!какими-либо средствами, кроме предусмотренных самим react router, поэтому
	//!переход по ссылкам из bootstrap navbar link перезагружал целиком приложения и сбрасывал все state
	//!решение - использовать react-router-bootstrap и props.history.push("../")

	//при изменении также сохраняет значение в localstorage
	useEffect(() => {
		localStorage.setItem("savedUser", user)
	}, [user])
	useEffect(() => {
		localStorage.setItem("savedMinmode", minmode);
	}, [minmode])

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
						<LinkContainer to="/list"><Nav.Link>Список</Nav.Link></LinkContainer>
						<LinkContainer to="/add"><Nav.Link>Добавить</Nav.Link></LinkContainer>
						<LinkContainer to="/archive"><Nav.Link>Архив</Nav.Link></LinkContainer>
					</Nav>
					<BootstrapSwitchButton
						checked={(minmode === "Full") ? false : true}
						onlabel='Min'
						offlabel='Full'
						width={50}
						size="sm"
						onstyle="secondary"
						offstyle="outline-secondary"
						onChange={(isChecked) => {
							if (minmode === "Full")
								setMinmode("Min")
							else
								setMinmode("Full")
						}}
					/>
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
									<ListWrapper minmode={minmode} user={user} setListOfTitles={setListOfTitles}></ListWrapper>
								</Route>
								<Route path="/add">
									<CreateTitle user={user}></CreateTitle>
								</Route>
								<Route path="/edit">
									<EditTitle user={user}></EditTitle>
								</Route>
								<Route path="/archive">
									<List minmode={minmode} user={user} path="archive"></List>
								</Route>
								<Redirect from="/" to="/list" />
							</Switch>
						</div>
						<div className="side-content">
							{(() => { //кнопка "случайно"
								if (props.location.pathname === "/list")
									return (
										<div>
											<Button variant="outline-success" onClick={() => {
												setRndTitle(listOfTitles[new Random().integer(0, listOfTitles.length - 1)]);
											}}>Выбрать случайное </Button>
											<h4 style={{ margin: "auto" }}>{rndTitle.name}</h4>
											<img style={{marginTop: "10px", maxWidth: "250px", maxHeight: "350px"}} src={rndTitle.pic} alt="" />

										</div>
									);
							})()}
						</div>
					</div>

				</FirebaseDatabaseProvider>
			</div>
		</HelmetProvider>
	);
}

export default withRouter(App);
