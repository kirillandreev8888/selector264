import React from 'react'
import TitleCard from '../elements/TitleCard'

import { FirebaseDatabaseNode } from "@react-firebase/database"
import { Spinner } from 'react-bootstrap'

function List(props) {

    const unpack = data => {//функция - распаковщик, перебирающая поля в объекте, так как с автогенерируемыми ключами итерация как по массиву больше не работает
        let res = [];
        let titlesForRandomSelect = [];
        for (let key in data) {
            const elem = data[key];
            if (!props.status || props.status === elem.status)
                res.push(
                    <TitleCard key={key}
                        id={key}
                        name={elem.name}
                        // status={elem.status}
                        minmode={props.minmode}
                        path={`${props.path}/`}
                        pic={elem.pic}
                        shiki_link={elem.shiki_link}
                        watch_link={elem.watch_link}
                    ></TitleCard>);
            if (elem.status === "list")
                titlesForRandomSelect.push({ name: elem.name, pic: elem.pic });
        }
        if (props.setListOfTitles) {
            props.setListOfTitles(titlesForRandomSelect);
        }
        return res;
    }

    return (
        <div className="List">
            <FirebaseDatabaseNode
                //этот компонент полностью ломает архитектуру реакта, так как не ререндерится вместе с родительским компонентом,
                //а вместо этого импользует копию из кэша, обновляясь только при смене props у этого элемента
                path={`${props.user}/${props.path}`}
                orderByKey={props.minmode} //поэтому сюда подается minmode (все равно оно строковое и будет интерпретироваться как true, но ререндер будет)
            >{d => {
                if (d.value) {
                    return (
                        <div>
                            {unpack(d.value)}
                        </div>
                    )
                } else
                    return (
                        <Spinner animation="border" role="status" style={{ marginTop: "30px" }}>
                            <span className="sr-only">Loading...</span>
                        </Spinner>)
            }

                }

            </FirebaseDatabaseNode>
        </div>
    )
}

export default List
