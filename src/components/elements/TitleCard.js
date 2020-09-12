import React from 'react'
import { Card, Button, Accordion } from 'react-bootstrap'
import "./TitleCard.scss"
import { Link } from 'react-router-dom'

function TitleCard(props) {
    return (
        <div className="TitleCard">
            {(() => {
                if (props.minmode === "Min")
                    return (
                        <Accordion defaultActiveKey="1">
                            <Accordion.Toggle as={Card.Header} eventKey="0"><h3>{props.name}</h3></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card >
                                    <Card.Img className="animate1" width="100%" src={props.pic} alt="Нет картинки" />
                                    <Card.Body>
                                        <Card.Title ><Link to={{ pathname: `edit`, search: `?key=${props.id}&from=${props.path}` }}>{props.name}</Link></Card.Title>
                                        <div>
                                            {(() => {
                                                if (props.shiki_link !== "")
                                                    return (<Button variant="primary" className="w-50" href={props.shiki_link} >Страница на shikimori.one</Button>)
                                                else
                                                    return (<Button disabled variant="outline-primary" className="w-50" href={props.shiki_link} >Страница на shikimori.one</Button>)
                                            })()}
                                            {(() => {
                                                if (props.watch_link !== "")
                                                    return (<Button variant="success" className="w-25" href={props.watch_link} style={{ marginLeft: "20px" }}>Смотреть</Button>)
                                                else
                                                    return (<Button disabled variant="outline-success" className="w-25" href={props.watch_link} style={{ marginLeft: "20px" }}>Смотреть</Button>)
                                            })()}


                                        </div>
                                    </Card.Body>
                                </Card>
                            </Accordion.Collapse>
                        </Accordion>
                    )
                else
                    return (
                        <Card >
                            <Card.Img className="animate1" width="100%" src={props.pic} alt="Нет картинки" />
                            <Card.Body>
                                <Card.Title ><Link to={{ pathname: `edit`, search: `?key=${props.id}&from=${props.path}` }}>{props.name}</Link></Card.Title>
                                <div>
                                    {(() => {
                                        if (props.shiki_link !== "")
                                            return (<Button variant="primary" className="w-50" href={props.shiki_link} >Страница на shikimori.one</Button>)
                                        else
                                            return (<Button disabled variant="outline-primary" className="w-50" href={props.shiki_link} >Страница на shikimori.one</Button>)
                                    })()}
                                    {(() => {
                                        if (props.watch_link !== "")
                                            return (<Button variant="success" className="w-25" href={props.watch_link} style={{ marginLeft: "20px" }}>Смотреть</Button>)
                                        else
                                            return (<Button disabled variant="outline-success" className="w-25" href={props.watch_link} style={{ marginLeft: "20px" }}>Смотреть</Button>)
                                    })()}


                                </div>
                            </Card.Body>
                        </Card>
                    )
            })()}



        </div>
    )
}

export default TitleCard
