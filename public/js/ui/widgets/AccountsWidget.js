/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
	/**
	 * Устанавливает текущий элемент в свойство element
	 * Регистрирует обработчики событий с помощью
	 * AccountsWidget.registerEvents()
	 * Вызывает AccountsWidget.update() для получения
	 * списка счетов и последующего отображения
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * */
	constructor(element) {
		if (!element) {
			throw new Error(
				'Конструктор AccountsWidget: элемент не передан или равен null/undefined',
			);
		}
		this.element = element;
		this.registerEvents();
		this.update();
	}

	/**
	 * При нажатии на .create-account открывает окно
	 * #modal-new-account для создания нового счёта
	 * При нажатии на один из существующих счетов
	 * (которые отображены в боковой колонке),
	 * вызывает AccountsWidget.onSelectAccount()
	 * */
	registerEvents() {
		document.querySelector('.create-account').addEventListener('click', () => {
			const createAccountModal = App.getModal('createAccount');
			createAccountModal.open();
		});

		this.element.addEventListener('click', (event) => {
			const accountElement = event.target.closest('.account');
			if (accountElement) {
				const accountId = accountElement.dataset.accountId;
				this.onSelectAccount(accountId);
			}
		});
	}

	/**
	 * Метод доступен только авторизованным пользователям
	 * (User.current()).
	 * Если пользователь авторизован, необходимо
	 * получить список счетов через Account.list(). При
	 * успешном ответе необходимо очистить список ранее
	 * отображённых счетов через AccountsWidget.clear().
	 * Отображает список полученных счетов с помощью
	 * метода renderItems()
	 * */
	update() {
		if (!User.current()) {
			return;
		}

		Account.list((err, data) => {
			if (err) {
				console.error('Ошибка при получении списка счетов:', err);
				return;
			}

			this.clear();
			this.renderItems(data);
		});
	}

	/**
	 * Очищает список ранее отображённых счетов.
	 * Для этого необходимо удалять все элементы .account
	 * в боковой колонке
	 * */
	clear() {
		const accountElements = document.querySelectorAll('.account');

		accountElements.forEach((accountElement) => {
			accountElement.remove();
		});
	}

	/**
	 * Срабатывает в момент выбора счёта
	 * Устанавливает текущему выбранному элементу счёта
	 * класс .active. Удаляет ранее выбранному элементу
	 * счёта класс .active.
	 * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
	 * */
	onSelectAccount(element) {
		this.element.querySelectorAll('.account.active').forEach((el) => {
			el.classList.remove('active');
		});

		const selectedElement = this.element.querySelector(
			`.account[data-id="${accountId}"]`,
		);
		if (selectedElement) {
			selectedElement.classList.add('active');
		}

		App.showPage('transactions', { account_id: accountId });
	}

	/**
	 * Возвращает HTML-код счёта для последующего
	 * отображения в боковой колонке.
	 * item - объект с данными о счёте
	 * */
	getAccountHTML(item) {
		return `<li class="active account" data-id="${item.id}">
    <a href="#">
        <span>${item.name}</span> /
        <span>${item.sum} ₽</span>
    </a>
</li>`;
	}

	/**
	 * Получает массив с информацией о счетах.
	 * Отображает полученный с помощью метода
	 * AccountsWidget.getAccountHTML HTML-код элемента
	 * и добавляет его внутрь элемента виджета
	 * */
	renderItems(data) {
		this.element.innerHTML = '';

		if (!data || !data.length) {
			return;
		}
		const accountsHTML = data.map((item) => this.getAccountHTML(item)).join('');
		this.element.insertAdjacentHTML('beforeend', accountsHTML);

		this.registerEvents();
	}
}
