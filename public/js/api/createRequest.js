/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	if (!options.url) {
		const error = new Error('createRequest: параметр url обязателен');
		if (options.callback) {
			options.callback(error, null);
		}
		return;
	}

	if (!options.method) {
		const error = new Error('createRequest: параметр method обязателен');
		if (options.callback) {
			options.callback(error, null);
		}
		return;
	}

	if (!options.callback) {
		console.warn('createRequest: callback не передан');
		return;
	}

	const xhr = new XMLHttpRequest();

	let requestUrl = options.url;

	if (options.method.toUpperCase() === 'GET' && options.data) {
		const params = Object.entries(options.data)
			.filter(([_, value]) => value != null)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
			)
			.join('&');

		const separator = options.url.includes('?') ? '&' : '?';
		requestUrl = `${options.url}${separator}${params}`;
	}

	try {
		xhr.open(options.method, requestUrl);
		xhr.responseType = 'json';

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				options.callback(null, xhr.response);
			} else {
				const error = new Error(
					`Request failed: ${xhr.status} ${xhr.statusText} for ${options.url}`,
				);
				options.callback(error, null);
			}
		};

		xhr.onerror = () => {
			const error = new Error(`Network error for ${options.url}`);
			console.error('Network Error:', error.message);
			options.callback(error, null);
		};

		if (options.method.toUpperCase() !== 'GET' && options.data) {
			const formData = new FormData();
			Object.entries(options.data).forEach(([key, value]) => {
				if (value != null) {
					formData.append(key, value);
				}
			});
			xhr.send(formData);
		} else {
			xhr.send();
		}
	} catch (error) {
		console.error('Ошибка при выполнении запроса:', error);
		options.callback(error, null);
	}
};
