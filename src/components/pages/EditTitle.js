import React, { useState, useEffect } from 'react'
import "./EditTitle.scss"

// import { FirebaseDatabaseMutation } from "@react-firebase/database"
import firebase from "firebase/app"
import "firebase/database"
import { Card, InputGroup, Form, Button } from 'react-bootstrap'
import { parse } from 'node-html-parser';
import axios from "axios"
import qs from "qs"

import logo from "../../static/logo.svg"
import { withRouter } from 'react-router-dom'

let params;

function EditTitle(props) {


    useEffect(() => {
        params = qs.parse(props.location.search.slice(1));
        setPath(params.from);
        firebase.database().ref(props.user + '/' + params.from + params.key).once("value").then((snapshot) => {
            const title = snapshot.val();
            setStatus(title.status)
            setName(title.name)
            setPic(title.pic)
            setWatch_link(title.watch_link)
            setShiki_link(title.shiki_link)
        })
    }, [])

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

    const [path, setPath] = useState("titles/");
    const [status, setStatus] = useState("list");
    const [name, setName] = useState("");
    const [pic, setPic] = useState(logo);
    const [watch_link, setWatch_link] = useState("");
    const [shiki_link, setShiki_link] = useState("");

    return (
        <div className="EditTitle">
            <Card>
                <Card.Img src={pic} />
                <Card.Body>
                    <Form>
                        <Form.Label style={{ fontSize: "2em" }}><b>{(name === "") ? "Добавить новый тайтл" : name}</b></Form.Label>
                        <Form.Group controlId="title_name">
                            <Form.Control value={name} type="text" placeholder="Название" onChange={(e) => { setName(e.target.value) }} />
                            <Form.Text className="text-muted">
                                Название и картинка автоматически загрузятся, если вставить ссылку с shikimori или animespirit
                                </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="title_watch_link">
                            <InputGroup className="mb-3" >
                                <InputGroup.Prepend>
                                    <Button variant="danger" onClick={parseFromAnimespirit}>Парсить с animespirit</Button>
                                </InputGroup.Prepend>
                                <Form.Control value={watch_link} type="text" placeholder="Ссылка на просмотр" onChange={(e) => { setWatch_link(e.target.value) }} />
                            </InputGroup>
                            <Form.Text className="text-muted">
                                Парсинг доступен для animespirit, но может лагать из-за их кривой верстки
                                </Form.Text>
                        </Form.Group>
                        {/* TODO подправить отступ */}
                        <Form.Group controlId="title_shiki_link">
                            <InputGroup className="mb-3" >
                                <InputGroup.Prepend>
                                    <Button variant="info" onClick={parseFromShikimori}>Парсить с shikimori</Button>
                                </InputGroup.Prepend>
                                <Form.Control value={shiki_link} type="text" placeholder="Ссылка на шикимори" onChange={(e) => { setShiki_link(e.target.value) }} />
                            </InputGroup>
                        </Form.Group>
                        {(() => {
                            if (path === "titles/") {
                                return (
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
                                        </Form.Control>
                                    </Form.Group>
                                )
                            }
                        })()}

                        <Button variant="danger" onClick={() => {
                            firebase.database().ref(props.user + '/' + path + params.key).remove((err) => {
                                if (err)
                                    alert(err)
                                else
                                    if (path !== "archive/")
                                        document.location.href = "../"
                                    else
                                        document.location.href = "../archive"
                            });
                        }}>Удалить</Button>
                        {' '}
                        {(() => {
                            if (path === "titles/") {
                                return (
                                    <Button style={{ marginRight: "0.33em" }} variant="secondary" onClick={() => {
                                        firebase.database().ref(props.user + '/titles/' + params.key).remove().then(() => {
                                            firebase.database().ref(props.user + '/archive/').push({
                                                "name": name,
                                                "status": status,
                                                "pic": pic,
                                                "shiki_link": shiki_link,
                                                "watch_link": watch_link
                                            }, (err) => {
                                                if (err)
                                                    alert(err)
                                                else
                                                    document.location.href = "../"
                                            });
                                        });
                                    }}>Архивировать</Button>
                                )
                            }
                        })()}
                        <Button variant="success" onClick={() => {
                            firebase.database().ref(props.user + '/' + path + params.key).update({
                                "name": name,
                                "status": status,
                                "pic": pic,
                                "shiki_link": shiki_link,
                                "watch_link": watch_link
                            }).then((err) => {
                                if (err)
                                    alert(err)
                                else
                                    if (path !== "archive/")
                                        document.location.href = "../"
                                    else
                                        document.location.href = "../archive"

                            })
                        }}>Сохранить изменения</Button>
                    </Form>
                </Card.Body>
            </Card>


        </div>
    )
}

export default withRouter(EditTitle) 
