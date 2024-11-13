const apiUrl = 'https://jsonplaceholder.typicode.com/users'; // API endpoint
let localData = []; // Local copy of the fetched data

document.getElementById('fetchData').addEventListener('click', fetchData);
document.getElementById('toggleAddData').addEventListener('click', toggleAddForm);
document.getElementById('addUserForm').addEventListener('submit', addData);

function fetchData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            localData = data; 
            renderTable(localData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function toggleAddForm() {
    const formContainer = document.getElementById('addUserFormContainer');
    if (formContainer.style.display === 'none') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
    }
}

// Add a new user to the local data
function addData(event) {
    event.preventDefault(); // Prevent form submission

    // Get values from the input fields
    const username = document.getElementById('username').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (username && name && email) {
        const newUser = {
            id: localData.length + 1, // Simulate a new unique ID
            username: username,
            name: name,
            email: email
        };
        localData.push(newUser);
        renderTable(localData);

        // Clear the input fields after adding
        document.getElementById('username').value = '';
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';

        // Hide the form after submission
        document.getElementById('addUserFormContainer').style.display = 'none';
    } else {
        alert('Please fill out all fields.');
    }
}

// Update user data by turning the row into editable inputs
function updateUser(id) {
    const row = document.querySelector(`#row-${id}`);
    const user = localData.find(user => user.id === id);
    
    if (!row) return;

    // Replace the table cells with input fields
    row.innerHTML = `
        <td>${user.id}</td>
        <td><input type="text" id="edit-username-${id}" value="${user.username}"></td>
        <td><input type="text" id="edit-name-${id}" value="${user.name}"></td>
        <td><input type="email" id="edit-email-${id}" value="${user.email}"></td>
        <td>
            <button class="save-btn" onclick="saveUser(${id})">Save</button>
            <button class="delete-btn" onclick="deleteUser(${id})">Delete</button>
        </td>
    `;
}

function saveUser(id) {
    const username = document.getElementById(`edit-username-${id}`).value;
    const name = document.getElementById(`edit-name-${id}`).value;
    const email = document.getElementById(`edit-email-${id}`).value;

    if (username && name && email) {
        const userIndex = localData.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            // Update the user data in the localData array
            localData[userIndex] = { id, username, name, email };
            renderTable(localData); // Re-render the table with updated data
        }
    } else {
        alert('Please fill out all fields before saving.');
    }
}

function deleteUser(id) {
    localData = localData.filter(user => user.id !== id);
    renderTable(localData);
}

function renderTable(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; 

    data.forEach(user => {
        const row = `<tr id="row-${user.id}">
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="update-btn" onclick="updateUser(${user.id})">Update</button>
                                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                            </div>
                        </td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}
