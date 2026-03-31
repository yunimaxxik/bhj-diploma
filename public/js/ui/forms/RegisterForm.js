/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
	/**
	 * Производит регистрацию с помощью User.register
	 * После успешной регистрации устанавливает
	 * состояние App.setState( 'user-logged' )
	 * и закрывает окно, в котором находится форма
	 * */
	onSubmit(data) {
		User.register(data, (err, response) => {
			if (err) {
				console.error('Ошибка регистрации:', err);
				return;
			}

			this.element.reset();
			const register = Modal.getModal('register');
			register.close();
			App.setState('user-logged');
		});
	}
}
