function authenticateInsuranceProvider() {
    const usernameInput = document.querySelector('input[name="name"]');
    const passwordInput = document.querySelector('input[name="password"]');

    const username = usernameInput.value;
    const password = passwordInput.value;

    const apiUrl = `http://127.0.0.1:5000/api/v1/user/insurance/${username}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Authentication failed');
        }
    })
    .then(data => {
        const customersDataEncoded = encodeURIComponent(JSON.stringify(data));
        const customersDataUrl = `customers_data.html?customersData=${customersDataEncoded}`;
        window.open(customersDataUrl, '_blank');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}