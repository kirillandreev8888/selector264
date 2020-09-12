import React, { useState, useEffect } from 'react'
import "./CreateTitle.scss"

// import { FirebaseDatabaseMutation } from "@react-firebase/database"
import firebase from "firebase/app"
import "firebase/database"
import { Card, InputGroup, Form, Button } from 'react-bootstrap'
import { parse } from 'node-html-parser';
import axios from "axios"
import qs from "qs"

import logo from "../../static/logo.svg"
import { withRouter } from 'react-router-dom'

function CreateTitle(props) {



    const parseFromShikimori = () => {
        if (shiki_link.indexOf("shikimori") !== -1) {
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            fetch(proxyurl + shiki_link)
                .then(response => response.text())
                .then(contents => {
                    const root = parse(contents);
                    setPic(root.querySelector('.c-poster center img').getAttribute("src"));
                    const newName = root.querySelector('h1').innerHTML.split('</span>');
                    setName(newName[newName.length - 1]);
                    const newStat = root.querySelector(".b-anime_status_tag").getAttribute("data-text");
                    if (newStat === "вышло") {
                        setStatus("list")
                    }
                    else {
                        setStatus("ongoing")
                    }

                })
        }
        else
            alert("Неправильная ссылка")
    }

    const parseFromAnimespirit = () => {
        if (watch_link.indexOf("animespirit") !== -1) {
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            axios.get(proxyurl + watch_link, { headers: { 'X-Requested-With': 'XMLHttpRequest' } }).then(
                res => {
                    const root = parse(res.data);
                    setPic(root.querySelector("a.highslide img").getAttribute("src"))
                    setName(root.querySelectorAll('h3')[4].innerHTML)
                    const newStat = root.querySelector("#ratig-layer").parentNode.innerHTML
                    if (newStat.indexOf("Онгоинг") === -1) {
                        setStatus("list")
                    } else {
                        setStatus("ongoing")
                    }
                }
            )
        }
        else
            alert("Неправильная ссылка")

    }

    const parseFromJutSu = (link) => {
        let localWath_link;
        if (typeof link === "string"){
            setWatch_link(link);
            localWath_link=link;
        }else
        localWath_link = watch_link;
        if (localWath_link.indexOf("jut.su") !== -1) {
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            axios.get(proxyurl + localWath_link, { headers: { 'X-Requested-With': 'XMLHttpRequest' } }).then(
                res => {
                    const root = parse(res.data);
                    const str = root.querySelector(".all_anime_title").getAttribute("style");
                    setPic(str.substring(str.indexOf('(') + 2, str.indexOf(')') - 1))
                    let newName = root.querySelector('h1').innerHTML
                    newName = newName.replace('Смотреть ', '').replace(' - все серии', '').replace(' все серии', '').replace(' и сезоны', '');
                    setName(newName)
                    const newStat = root.querySelector(".under_video_additional").innerHTML
                    if (newStat.indexOf("онгоинг") === -1) {
                        setStatus("list")
                    } else {
                        setStatus("ongoing")
                    }
                }
            )
        }
        else
            alert("Неправильная ссылка")
    }

    const [path, setPath] = useState("titles/");
    const [status, setStatus] = useState("list");
    const [name, setName] = useState("");
    const [pic, setPic] = useState(logo);
    const [watch_link, setWatch_link] = useState("");
    const [shiki_link, setShiki_link] = useState("");

    useEffect(() => {
        const params = qs.parse(props.location.search.slice(1));
        if (params.jutsulink) {
            parseFromJutSu(params.jutsulink);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="CreateTitle">
            <Card>
                <Card.Img src={pic} />
                <Card.Body>
                    <Form>
                        <Form.Label style={{ fontSize: "2em" }}><b>{(name === "") ? "Добавить новый тайтл" : name}</b></Form.Label>
                        <Form.Group controlId="title_name">
                            <Form.Control value={name} type="text" placeholder="Название" onChange={(e) => { setName(e.target.value) }} />
                            <Form.Text className="text-muted">
                                Название, картинка и категория автоматически загрузятся, если вставить ссылку с shikimori, animespirit или jut.su
                                </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="title_watch_link">
                            <InputGroup className="mb-3" >
                                <InputGroup.Prepend>
                                    <Button variant="warning" onClick={parseFromAnimespirit}>animespirit</Button>
                                    <Button variant="dark" onClick={parseFromJutSu}>jut.su</Button>

                                </InputGroup.Prepend>
                                <Form.Control value={watch_link} type="text" placeholder="Ссылка на просмотр" onChange={(e) => { setWatch_link(e.target.value) }} />
                            </InputGroup>
                            <Form.Text className="text-muted">
                                Парсер ссылок для просмотра может работать некорректно. Картинки с animespirit не отображаются без VPN.
                                </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="title_shiki_link">
                            <InputGroup className="mb-3" >
                                <InputGroup.Prepend>
                                    <Button variant="info" onClick={parseFromShikimori}>Парсить с shikimori</Button>
                                </InputGroup.Prepend>
                                <Form.Control value={shiki_link} type="text" placeholder="Ссылка на шикимори" onChange={(e) => { setShiki_link(e.target.value) }} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="title_status" >
                            <Form.Label>Категория</Form.Label>
                            <Form.Control value={status} as="select" onChange={(e) => {
                                const newStatus = e.target.value;
                                setStatus(newStatus);
                                if (newStatus !== "archive")
                                    setPath("titles/")
                                else
                                    setPath("archive/")

                            }}>
                                <option value="list">Основной список</option>
                                <option value="ongoing">Онгоинг</option>
                                <option value="archive">Архив</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="success" onClick={() => {
                            firebase.database().ref(props.user + '/' + path).push({
                                "name": (name !== "") ? name : "Без имени",
                                "status": status,
                                "pic": pic,
                                "shiki_link": shiki_link,
                                "watch_link": watch_link
                            }, (err) => {
                                if (err)
                                    alert(err)
                                else {
                                    props.history.push("../")
                                }
                            });
                        }}>Добавить</Button>
                    </Form>
                </Card.Body>
            </Card>


        </div>
    )
}

export default withRouter(CreateTitle)
