const setItem = (key: string, value: object) => {
	try {
		const valueToStore = JSON.stringify(value);
		localStorage.setItem(key, valueToStore);
	} catch (error) {
		console.error(`Error setting item in localStorage: ${error}`);
	}
};

const getItem = (key: string) => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (error) {
		console.error(`Error getting item from localStorage: ${error}`);
		return null;
	}
};

const removeItem = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing item from localStorage: ${error}`);
	}
};

export { setItem, getItem, removeItem };
