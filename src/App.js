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
import Subjects from './global.service';

function App(props) {
	//настройки досаются из localStorage в начале

    //currentListOwner - чей список в данный момент просматривается
	const [currentListOwner, setCurrentListOwner] = useState(!localStorage.getItem("savedCurrentListOwner") ? "ker264" : localStorage.getItem("savedCurrentListOwner"));
    const [currentUser, setCurrentUser] = useState(!localStorage.getItem("savedCurrentUser") ? "Макс" : localStorage.getItem("savedCurrentUser"));
    //minmode - вкл/выкл режим минимального списка
	const [minmode, setMinmode] = useState(!localStorage.getItem("savedMinmode") ? "Full" : localStorage.getItem("savedMinmode"));

	//костыли для кнопки случайного выбора
	const [checkedList, setCheckedList] = useState([]);
	const [rndTitle, setRndTitle] = useState({id: "", name: "", pic: "" });

	//!react router обновляет весь главный компонент целиком, если идет переход по url
	//!какими-либо средствами, кроме предусмотренных самим react router, поэтому
	//!переход по ссылкам из bootstrap navbar link перезагружал целиком приложения и сбрасывал все state
	//!решение - использовать react-router-bootstrap и props.history.push("../")

	//при изменении также сохраняет значение в localstorage
	useEffect(() => {
		localStorage.setItem("savedCurrentListOwner", currentListOwner);
	}, [currentListOwner])
    useEffect(() => {
        if (!localStorage.getItem("savedCurrentUser")){
            alert('Выставлен пользователь по умолчанию. Пожалуйста, идентифицируйте себя, выбрав пользовтеля на панели сверху.')
        }
		localStorage.setItem("savedCurrentUser", currentUser);
	}, [currentUser])
	useEffect(() => {
		localStorage.setItem("savedMinmode", minmode);
	}, [minmode])
    useEffect(() => {
		let subscriptions = [];
        //подписываемся на ответ на запрос списка тайтлов для рандомного селекта
		subscriptions.push(
			Subjects.RandomTitleSubjectReply.subscribe((list) => {
                let titles = [...list];
                if (checkedList.length) titles = titles.filter(title=>!!~checkedList.indexOf(title.id));
				if (titles.length) setRndTitle(titles[new Random().integer(0, titles.length - 1)]);
			})
		);
        //подписываемя на отметку тайтла для рандомного селекта
        subscriptions.push(
			Subjects.TitleSelectSubject.subscribe((title) => {
                let checked = checkedList;
                const index = checked.indexOf(title)
                if (index !== -1)
                    checked.splice(index,1)
                else
                    checked.push(title);
                setCheckedList([...checked])
			})
		);
		return () => {
			for (let subscription of subscriptions) subscription.unsubscribe();
		};
	// 1eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkedList]);
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
					<div className='nav-dropdown-container'>
                        <div className='nav-dropdown-label' style={{color: 'white'}}>Чей список</div>
                        <NavDropdown variant="info" title={currentListOwner} id="basic-nav-dropdown">
                            <NavDropdown.Item onSelect={() => {setCurrentListOwner("ker264"); setCheckedList([])}} >ker264</NavDropdown.Item>
                            <NavDropdown.Item onSelect={() => {setCurrentListOwner("LordAsheron"); setCheckedList([])}}>LordAsheron</NavDropdown.Item>
                            <NavDropdown.Item onSelect={() => {setCurrentListOwner("Tecnika"); setCheckedList([])}}>Tecnika</NavDropdown.Item>
                            {/* <NavDropdown.Divider /> */}
                        </NavDropdown>
                    </div>
                    <div className='nav-dropdown-container'>
                        <div className='nav-dropdown-label' style={{color: 'white'}}>Пользователь</div>
                        <NavDropdown variant="info" title={currentUser} id="basic-nav-dropdown">
                            <NavDropdown.Item onSelect={() => setCurrentUser("Макс")} >Макс</NavDropdown.Item>
                            <NavDropdown.Item onSelect={() => setCurrentUser("Паша")}>Паша</NavDropdown.Item>
                            <NavDropdown.Item onSelect={() => setCurrentUser("Ника")}>Ника</NavDropdown.Item>
                            <NavDropdown.Item onSelect={() => setCurrentUser("Кирилл")}>Кирилл</NavDropdown.Item>
                        </NavDropdown>
                    </div>
				</Navbar>
				<FirebaseDatabaseProvider firebase={firebase} {...config}>
					<div className="main-container d-flex">
						<div className="main-content">
							<Switch>
								<Route path="/list">
									<ListWrapper minmode={minmode} currentListOwner={currentListOwner} currentUser={currentUser} checkedList={checkedList}></ListWrapper>
								</Route>
								<Route path="/add">
									<CreateTitle currentListOwner={currentListOwner}></CreateTitle>
								</Route>
								<Route path="/edit">
									<EditTitle currentListOwner={currentListOwner}></EditTitle>
								</Route>
								<Route path="/archive">
									<List minmode={minmode} currentListOwner={currentListOwner} currentUser={currentUser} path="archive"></List>
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
                                                Subjects.RandomTitleSubjectRequest.next();
											}}>Выбрать случайное </Button>
											<div style={{cursor:  rndTitle.id ? 'pointer' : ''}} onClick={()=>{
                                            rndTitle.id && document.getElementById(rndTitle.id).scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }}>
                                                <h4 style={{ margin: "auto" }}>{rndTitle.name}</h4>
                                                <img style={{marginTop: "10px", maxWidth: "250px", maxHeight: "350px"}} src={rndTitle.pic} alt="" />
                                            </div>

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
