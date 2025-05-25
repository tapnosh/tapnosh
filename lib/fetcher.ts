const BASE_URL = "https://noshtap.onrender.com/";

export const fetcher = (url: string, options?: RequestInit) =>
  fetch(`${BASE_URL}${url}`, options).then((res) => {
    if (!res.ok) throw new Error("An error occurred while fetching the data.");
    return res.json();
  });
