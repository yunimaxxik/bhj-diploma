/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
	/**
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * Сохраняет переданный элемент и регистрирует события
	 * через registerEvents()
	 * */
	constructor(element) {
		if (!element) {
			throw new Error('Некорректный элемент для страницы транзакций');
		}
		this.element = element;
		this.lastOptions = null;
		this.registerEvents();
	}

	/**
	 * Вызывает метод render для отрисовки страницы
	 * */
	update() {
		if (this.lastOptions) {
			this.render(this.lastOptions);
		}
	}

	/**
	 * Отслеживает нажатие на кнопку удаления транзакции
	 * и удаления самого счёта. Внутри обработчика пользуйтесь
	 * методами TransactionsPage.removeTransaction и
	 * TransactionsPage.removeAccount соответственно
	 * */
	registerEvents() {
		const removeAccountBtn = this.element.querySelector('.remove-account');
		if (removeAccountBtn) {
			removeAccountBtn.addEventListener('click', () => this.removeAccount());
		}

		// Удаление транзакций (делегирование, так как кнопки появляются динамически)
		this.element.addEventListener('click', (e) => {
			const removeBtn = e.target.closest('.transaction__remove');
			if (removeBtn) {
				const transactionId = removeBtn.dataset.id;
				if (transactionId) {
					this.removeTransaction(transactionId);
				}
			}
		});
	}

	/**
	 * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
	 * Если пользователь согласен удалить счёт, вызовите
	 * Account.remove, а также TransactionsPage.clear с
	 * пустыми данными для того, чтобы очистить страницу.
	 * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
	 * либо обновляйте только виджет со счетами и формы создания дохода и расхода
	 * для обновления приложения
	 * */
	removeAccount() {
		if (!this.lastOptions || !this.lastOptions.account_id) return;

		const confirmed = confirm('Вы действительно хотите удалить счёт?');
		if (!confirmed) return;

		Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
			if (!err && response && response.success) {
				// Обновляем всё приложение (виджеты, формы, страницу)
				App.update();
			} else {
				console.error(err || response?.error);
			}
		});
	}

	/**
	 * Удаляет транзакцию (доход или расход). Требует
	 * подтверждеия действия (с помощью confirm()).
	 * По удалению транзакции вызовите метод App.update(),
	 * либо обновляйте текущую страницу (метод update) и виджет со счетами
	 * */
	removeTransaction(id) {
		const confirmed = confirm(
			'Вы действительно хотите удалить эту транзакцию?',
		);
		if (!confirmed) return;

		Transaction.remove({ id }, (err, response) => {
			if (!err && response && response.success) {
				// Обновляем всё приложение
				App.update();
			} else {
				console.error(err || response?.error);
			}
		});
	}

	/**
	 * С помощью Account.get() получает название счёта и отображает
	 * его через TransactionsPage.renderTitle.
	 * Получает список Transaction.list и полученные данные передаёт
	 * в TransactionsPage.renderTransactions()
	 * */
	render(options) {
		if (!options || !options.account_id) return;

		this.lastOptions = { ...options }; // сохраняем опции для последующего обновления
		const accountId = options.account_id;

		// Загружаем данные счёта для заголовка
		Account.get(accountId, (err, accountResponse) => {
			if (
				!err &&
				accountResponse &&
				accountResponse.success &&
				accountResponse.data
			) {
				this.renderTitle(accountResponse.data);
			} else {
				this.renderTitle({ name: 'Название счёта' });
				console.error(err || accountResponse?.error);
			}
		});

		Transaction.list({ account_id: accountId }, (err, transResponse) => {
			if (
				!err &&
				transResponse &&
				transResponse.success &&
				transResponse.data
			) {
				this.renderTransactions(transResponse.data);
			} else {
				this.renderTransactions([]);
				console.error(err || transResponse?.error);
			}
		});
	}

	/**
	 * Очищает страницу. Вызывает
	 * TransactionsPage.renderTransactions() с пустым массивом.
	 * Устанавливает заголовок: «Название счёта»
	 * */
	clear() {
		this.renderTransactions([]);
		this.renderTitle({ name: 'Название счёта' });
		this.lastOptions = null;
	}

	/**
	 * Устанавливает заголовок в элемент .content-title
	 * */
	renderTitle(name) {
		const titleEl = this.element.querySelector('.content-title');
		if (titleEl) {
			titleEl.textContent = name.name || 'Название счёта';
		}
	}

	/**
	 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
	 * в формат «10 марта 2019 г. в 03:20»
	 * */
	formatDate(dateStr) {
		if (!dateStr) return '';

		// Разбираем строку вручную, чтобы избежать проблем с часовым поясом
		const parts = dateStr.match(
			/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
		);
		if (!parts) return dateStr;

		const [, year, month, day, hour, minute] = parts;
		const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

		const monthNames = [
			'января',
			'февраля',
			'марта',
			'апреля',
			'мая',
			'июня',
			'июля',
			'августа',
			'сентября',
			'октября',
			'ноября',
			'декабря',
		];

		const formattedHour = hour.toString().padStart(2, '0');
		const formattedMinute = minute.toString().padStart(2, '0');

		return `${parseInt(day, 10)} ${monthNames[date.getMonth()]} ${year} г. в ${formattedHour}:${formattedMinute}`;
	}

	/**
	 * Формирует HTML-код транзакции (дохода или расхода).
	 * item - объект с информацией о транзакции
	 * */
	getTransactionHTML(item) {
		const formattedSum = item.sum.toLocaleString('ru-RU', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
		const formattedDate = this.formatDate(item.created_at);
		const typeClass =
			item.type === 'income' ? 'transaction_income' : 'transaction_expense';

		return `
      <div class="transaction ${typeClass} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${formattedDate}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${formattedSum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;
	}

	/**
	 * Отрисовывает список транзакций на странице
	 * используя getTransactionHTML
	 * */
	renderTransactions(transactions) {
		const contentContainer = this.element.querySelector('.content');
		if (!contentContainer) return;

		if (!transactions || transactions.length === 0) {
			contentContainer.innerHTML =
				'<div class="alert alert-info">Нет транзакций</div>';
			return;
		}

		const html = transactions.map((tr) => this.getTransactionHTML(tr)).join('');
		contentContainer.innerHTML = html;
	}
}
