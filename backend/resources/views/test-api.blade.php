<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Laravel API</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .form-group { margin: 10px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 3px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .response { margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 3px; white-space: pre-wrap; font-family: monospace; }
        .error { background: #f8d7da; color: #721c24; }
        .success { background: #d4edda; color: #155724; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Laravel API Test Page</h1>
        
        <!-- Test 1: Register User -->
        <div class="test-section">
            <h2>Test 1: Register New User</h2>
            <form id="registerForm">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" id="registerName" value="Test User" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="registerEmail" value="test@example.com" required>
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
                    <input type="text" id="registerPhone" value="1234567890">
                </div>
                <button type="submit">Register User</button>
            </form>
            <div id="registerResponse" class="response" style="display: none;"></div>
        </div>

        <!-- Test 2: Login User -->
        <div class="test-section">
            <h2>Test 2: Login User</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="loginEmail" value="test@example.com" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" id="loginPassword" value="password123" required>
                </div>
                <button type="submit">Login</button>
            </form>
            <div id="loginResponse" class="response" style="display: none;"></div>
        </div>

        <!-- Test 3: Get Profile -->
        <div class="test-section">
            <h2>Test 3: Get User Profile</h2>
            <div class="form-group">
                <label>Access Token (from login):</label>
                <input type="text" id="accessToken" placeholder="Paste token from login response">
            </div>
            <button onclick="getProfile()">Get Profile</button>
            <div id="profileResponse" class="response" style="display: none;"></div>
        </div>

        <!-- Test 4: Test Database -->
        <div class="test-section">
            <h2>Test 4: Database Connection</h2>
            <button onclick="testDatabase()">Test Database</button>
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
            
            // If successful, save the token for later use
            if (result.success && result.data.data && result.data.data.access_token) {
                document.getElementById('accessToken').value = result.data.data.access_token;
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
            
            // If successful, save the token for later use
            if (result.success && result.data.data && result.data.data.access_token) {
                document.getElementById('accessToken').value = result.data.data.access_token;
            }
        });

        // Get profile
        async function getProfile() {
            const token = document.getElementById('accessToken').value;
            
            if (!token) {
                alert('Please login first to get a token, or paste a token manually');
                return;
            }
            
            const result = await makeAPICall('/api/auth/profile', 'GET', null, token);
            const responseDiv = document.getElementById('profileResponse');
            
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