/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	const { url, data = {}, method = 'GET', callback = () => {} } = options;
	let requestUrl = url;
	let body = null;

	if (method === 'GET') {
		if (Object.keys(data).length) {
			const params = Object.entries(data)
				.map(
					([key, value]) =>
						`${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
				)
				.join('&');
			requestUrl += (requestUrl.includes('?') ? '&' : '?') + params;
		}
	} else {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => formData.append(key, value));
		body = formData;
	}

	const xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.onload = () => {
		callback(null, xhr.response);
	};
	xhr.onerror = () => {
		callback(new Error('Network error'), null);
	};

	try {
		xhr.open(method, requestUrl);
		xhr.send(body);
	} catch (e) {
		callback(e);
	}
};
