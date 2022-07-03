import React, { useEffect } from "react";
import TitleCard from "../elements/TitleCard";

import { FirebaseDatabaseNode } from "@react-firebase/database";
import { Spinner } from "react-bootstrap";
import Subjects from "../../global.service";

function List(props) {
	let titlesForRandomSelect = [];
	useEffect(() => {
		let subscription = Subjects.RandomTitleSubjectRequest.subscribe(() => {
			Subjects.RandomTitleSubjectReply.next(titlesForRandomSelect);
		});
		return () => {
			subscription.unsubscribe();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.currentListOwner]);
	const unpack = (data) => {
		//функция - распаковщик, перебирающая поля в объекте, так как с автогенерируемыми ключами итерация как по массиву больше не работает
		titlesForRandomSelect = [];
		let res = [];
		for (let key in data) {
			const elem = data[key];
			if (!props.status || props.status === elem.status)
				res.push(
					<TitleCard
						key={key}
						id={key}
						name={elem.name}
						currentListOwner={props.currentListOwner}
						minmode={props.minmode}
						path={`${props.path}/`}
                        status={elem.status}
						pic={elem.pic}
						shiki_link={elem.shiki_link}
						watch_link={elem.watch_link}
                        currentUser={props.currentUser}
                        votes={elem.votes ? elem.votes : []}
                        isChecked={!!props.checkedList?.length && !!~props.checkedList.indexOf(key)}
					></TitleCard>
				);
			if (elem.status === "list")
				titlesForRandomSelect.push({id: key, name: elem.name, pic: elem.pic });
		}
		return res;
	};
	return (
		<div className="List">
			<FirebaseDatabaseNode
				//этот компонент полностью ломает архитектуру реакта, так как не ререндерится вместе с родительским компонентом,
				//а вместо этого импользует копию из кэша, обновляясь только при смене props у FirebaseDatabaseNode (или обновления данных в firebase)
				path={`${props.currentListOwner}/${props.path}`}
				orderByKey={{r1: props.minmode, r2: props.checkedList, r3: props.currentUser}} //поэтому сюда подается все, что должно при изменении обновлять список
			>
				{(d) => {
					if (d.value) {
						return <div>{unpack(d.value)}</div>;
					} else
						return (
							<Spinner animation="border" role="status" style={{ marginTop: "30px" }}>
								<span className="sr-only">Loading...</span>
							</Spinner>
						);
				}}
			</FirebaseDatabaseNode>
		</div>
	);
}

export default List;
