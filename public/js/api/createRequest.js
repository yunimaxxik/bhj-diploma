/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest();

	let requestUrl = options.url;
	if (method.toUpperCase() === 'GET' && options.data) {
		const params = Object.entries(options.data)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
			)
			.join('&');
		const separator = options.url.includes('?') ? '&' : '?';
		requestUrl = `${options.url}${separator}${params}`;
	}

	xhr.open(options.method, requestUrl);
	xhr.responseType = 'json';

	xhr.onload = () => {
		if (xhr.status >= 200 && xhr.status < 300) {
			callback(null, xhr.response);
		} else {
			const error = new Error(`Request failed with status ${xhr.status}`);
			callback(error, null);
		}
	};

	xhr.onerror = () => {
		const error = new Error('Network error');
		callback(error, null);
	};

	if (method.toUpperCase() !== 'GET' && options.data) {
		const formData = new FormData();
		Object.entries(options.data).forEach(([key, value]) => {
			formData.append(key, value);
		});
		xhr.send(formData);
	} else {
		xhr.send();
	}
};
