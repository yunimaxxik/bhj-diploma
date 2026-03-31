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
		document.querySelector('.create-account').addEventListener('click', (e) => {
			e.preventDefault();
			const createAccountModal = App.getModal('createAccount');
			createAccountModal.open();
		});

		this.element.addEventListener('click', (event) => {
			const accountElement = event.target.closest('.account');
			if (accountElement) {
				this.onSelectAccount(accountElement);
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

		Account.list((err, response) => {
			if (err) {
				console.error('Ошибка при получении списка счетов:', err);
				return;
			}

			this.clear();
			this.renderItems(response.data);
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
	onSelectAccount(accountElement) {
		const allAccounts = this.element.querySelectorAll('.account');
		allAccounts.forEach((acc) => acc.classList.remove('active'));
		accountElement.classList.add('active');
		const accountId = accountElement.dataset.id;
		if (accountId) {
			App.showPage('transactions', { account_id: accountId });
		}
	}

	/**
	 * Возвращает HTML-код счёта для последующего
	 * отображения в боковой колонке.
	 * item - объект с данными о счёте
	 * */
	getAccountHTML(item) {
		return `<li class="account" data-id="${item.id}">
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
	renderItems(items) {
		const container = this.element; // ul.sidebar-menu
		items.forEach((item) => {
			const html = this.getAccountHTML(item);
			container.insertAdjacentHTML('beforeend', html);
		});
	}
}
