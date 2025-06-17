<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Laravel API - Complete CRUD</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .form-group { margin: 10px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
        input, textarea, select { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        button { background: #007bff; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 10px; }
        button:hover { background: #0056b3; }
        button.danger { background: #dc3545; }
        button.danger:hover { background: #c82333; }
        button.warning { background: #ffc107; color: #212529; }
        button.warning:hover { background: #e0a800; }
        .response { margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 4px; white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 12px; max-height: 300px; overflow-y: auto; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .token-display { background: #e9ecef; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all; margin: 10px 0; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        h1 { color: #333; text-align: center; }
        h2 { color: #495057; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .endpoint { font-family: monospace; background: #e9ecef; padding: 4px 8px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Laravel API Test Suite - Complete CRUD</h1>
        
        <!-- Authentication Section -->
        <div class="test-section">
            <h2>🔐 Authentication Tests</h2>
            <div class="grid">
                <!-- Register -->
                <div>
                    <h3>Register New User <span class="endpoint">POST /api/auth/register</span></h3>
                    <form id="registerForm">
                        <div class="form-group">
                            <label>Name:</label>
                            <input type="text" id="registerName" value="John Doe" required>
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="registerEmail" value="john@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>Password:</label>
                            <input type="password" id="registerPassword" value="password123" required>
                        </div>
                        <div class="form-group">
                            <label>Confirm Password:</label>
                            <input type="password" id="registerPasswordConfirmation" value="password123" required>
                        </div>
                        <div class="form-group">
                            <label>Phone (optional):</label>
                            <input type="text" id="registerPhone" value="+1234567890">
                        </div>
                        <button type="submit">Register User</button>
                    </form>
                    <div id="registerResponse" class="response" style="display: none;"></div>
                </div>

                <!-- Login -->
                <div>
                    <h3>Login User <span class="endpoint">POST /api/auth/login</span></h3>
                    <form id="loginForm">
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="loginEmail" value="john@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>Password:</label>
                            <input type="password" id="loginPassword" value="password123" required>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <div id="loginResponse" class="response" style="display: none;"></div>
                </div>
            </div>

            <!-- Token Display -->
            <div style="margin-top: 20px;">
                <label>🔑 Current Access Token:</label>
                <div class="token-display" id="tokenDisplay">No token available - please login first</div>
                <input type="hidden" id="accessToken">
            </div>

            <!-- Profile Test -->
            <div style="margin-top: 20px;">
                <h3>Get Profile <span class="endpoint">GET /api/auth/profile</span></h3>
                <button onclick="getProfile()">Get My Profile</button>
                <div id="profileResponse" class="response" style="display: none;"></div>
            </div>
        </div>

        <!-- User CRUD Section -->
        <div class="test-section">
            <h2>👥 User Management (CRUD)</h2>
            
            <!-- Get All Users -->
            <div style="margin-bottom: 30px;">
                <h3>List All Users <span class="endpoint">GET /api/users</span></h3>
                <div class="grid">
                    <div>
                        <label>Search (optional):</label>
                        <input type="text" id="searchQuery" placeholder="Search by name, email, or phone">
                    </div>
                    <div>
                        <label>Per Page:</label>
                        <select id="perPage">
                            <option value="5">5</option>
                            <option value="10" selected>10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>
                <button onclick="getAllUsers()">Get All Users</button>
                <button class="warning" onclick="getUserStats()">Get User Stats</button>
                <div id="usersResponse" class="response" style="display: none;"></div>
            </div>

            <!-- Create User -->
            <div style="margin-bottom: 30px;">
                <h3>Create New User <span class="endpoint">POST /api/users</span></h3>
                <form id="createUserForm">
                    <div class="grid">
                        <div>
                            <label>Name:</label>
                            <input type="text" id="createName" value="Jane Smith" required>
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" id="createEmail" value="jane@example.com" required>
                        </div>
                    </div>
                    <div class="grid">
                        <div>
                            <label>Password:</label>
                            <input type="password" id="createPassword" value="password123" required>
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input type="text" id="createPhone" value="+1987654321">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Role:</label>
                        <select id="createRole">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit">Create User</button>
                </form>
                <div id="createUserResponse" class="response" style="display: none;"></div>
            </div>

            <!-- Get Single User -->
            <div style="margin-bottom: 30px;">
                <h3>Get Single User <span class="endpoint">GET /api/users/{id}</span></h3>
                <div class="form-group">
                    <label>User ID:</label>
                    <input type="text" id="getUserId" placeholder="Enter user ID (copy from users list above)">
                </div>
                <button onclick="getSingleUser()">Get User</button>
                <div id="singleUserResponse" class="response" style="display: none;"></div>
            </div>

            <!-- Update User -->
            <div style="margin-bottom: 30px;">
                <h3>Update User <span class="endpoint">PUT /api/users/{id}</span></h3>
                <form id="updateUserForm">
                    <div class="form-group">
                        <label>User ID to Update:</label>
                        <input type="text" id="updateUserId" placeholder="Enter user ID" required>
                    </div>
                    <div class="grid">
                        <div>
                            <label>Name:</label>
                            <input type="text" id="updateName" value="Updated Name">
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" id="updateEmail" value="updated@example.com">
                        </div>
                    </div>
                    <div class="grid">
                        <div>
                            <label>Phone:</label>
                            <input type="text" id="updatePhone" value="+1111111111">
                        </div>
                        <div>
                            <label>Role:</label>
                            <select id="updateRole">
                                <option value="">Keep current</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>New Password (optional):</label>
                        <input type="password" id="updatePassword" placeholder="Leave empty to keep current password">
                    </div>
                    <button type="submit">Update User</button>
                </form>
                <div id="updateUserResponse" class="response" style="display: none;"></div>
            </div>

            <!-- Delete User -->
            <div style="margin-bottom: 30px;">
                <h3>Delete User <span class="endpoint">DELETE /api/users/{id}</span></h3>
                <div class="form-group">
                    <label>User ID to Delete:</label>
                    <input type="text" id="deleteUserId" placeholder="Enter user ID">
                </div>
                <button class="danger" onclick="deleteUser()">Delete User</button>
                <div id="deleteUserResponse" class="response" style="display: none;"></div>
            </div>
        </div>

        <!-- Database Test -->
        <div class="test-section">
            <h2>🗄️ Database Test</h2>
            <button onclick="testDatabase()">Test Database Connection</button>
            <div id="databaseResponse" class="response" style="display: none;"></div>
        </div>
    </div>

    <script>
        // Helper function to make API calls
        async function makeAPICall(url, method = 'GET', data = null, token = null) {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const options = {
                method: method,
                headers: headers,
            };
            
            if (data) {
                options.body = JSON.stringify(data);
            }
            
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                return { success: response.ok, data: result, status: response.status };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        // Helper to get current token
        function getCurrentToken() {
            return document.getElementById('accessToken').value;
        }

        // Helper to update token display
        function updateTokenDisplay(token) {
            document.getElementById('accessToken').value = token;
            const display = document.getElementById('tokenDisplay');
            if (token) {
                display.textContent = token;
                display.style.color = '#155724';
            } else {
                display.textContent = 'No token available - please login first';
                display.style.color = '#721c24';
            }
        }

        // Register user
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                name: document.getElementById('registerName').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value,
                password_confirmation: document.getElementById('registerPasswordConfirmation').value,
                phone: document.getElementById('registerPhone').value,
            };
            
            const result = await makeAPICall('/api/auth/register', 'POST', data);
            const responseDiv = document.getElementById('registerResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
            
            if (result.success && result.data.data && result.data.data.access_token) {
                updateTokenDisplay(result.data.data.access_token);
            }
        });

        // Login user
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value,
            };
            
            const result = await makeAPICall('/api/auth/login', 'POST', data);
            const responseDiv = document.getElementById('loginResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
            
            if (result.success && result.data.data && result.data.data.access_token) {
                updateTokenDisplay(result.data.data.access_token);
            }
        });

        // Get profile
        async function getProfile() {
            const token = getCurrentToken();
            
            if (!token) {
                alert('Please login first to get a token');
                return;
            }
            
            const result = await makeAPICall('/api/auth/profile', 'GET', null, token);
            const responseDiv = document.getElementById('profileResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
        }

        // Get all users
        async function getAllUsers() {
            const token = getCurrentToken();
            if (!token) {
                alert('Please login first');
                return;
            }
            
            const search = document.getElementById('searchQuery').value;
            const perPage = document.getElementById('perPage').value;
            
            let url = '/api/users?per_page=' + perPage;
            if (search) {
                url += '&search=' + encodeURIComponent(search);
            }
            
            const result = await makeAPICall(url, 'GET', null, token);
            const responseDiv = document.getElementById('usersResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
        }

        // Get user stats
        async function getUserStats() {
            const token = getCurrentToken();
            if (!token) {
                alert('Please login first');
                return;
            }
            
            const result = await makeAPICall('/api/users/stats', 'GET', null, token);
            const responseDiv = document.getElementById('usersResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
        }

        // Create user
        document.getElementById('createUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const token = getCurrentToken();
            if (!token) {
                alert('Please login first');
                return;
            }
            
            const data = {
                name: document.getElementById('createName').value,
                email: document.getElementById('createEmail').value,
                password: document.getElementById('createPassword').value,
                phone: document.getElementById('createPhone').value,
                role: document.getElementById('createRole').value,
            };
            
            const result = await makeAPICall('/api/users', 'POST', data, token);
            const responseDiv = document.getElementById('createUserResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
        });

        // Get single user
        async function getSingleUser() {
            const token = getCurrentToken();
            const userId = document.getElementById('getUserId').value;
            
            if (!token) {
                alert('Please login first');
                return;
            }
            
            if (!userId) {
                alert('Please enter a user ID');
                return;
            }
            
            const result = await makeAPICall(`/api/users/${userId}`, 'GET', null, token);
            const responseDiv = document.getElementById('singleUserResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
        }

        // Update user
        document.getElementById('updateUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const token = getCurrentToken();
            const userId = document.getElementById('updateUserId').value;
            
            if (!token) {
                alert('Please login first');
                return;
            }
            
            if (!userId) {
                alert('Please enter a user ID');
                return;
            }
            
            const data = {};
            
            const name = document.getElementById('updateName').value;
            const email = document.getElementById('updateEmail').value;
            const phone = document.getElementById('updatePhone').value;
            const role = document.getElementById('updateRole').value;
            const password = document.getElementById('updatePassword').value;
            
            if (name) data.name = name;
            if (email) data.email = email;
            if (phone) data.phone = phone;
            if (role) data.role = role;
            if (password) data.password = password;
            
            const result = await makeAPICall(`/api/users/${userId}`, 'PUT', data, token);
            const responseDiv = document.getElementById('updateUserResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
        });

        // Delete user
        async function deleteUser() {
            const token = getCurrentToken();
            const userId = document.getElementById('deleteUserId').value;
            
            if (!token) {
                alert('Please login first');
                return;
            }
            
            if (!userId) {
                alert('Please enter a user ID');
                return;
            }
            
            if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                return;
            }
            
            const result = await makeAPICall(`/api/users/${userId}`, 'DELETE', null, token);
            const responseDiv = document.getElementById('deleteUserResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
        }

        // Test database
        async function testDatabase() {
            const result = await makeAPICall('/api/test-db', 'GET');
            const responseDiv = document.getElementById('databaseResponse');
            
            responseDiv.style.display = 'block';
            responseDiv.className = 'response ' + (result.success ? 'success' : 'error');
            responseDiv.textContent = JSON.stringify(result, null, 2);
        }
    </script>
</body>
</html>