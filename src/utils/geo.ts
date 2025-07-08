export const getCountryCode = (): Promise<string> =>
	fetch('https://geolocation-db.com/json/')
		.then((res) => {
			if (!res.ok) throw new Error('Failed to fetch geolocation');
			return res.json();
		})
		.then((data) => {
			if (!data.country_code) throw new Error('No country code in response');
			return data.country_code as string;
		});
