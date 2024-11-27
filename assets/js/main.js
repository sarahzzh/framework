document.getElementById('formlogin').addEventListener('submit', async (e) => {
	e.preventDefault();
	
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
  
	// Kirim request POST untuk mendapatkan token
	const response = await fetch('http://127.0.0.1:8000/api/token/', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({ username, password })
	});
  
	if (!response.ok) {
	  const errorData = await response.json();
	  console.error('Error:', errorData);
	  alert('Username atau password salah');
	} else {
	  // Ambil token dari response
	  const data = await response.json();
	  const accessToken = data.access;
	  
	  // Simpan token di localStorage
	  localStorage.setItem('access_token', accessToken);
  
	  // Ambil detail pengguna setelah login berhasil
	  await fetchUserDetail();
	}
  });
  
  async function fetchUserDetail() {
	const response = await fetch('http://127.0.0.1:8000/api/User-detail/', {
	  headers: {
		'Authorization': `Bearer ${localStorage.getItem('access_token')}`
	  }
	});
  
	if (response.ok) {
	  const data = await response.json();
	  // Navigasi berdasarkan hak akses pengguna
	  if (data) { // Pastikan data didefinisikan
		if (data.groups && data.groups.includes('admintrainer')) {
		  window.location.href = 'dashboardadmin.html';
		} else if (data.groups && data.groups.includes('adminmember')) {
		  window.location.href = 'dashboardmember.html';
		} else if (data.is_superuser) {
		  window.location.href = 'dashboardsuper.html';
		} else {
		  window.location.href = 'index.html';
		}
  }}
  
  /*=============== SHOW HIDDEN - PASSWORD ===============*/
  const showHiddenPassword = (inputPassword, inputIcon) => {
	const input = document.getElementById(inputPassword),
		  iconEye = document.getElementById(inputIcon)
  
	iconEye.addEventListener('click', () => {
	  // Change password to text
	  if (input.type === 'password') {
		// Switch to text
		input.type = 'text'
  
		// Add icon
		iconEye.classList.add('ri-eye-line')
  
		// Remove icon
		iconEye.classList.remove('ri-eye-off-line')
	  } else {
		// Change to password
		input.type = 'password'
  
		// // Remove icon
		// iconEye.classList.remove('ri-eye-line')
  
		// // Add icon
		// iconEye.classList.add('ri-eye-off-line')
	  }
	})
  }
  
  showHiddenPassword('password', 'input-icon');
}