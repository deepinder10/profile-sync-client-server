const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Network response was not ok');
  }
  return response.json();
};

const get = async (path: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`GET request failed: ${path}`, error);
    throw error;
  }
};

const post = async (path: string, data: object) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`POST request failed: ${path}`, error);
    throw error;
  }
}

const patch = async (path: string, data: object) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`PATCH request failed: ${path}`, error);
    throw error;
  }
};

export { get, post, patch };
