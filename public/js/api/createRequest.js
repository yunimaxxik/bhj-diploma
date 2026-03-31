/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	const { url, data = {}, method = 'GET', callback = () => {} } = options;
	let requestUrl = url;
	if (method === 'GET' && Object.keys(data).length) {
		const params = Object.entries(data)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
			)
			.join('&');
		requestUrl += (requestUrl.includes('?') ? '&' : '?') + params;
	}

	const xhr = new XMLHttpRequest();
	try {
		xhr.open(method, requestUrl);
		xhr.responseType = 'json';

		let body = null;
		if (method !== 'GET') {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) =>
				formData.append(key, value),
			);
			body = formData;
		}

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				callback(null, xhr.response);
			} else {
				callback(new Error(xhr.statusText), null);
			}
		};

		xhr.onerror = () => {
			callback(new Error('Network error'), null);
		};

		xhr.send(body);
	} catch (e) {
		callback(e);
	}
};
