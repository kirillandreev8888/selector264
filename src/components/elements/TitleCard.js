import React, {} from 'react'
import { Card, Button, Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap'
import "./TitleCard.scss"
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';
import "firebase/database"
import firebase from "firebase/app"

import Subjects from '../../global.service';

function TitleCard(props) {
    /** есть ли уже в спике голосов голос текущего пользователя */
    const currentUserHasAlreadyVoted = !!~props.votes.findIndex(vote=>vote.name===props.currentUser);

    /** запрос на обновление в firebase */
    const updateVoteData = (value) => {
        //копируем с пропсов
        let votes = props.votes;
        //если польззовтаельская оценка есть в списке
        if (currentUserHasAlreadyVoted){
            const index = votes.findIndex(vote=>vote.name===props.currentUser);
            //и она не совпадает с новым значением, то меняем
            if (votes[index].value !== value){
                votes[index].value = value
            }else{
                //иначе, значит, что нажата кнопка была повторно, а это отмена, значит удаляем
                votes.splice(index, 1)
            }
        }else{
            votes.push({
                name: props.currentUser,
                value: value
            })
        }
        firebase.database().ref(props.currentListOwner + '/' + props.path + props.id).update({
            votes: votes
        }, (err) => {
            if (err)
                alert(err)
        })
    }

    /** нажатие на картинку для выбора */
    const titleSelected = () =>{
        if (props.status === 'list')
        Subjects.TitleSelectSubject.next(props.id);
    }

    /** нужно ли раскрашивать кнопку */
    const isButtonHighlighted = (value) =>{
        return currentUserHasAlreadyVoted && 
            props.votes.filter(vote=>vote.name===props.currentUser&&vote.value===value)?.length
    }

    /** нужно ли у кнопки рисовать корону */
    const isButtonCrowned = (value) =>{
        let calculatedVotes = {
            yes: 0,
            ok: 0,
            no: 0
        };
        for (let vote of props.votes){
            calculatedVotes[vote.value]++;
        }
        return currentUserHasAlreadyVoted && calculatedVotes[value] === Math.max(...Object.values(calculatedVotes));
    }

    /** получить надпись внутри кнопки */
    const getButtonContent = (value)=>{
        const symbols = {
            yes: '🞁',
            ok: '—',
            no: '🞃'
        }
        if (!currentUserHasAlreadyVoted) return symbols[value];
        return props.votes.filter(vote=>vote.value===value)?.length;
    }

    /** получить надпись при наведении на кнопку */
    const getButtonTooltip = (value) =>{
        const texts = {
            yes: 'Хочу посмотреть',
            ok: 'Не против посмотреть',
            no: 'Не хочу смотреть'
        }
        if (!currentUserHasAlreadyVoted)
            return texts[value];
        else {
            const votesForValue = props.votes.filter(vote=>vote.value===value);
            if (!votesForValue.length) return '...';
            return props.votes.filter(vote=>vote.value===value)
                .map(vote=>vote.name === props.currentUser ? 'Вы' : vote.name).join(', ')
        }
    }
    
    return (
        <div className="TitleCard" id={props.id}>
            {(() => {
                if (props.minmode === "Min")
                    return (
                        <Accordion defaultActiveKey="1">
                            <Accordion.Toggle
                                style={{ display: "flex", justifyContent: "center" }}
                                as={Card.Header} eventKey="0">
                                <h3 style={{ margin: "auto" }}>
                                    {props.name}
                                </h3>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card >
                                    <Card.Img className="animate1" width="100%" src={props.pic} alt="Нет картинки" />
                                    <Card.Body>
                                        <div>
                                            <LinkContainer to={{ pathname: `edit`, search: `?key=${props.id}&from=${props.path}` }}><Button variant="warning" className="w-50"  >Редактировать</Button></LinkContainer>

                                            {(() => {
                                                if (props.shiki_link !== "")
                                                    return (<Button variant="primary" className="w-50" href={props.shiki_link} >Страница на shikimori.one</Button>)
                                                else
                                                    return (<Button disabled variant="outline-primary" className="w-50" href={props.shiki_link} >Страница на shikimori.one</Button>)
                                            })()}
                                            {(() => {
                                                if (props.watch_link !== "")
                                                    return (<Button variant="success" className="w-50" href={props.watch_link} >Смотреть</Button>)
                                                else
                                                    return (<Button disabled variant="outline-success" className="w-50" href={props.watch_link}>Смотреть</Button>)
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
                            <div className='card-img-container' onClick={titleSelected}>
                                <Card.Img width="100%" src={props.pic} alt="Нет картинки" />
                                <span className={props.isChecked ? 'checked' : ''}>🗸</span>
                            </div>
                            <Card.Body className='full-mode'>
                                <div className='card-left-body'>
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
                                </div>
                                {(() => {
                                    if (props.path==='titles/')
                                    return(
                                        <div className='card-right-body'>
                                        {// блок кнопочек голосования
                                            [{value: 'yes', style: 'success'},
                                            {value: 'ok', style: 'warning'},
                                            {value: 'no', style: 'danger'}].map(button=>(
                                                <OverlayTrigger
                                                    key={'button-votes-overlay-'+button.value}
                                                    placement='right'
                                                    overlay={
                                                        <Tooltip>{getButtonTooltip(button.value)}</Tooltip>
                                                    }>
                                                    <button key={'button-votes-'+button.value}
                                                        className={'btn btn-'+(!isButtonHighlighted(button.value)?'outline-':'')+button.style}
                                                        onClick={()=>{ updateVoteData(button.value)}}>
                                                        <span className={isButtonCrowned(button.value) ? 'crowned' : ''}>
                                                            {getButtonContent(button.value)}</span>
                                                    </button>
                                                </OverlayTrigger>
                                            ))
                                        }
                                    </div>
                                    )
                                })()}
                            </Card.Body>
                        </Card>
                    )
            })()}



        </div>
    )
}

export default TitleCard
