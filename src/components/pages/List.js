import React from 'react'
import TitleCard from '../elements/TitleCard'

import { FirebaseDatabaseNode } from "@react-firebase/database"
import { Spinner } from 'react-bootstrap'

function List() {

    // const [state, setState] = useState("defaultState");

    const unpack = data => {//функция - распаковщик, перебирающая поля в объекте, так как с автогенерируемыми ключами итерация как по массиву больше не работает
        let res = [];
        for (let key in data) {
            const elem = data[key];
            res.push(
                <TitleCard key={key}
                    id={key}
                    name={elem.name}
                    // status={elem.status}
                    path="titles/"
                    pic={elem.pic}
                    shiki_link={elem.shiki_link}
                    watch_link={elem.watch_link}
                ></TitleCard>);
        }
        return res;
    }

    return (
        <div className="List">
            <FirebaseDatabaseNode
                path="titles/"
                orderByKey>{d => {
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
