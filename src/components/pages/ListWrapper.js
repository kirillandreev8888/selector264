import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import List from './List'

function ListWrapper(props) {
    return (
        <div className="ListWrapper">
            <Tabs defaultActiveKey="mainList" id="uncontrolled-tab-example">
                <Tab eventKey="mainList" title="Основной лист">
                    <List minmode={props.minmode} currentListOwner={props.currentListOwner} currentUser={props.currentUser} path="titles" status="list" checkedList={props.checkedList}></List>
                </Tab>
                <Tab eventKey="ongoingList" title="Онгоинги">
                    <List minmode={props.minmode} currentListOwner={props.currentListOwner} currentUser={props.currentUser} path="titles" status="ongoing"></List>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ListWrapper
