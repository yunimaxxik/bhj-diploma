/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
	/**
	 * Вызывает родительский конструктор и
	 * метод renderAccountsList
	 * */
	constructor(element) {
		super(element);
		this.renderAccountsList();
	}

	/**
	 * Получает список счетов с помощью Account.list
	 * Обновляет в форме всплывающего окна выпадающий список
	 * */
	renderAccountsList() {
		if (!User.current()) return;

		const select = this.element.querySelector('select[name="account_id"]');
		if (!select) return;

		Account.list({}, (err, response) => {
			if (err || !response || !response.success) {
				console.error(err || response?.error);
				return;
			}

			const accounts = response.data || [];
			select.innerHTML = '';

			accounts.forEach((account) => {
				const option = document.createElement('option');
				option.value = account.id;
				option.textContent = account.name;
				select.appendChild(option);
			});
		});
	}

	/**
	 * Создаёт новую транзакцию (доход или расход)
	 * с помощью Transaction.create. По успешному результату
	 * вызывает App.update(), сбрасывает форму и закрывает окно,
	 * в котором находится форма
	 * */
	onSubmit(data) {
		Transaction.create(data, (err, response) => {
			if (!err && response && response.success) {
				this.element.reset();
				if (data.type === 'income') {
					const modal = App.getModal('newIncome');
					modal.close();
				} else {
					const modal = App.getModal('newExpense');
					modal.close();
				}

				App.update();
			} else {
				console.error(err || response?.error);
			}
		});
	}
}
