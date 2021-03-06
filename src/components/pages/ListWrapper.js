import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import List from './List'

function ListWrapper(props) {
    return (
        <div className="ListWrapper">
            <Tabs defaultActiveKey="mainList" id="uncontrolled-tab-example">
                <Tab eventKey="mainList" title="Основной лист">
                    <List minmode={props.minmode} user={props.user} path="titles" status="list" setListOfTitles={props.setListOfTitles}></List>
                </Tab>
                <Tab eventKey="ongoingList" title="Онгоинги">
                    <List minmode={props.minmode} user={props.user} path="titles" status="ongoing"></List>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ListWrapper
