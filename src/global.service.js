/* eslint-disable no-loop-func */
class Subject {
	constructor() {
		this.observers = [];
	}

	/** подписаться на обновление subject'а */
	subscribe(callback) {
		//генерируем случайный id
		let id = Math.random().toString(16).slice(2);
		while (!!this.observers.filter((obs) => obs.id === id).length) {
			id = Math.random().toString(16).slice(2);
		}
		this.observers.push({ id: id, fn: callback });
		return {
			id: id,
			unsubscribe: () => {
				this.unsubscribe(id);
			},
		};
	}

	/** отписаться от subject'а */
	unsubscribe(id) {
		this.observers = this.observers.filter((obs) => obs.id !== id);
	}

	/** передать в subject следующее значение и отправить всем подписчикам */
	next(value) {
		this.observers.forEach((obs) => obs.fn(value));
	}
}

class Subjects {
    //немножко костыльно получилось, эти 2 subject'а связывают компоненты list и app
    /** request - рассылка оповещения о нажатии кнопки "случайный тайтл" */
	static RandomTitleSubjectRequest = new Subject();
    /** reply - рассылка в обратную сторону */
	static RandomTitleSubjectReply = new Subject();
    /** подписка на событие отметки тайтла */
    static TitleSelectSubject = new Subject();

}

export default Subjects;
