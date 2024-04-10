document.getElementById('logoutBtn').addEventListener('click', function() {
    window.location.href = 'insurance_login.html';
});

function displayCustomersData(data) {
    const container = document.getElementById('customers-data');
    container.innerHTML = ''; // Clear previous table

    const table = document.createElement('table');

    const headerRow = document.createElement('tr');
    const headers = ['Position', 'CustomerID', 'Name', 'Age', 'Gender', 'Doctor', 'BillingAmount', 'AdmissionType', 'Medication', 'TestResults', 'Status'];

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    data.forEach((customer, index) => {
        const row = document.createElement('tr');

        const positionCell = document.createElement('td');
        const positionButtons = document.createElement('div');
        positionButtons.classList.add('position-buttons');

        const upButton = document.createElement('button');
        upButton.textContent = '⬆️';
        upButton.addEventListener('click', () => moveRowUp(index));
        positionButtons.appendChild(upButton);

        const downButton = document.createElement('button');
        downButton.textContent = '⬇️';
        downButton.addEventListener('click', () => moveRowDown(index));
        positionButtons.appendChild(downButton);

        positionCell.appendChild(positionButtons);
        row.appendChild(positionCell);

        for (const key in customer) {
            if (key !== 'Status') {
                const cell = document.createElement('td');
                cell.textContent = customer[key];
                row.appendChild(cell);
            } else {
                const statusCell = document.createElement('td');
                const statusSelect = document.createElement('select');
                statusSelect.addEventListener('change', () => handleStatusChange(index, statusSelect.value));

                const pendingOption = document.createElement('option');
                pendingOption.value = 'Pending';
                pendingOption.textContent = 'Pending';
                pendingOption.selected = true;
                statusSelect.appendChild(pendingOption);

                const approvedOption = document.createElement('option');
                approvedOption.value = 'Approved';
                approvedOption.textContent = 'Approved';
                statusSelect.appendChild(approvedOption);

                const rejectedOption = document.createElement('option');
                rejectedOption.value = 'Rejected';
                rejectedOption.textContent = 'Rejected';
                statusSelect.appendChild(rejectedOption);

                statusCell.appendChild(statusSelect);
                row.appendChild(statusCell);
            }
        }

        table.appendChild(row);
    });

    container.appendChild(table);
}

function moveRowUp(index) {
    const data = JSON.parse(decodeURIComponent(urlParams.get('customersData')));
    if (index > 0) {
        [data[index], data[index - 1]] = [data[index - 1], data[index]];
        const encodedData = encodeURIComponent(JSON.stringify(data));
        const customersDataUrl = `customers_data.html?customersData=${encodedData}`;
        window.location.href = customersDataUrl;
    }
}

function moveRowDown(index) {
    const data = JSON.parse(decodeURIComponent(urlParams.get('customersData')));
    if (index < data.length - 1) {
        [data[index], data[index + 1]] = [data[index + 1], data[index]];
        const encodedData = encodeURIComponent(JSON.stringify(data));
        const customersDataUrl = `customers_data.html?customersData=${encodedData}`;
        window.location.href = customersDataUrl;
    }
}

function handleStatusChange(index, newStatus) {
    const data = JSON.parse(decodeURIComponent(urlParams.get('customersData')));
    const customer = data[index];
    customer.Status = newStatus;

    if (newStatus !== 'Pending') {
        data.push(customer);
        data.splice(index, 1);
    }

    const encodedData = encodeURIComponent(JSON.stringify(data));
    const customersDataUrl = `customers_data.html?customersData=${encodedData}`;
    window.location.href = customersDataUrl;
}

const urlParams = new URLSearchParams(window.location.search);
const customersData = urlParams.get('customersData');

if (customersData) {
    const data = JSON.parse(decodeURIComponent(customersData));
    displayCustomersData(data);
}