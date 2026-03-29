/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
	/**
	 * Запускает initAuthLinks и initToggleButton
	 * */
	static init() {
		this.initAuthLinks();
		this.initToggleButton();
	}

	/**
	 * Отвечает за скрытие/показа боковой колонки:
	 * переключает два класса для body: sidebar-open и sidebar-collapse
	 * при нажатии на кнопку .sidebar-toggle
	 * */
	static initToggleButton() {
		document.querySelector('.sidebar-toggle').addEventListener('click', (e) => {
			e.preventDefault();
			document.body.classList.toggle('sidebar-open');
			document.body.classList.toggle('sidebar-collapse');
		});
	}

	/**
	 * При нажатии на кнопку входа, показывает окно входа
	 * (через найденное в App.getModal)
	 * При нажатии на кнопку регастрации показывает окно регистрации
	 * При нажатии на кнопку выхода вызывает User.logout и по успешному
	 * выходу устанавливает App.setState( 'init' )
	 * */
	static initAuthLinks() {
		const login = App.getModal('login');
		document.querySelector('.menu-item_login').addEventListener('click', () => {
			login.open();
		});

		const register = App.getModal('register');
		document
			.querySelector('.menu-item_register')
			.addEventListener('click', () => {
				register.open();
			});
	}
}
