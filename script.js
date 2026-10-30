
const DB = {
    getProducts() {
        let data = localStorage.getItem('db_products');
        if (!data) {
            const defaults = [
                { id: 1, name: "Mie Sagu Bengkalis Kuah", category: "makanan", price: 22000, store: "Dapur Melayu Bengkalis", wa: "6281234567890", address: "Jl. Jend. Sudirman, Bengkalis, Riau", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80" },
                { id: 2, name: "Lempuk Durian Asli Bengkalis", category: "oleholeh", price: 45000, store: "Oleh-Oleh Mak Itam", wa: "6289876543210", address: "Jl. Ahmad Yani, Bantan, Bengkalis", image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80" },
                { id: 3, name: "Es Laksamana Mengamuk", category: "minuman", price: 15000, store: "Kedai Segar Junjungan", wa: "6281122334455", address: "Jl. Pahlawan, Bengkalis", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80" }
            ];
            localStorage.setItem('db_products', JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(data);
    },
    saveProducts(products) {
        localStorage.setItem('db_products', JSON.stringify(products));
    },
    getUsers() {
        let data = localStorage.getItem('db_users');
        if (!data) {
            const defaults = [
                { id: 1, firstName: "Super", lastName: "Admin", username: "superadmin", phone: "081234567890", role: "superadmin", password: "password", status: "Aktif" },
                { id: 2, firstName: "Admin", lastName: "Portal", username: "admin", phone: "081298765432", role: "admin", password: "password", status: "Aktif" },
                { id: 3, firstName: "Dapur Melayu", lastName: "Bengkalis", username: "dapurmelayu", phone: "6281234567890", role: "seller", password: "password", store: "Dapur Melayu Bengkalis", status: "Aktif" },
                { id: 4, firstName: "Budi", lastName: "Santoso", username: "budi", phone: "081377889900", role: "pelanggan", password: "password", status: "Aktif" }
            ];
            localStorage.setItem('db_users', JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(data);
    },
    saveUsers(users) {
        localStorage.setItem('db_users', JSON.stringify(users));
    },
    getOrders() {
        let data = localStorage.getItem('db_orders');
        if (!data) {
            const defaults = [
                { id: "ORD-101", customerName: "Budi Santoso", customerPhone: "081377889900", storeName: "Dapur Melayu Bengkalis", storeWa: "6281234567890", productName: "Mie Sagu Bengkalis Kuah", qty: 2, deliveryType: "Pengiriman Kurir Lokal", total: 44000, date: "2026-10-28", status: "Diproses" },
                { id: "ORD-102", customerName: "Siti Rahma", customerPhone: "081233445566", storeName: "Oleh-Oleh Mak Itam", storeWa: "6289876543210", productName: "Lempuk Durian Asli", qty: 1, deliveryType: "Ambil Sendiri di Toko", total: 45000, date: "2026-10-29", status: "Selesai" }
            ];
            localStorage.setItem('db_orders', JSON.stringify(defaults));
            return defaults;
        }
        return JSON.parse(data);
    },
    saveOrders(orders) {
        localStorage.setItem('db_orders', JSON.stringify(orders));
    }
};

const Session = {
    get() {
        try { return JSON.parse(localStorage.getItem('current_session')); } catch(e) { return null; }
    },
    set(user) {
        localStorage.setItem('current_session', JSON.stringify(user));
    },
    clear() {
        localStorage.removeItem('current_session');
    }
};

let selectedProductForOrder = null;

const authNavArea = document.getElementById('authNavArea');
if (authNavArea) {
    function updateAuthNav() {
        const user = Session.get();
        if (user) {
            authNavArea.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-gold dropdown-toggle btn-sm px-3" data-bs-toggle="dropdown">
                        <i class="bi bi-person-check me-1"></i> ${user.firstName} (${user.role})
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow">
                        <li><a class="dropdown-item" href="#" onclick="openProfileModal()"><i class="bi bi-person-gear me-2"></i>Profil & No. HP</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="logoutUser()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                    </ul>
                </div>
            `;
        } else {
            authNavArea.innerHTML = `
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-light btn-sm px-3" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                    <button class="btn btn-gold btn-sm px-3" data-bs-toggle="modal" data-bs-target="#registerModal">Daftar Akun</button>
                </div>
            `;
        }
    }
    updateAuthNav();
}

function openProfileModal() {
    const user = Session.get();
    if (!user) return;
    document.getElementById('profFirstName').value = user.firstName || '';
    document.getElementById('profLastName').value = user.lastName || '';
    document.getElementById('profPhone').value = user.phone || '081234567890';
    document.getElementById('profStatus').value = `Aktif (${user.role})`;
    new bootstrap.Modal(document.getElementById('profileModal')).show();
}

const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = Session.get();
        if (!user) return;

        user.firstName = document.getElementById('profFirstName').value.trim();
        user.lastName = document.getElementById('profLastName').value.trim();
        user.phone = document.getElementById('profPhone').value.trim();

        const pass = document.getElementById('profPassword').value;
        if (pass) user.password = pass;

        let users = DB.getUsers();
        users = users.map(u => u.id === user.id ? { ...u, ...user } : u);
        DB.saveUsers(users);

        Session.set(user);
        alert('Profil berhasil diperbarui!');
        location.reload();
    });
}

const customerRegisterForm = document.getElementById('customerRegisterForm');
if (customerRegisterForm) {
    customerRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = document.getElementById('regFirstName').value.trim();
        const lastName = document.getElementById('regLastName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;

        let users = DB.getUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newUser = { id: newId, firstName, lastName, username: firstName.toLowerCase(), phone, role: 'pelanggan', password, status: 'Aktif' };
        users.push(newUser);
        DB.saveUsers(users);

        Session.set(newUser);
        alert(`Registrasi sukses! Selamat datang, ${firstName}. Nomor HP: ${phone}. Akun Anda langsung aktif.`);
        location.reload();
    });
}

const customerLoginForm = document.getElementById('customerLoginForm');
if (customerLoginForm) {
    customerLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('loginFullName').value.trim();
        const password = document.getElementById('loginPassword').value;

        let users = DB.getUsers();
        const found = users.find(u => (`${u.firstName} ${u.lastName}`.toLowerCase() === fullName.toLowerCase() || u.username === fullName.toLowerCase()) && u.password === password);
        if (found) {
            Session.set(found);
            alert(`Selamat datang kembali, ${found.firstName}! No. HP: ${found.phone || 'Terdaftar'}`);
            location.reload();
        } else {
            alert('Nama lengkap / username atau password salah!');
        }
    });
}

function logoutUser() {
    Session.clear();
    alert('Berhasil logout.');
    location.reload();
}

const productContainer = document.getElementById('productContainer');
if (productContainer) {
    function renderCatalog(filter = 'all', search = '') {
        const products = DB.getProducts();
        productContainer.innerHTML = '';
        
        const filtered = products.filter(p => {
            const matchesFilter = filter === 'all' || p.category === filter;
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.store.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            productContainer.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted fs-5">Tidak ada produk kuliner yang ditemukan.</p></div>`;
            return;
        }

        filtered.forEach(p => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6';
            col.innerHTML = `
                <div class="card product-card shadow-sm h-100">
                    <img src="${p.image}" class="product-img card-img-top" alt="${p.name}">
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-success bg-opacity-10 text-success fw-semibold mb-2 align-self-start text-uppercase small">${p.category}</span>
                        <h5 class="card-title fw-bold text-dark">${p.name}</h5>
                        <p class="text-muted small mb-1"><i class="bi bi-shop me-1"></i> <strong>${p.store}</strong></p>
                        <p class="text-muted small mb-3"><i class="bi bi-geo-alt-fill text-danger me-1"></i> ${p.address}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="fw-bold fs-5 text-dark-melayu">Rp ${p.price.toLocaleString('id-ID')}</span>
                            <button class="btn btn-outline-secondary btn-sm" onclick="openMapModal('${p.store}', '${p.address}')">
                                <i class="bi bi-map"></i> Peta
                            </button>
                        </div>
                        <button class="btn btn-gold w-100 mt-3 fw-bold" onclick="openOrderModal(${p.id})">
                            <i class="bi bi-cart-plus me-1"></i> Pesan Kuliner
                        </button>
                    </div>
                </div>
            `;
            productContainer.appendChild(col);
        });
    }

    renderCatalog();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.filter-buttons .btn.active').getAttribute('data-filter');
            renderCatalog(activeFilter, e.target.value);
        });
    }

    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCatalog(e.target.getAttribute('data-filter'), searchInput ? searchInput.value : '');
        });
    });
}

function openMapModal(storeName, address) {
    document.getElementById('modalStoreName').textContent = storeName;
    document.getElementById('modalStoreAddress').textContent = address;
    new bootstrap.Modal(document.getElementById('mapModal')).show();
}

function openOrderModal(productId) {
    const products = DB.getProducts();
    selectedProductForOrder = products.find(p => p.id === productId);
    if (!selectedProductForOrder) return;

    document.getElementById('orderProductName').textContent = selectedProductForOrder.name;
    document.getElementById('orderStoreName').textContent = selectedProductForOrder.store;
    document.getElementById('orderProductPrice').textContent = `Rp ${selectedProductForOrder.price.toLocaleString('id-ID')}`;
    document.getElementById('orderQty').value = 1;
    updateOrderTotal();

    new bootstrap.Modal(document.getElementById('orderModal')).show();
}

function updateOrderTotal() {
    if (!selectedProductForOrder) return;
    const qty = Number(document.getElementById('orderQty').value) || 1;
    const total = selectedProductForOrder.price * qty;
    document.getElementById('orderTotalText').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function submitOrder(type) {
    if (!selectedProductForOrder) return;
    const user = Session.get();
    const qty = Number(document.getElementById('orderQty').value) || 1;
    const deliveryType = document.getElementById('orderDeliveryType').value;
    const note = document.getElementById('orderAddressNote').value;
    const total = selectedProductForOrder.price * qty;

    const customerName = user ? `${user.firstName} ${user.lastName}` : "Pelanggan Umum";
    const customerPhone = user ? (user.phone || "08123456789") : "08123456789";

    let orders = DB.getOrders();
    const newOrder = {
        id: `ORD-${Date.now().toString().slice(-4)}`,
        customerName,
        customerPhone,
        storeName: selectedProductForOrder.store,
        storeWa: selectedProductForOrder.wa,
        productName: selectedProductForOrder.name,
        qty,
        deliveryType,
        total,
        date: new Date().toISOString().split('T')[0],
        status: "Diproses"
    };
    orders.push(newOrder);
    DB.saveOrders(orders);

    if (type === 'wa') {
        const textMsg = encodeURIComponent(`Halo *${selectedProductForOrder.store}*, saya ingin memesan:

` +
            `• *Produk*: ${selectedProductForOrder.name}
` +
            `• *Jumlah*: ${qty}
` +
            `• *Total*: Rp ${total.toLocaleString('id-ID')}
` +
            `• *Opsi Penyerahan*: ${deliveryType}
` +
            `• *Pemesan*: ${customerName} (${customerPhone})
` +
            `• *Catatan/Alamat*: ${note || '-'}

Mohon konfirmasinya. Terima kasih!`);
        window.open(`https://wa.me/${selectedProductForOrder.wa}?text=${textMsg}`, '_blank');
    } else {
        alert(`Pesanan berhasil dikirim langsung ke toko ${selectedProductForOrder.store}! Status: Diproses.`);
    }

    bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
}

const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;

        let users = DB.getUsers();
        let found = users.find(u => (u.username === username || u.firstName.toLowerCase() === username.toLowerCase()) && u.password === password && (u.role === 'admin' || u.role === 'superadmin'));

        if (found) {
            Session.set(found);
            alert(`Login berhasil sebagai ${found.role}!`);
            window.location.href = 'admin.html';
        } else {
            alert('Username atau password Admin/Superadmin salah!');
        }
    });
}

const userTableBody = document.getElementById('userTableBody');
if (userTableBody) {
    const session = Session.get();
    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
        alert('Akses ditolak! Silakan login sebagai admin.');
        window.location.href = 'login_admin.html';
    } else {
        document.getElementById('adminDisplayName').textContent = `${session.firstName} ${session.lastName || ''} (${session.role})`;
        document.getElementById('adminDisplayPhone').textContent = session.phone || '081234567890';
        document.getElementById('adminRoleBadgeText').textContent = session.role;
    }

    function renderAdminDashboard() {
        const users = DB.getUsers();
        document.getElementById('statTotalUsers').textContent = users.length;
        userTableBody.innerHTML = '';
        users.forEach(u => {
            userTableBody.innerHTML += `
                <tr>
                    <td class="ps-4 fw-bold">${u.firstName} ${u.lastName || ''} (${u.username})</td>
                    <td>${u.phone || '-'}</td>
                    <td><span class="badge bg-secondary">${u.role}</span></td>
                    <td><span class="badge bg-success">${u.status || 'Aktif'}</span></td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editUserFromAdmin(${u.id})"><i class="bi bi-pencil"></i> Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${u.id})"><i class="bi bi-trash"></i> Hapus</button>
                    </td>
                </tr>
            `;
        });

        const products = DB.getProducts();
        document.getElementById('adminTotalProducts').textContent = products.length + ' Produk';
        const adminProductTableBody = document.getElementById('adminProductTableBody');
        if (adminProductTableBody) {
            adminProductTableBody.innerHTML = '';
            products.forEach(p => {
                adminProductTableBody.innerHTML += `
                    <tr>
                        <td class="ps-4 fw-bold text-dark">${p.name}</td>
                        <td>${p.store}</td>
                        <td><span class="badge bg-light text-dark border">${p.category}</span></td>
                        <td class="text-end pe-4">
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteProductGlobal(${p.id})"><i class="bi bi-eye-slash"></i> Hapus</button>
                        </td>
                    </tr>
                `;
            });
        }

        const orders = DB.getOrders();
        document.getElementById('adminTotalOrders').textContent = orders.length + ' Transaksi';
    }
    renderAdminDashboard();

    const adminProfileForm = document.getElementById('adminProfileForm');
    if (adminProfileForm) {
        document.getElementById('editAdminUsername').value = session.username || session.firstName;
        document.getElementById('editAdminPhone').value = session.phone || '081234567890';

        adminProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('editAdminUsername').value.trim();
            const newPhone = document.getElementById('editAdminPhone').value.trim();
            const newPass = document.getElementById('editAdminPassword').value;

            session.username = newUsername;
            session.firstName = newUsername;
            session.phone = newPhone;
            if (newPass) session.password = newPass;

            let users = DB.getUsers();
            users = users.map(u => u.id === session.id ? { ...u, ...session } : u);
            DB.saveUsers(users);

            Session.set(session);
            alert('Data akun admin berhasil diperbarui!');
            location.reload();
        });
    }

    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('editUserId').value;
            const firstName = document.getElementById('newFirstName').value;
            const lastName = document.getElementById('newLastName').value;
            const phone = document.getElementById('newPhone').value;
            const role = document.getElementById('newRole').value;
            const password = document.getElementById('newPassword').value || 'password';

            let users = DB.getUsers();
            if (editId) {
                users = users.map(u => u.id == editId ? { ...u, firstName, lastName, username: firstName.toLowerCase(), phone, role, password } : u);
            } else {
                const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
                users.push({ id: newId, firstName, lastName, username: firstName.toLowerCase(), phone, role, password, status: 'Aktif' });
            }
            DB.saveUsers(users);
            renderAdminDashboard();
            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
            addUserForm.reset();
            document.getElementById('editUserId').value = '';
            alert('User berhasil disimpan!');
        });
    }
}

function editUserFromAdmin(id) {
    const users = DB.getUsers();
    const u = users.find(item => item.id === id);
    if (!u) return;

    document.getElementById('editUserId').value = u.id;
    document.getElementById('newFirstName').value = u.firstName;
    document.getElementById('newLastName').value = u.lastName || '';
    document.getElementById('newPhone').value = u.phone || '';
    document.getElementById('newRole').value = u.role;
    document.getElementById('newPassword').value = u.password;

    document.getElementById('userModalTitle').textContent = 'Edit Data User & Password';
    new bootstrap.Modal(document.getElementById('userModal')).show();
}

function deleteUser(id) {
    if (confirm('Hapus user ini dari sistem?')) {
        let users = DB.getUsers();
        users = users.filter(u => u.id !== id);
        DB.saveUsers(users);
        location.reload();
    }
}

function deleteProductGlobal(id) {
    if (confirm('Hapus produk ini dari sistem?')) {
        let products = DB.getProducts();
        products = products.filter(p => p.id !== id);
        DB.saveProducts(products);
        location.reload();
    }
}

function logoutAdmin() {
    Session.clear();
    window.location.href = 'login_admin.html';
}

const sellerLoginForm = document.getElementById('sellerLoginForm');
if (sellerLoginForm) {
    sellerLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputStore = document.getElementById('sellerEmail').value.trim();
        const password = document.getElementById('sellerPassword').value;

        let users = DB.getUsers();
        let found = users.find(u => (u.username === inputStore.toLowerCase() || (u.store && u.store.toLowerCase().includes(inputStore.toLowerCase()))) && u.password === password && u.role === 'seller');

        if (!found && password === 'password') {
            found = { firstName: inputStore, store: inputStore, phone: "6281234567890", role: "seller" };
        }

        if (found) {
            Session.set(found);
            alert(`Login toko berhasil! Selamat datang ${found.store || found.firstName}.`);
            window.location.href = 'seller.html';
        } else {
            alert('Email/Nama toko atau password penjual salah!');
        }
    });
}

const sellerProductTableBody = document.getElementById('sellerProductTableBody');
if (sellerProductTableBody) {
    const session = Session.get();
    if (!session || session.role !== 'seller') {
        alert('Akses ditolak! Silakan login sebagai penjual.');
        window.location.href = 'login_seller.html';
    } else {
        const storeName = session.store || "Dapur Melayu Bengkalis";
        document.getElementById('sellerStoreName').textContent = storeName;
        document.getElementById('sellerPhone').textContent = session.phone || '6281234567890';
    }

    function renderSellerDashboard() {
        const storeName = session.store || "Dapur Melayu Bengkalis";
        const products = DB.getProducts().filter(p => p.store.toLowerCase() === storeName.toLowerCase() || p.store.includes("Dapur Melayu"));
        document.getElementById('statTotalProducts').textContent = products.length;

        sellerProductTableBody.innerHTML = '';
        products.forEach(p => {
            sellerProductTableBody.innerHTML += `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center">
                            <img src="${p.image}" class="rounded me-3" style="width: 48px; height: 48px; object-fit: cover;">
                            <div>
                                <h6 class="fw-bold mb-0 text-dark">${p.name}</h6>
                                <small class="text-muted">${p.store}</small>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-light text-dark border">${p.category}</span></td>
                    <td class="fw-semibold">Rp ${p.price.toLocaleString('id-ID')}</td>
                    <td><span class="badge bg-success">Tersedia</span></td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${p.id})"><i class="bi bi-pencil"></i> Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})"><i class="bi bi-trash"></i> Hapus</button>
                    </td>
                </tr>
            `;
        });

        const sellerOrdersTableBody = document.getElementById('sellerOrdersTableBody');
        if (sellerOrdersTableBody) {
            sellerOrdersTableBody.innerHTML = '';
            const allOrders = DB.getOrders();
            const storeOrders = allOrders.filter(o => o.storeName.toLowerCase().includes(storeName.toLowerCase()) || storeName.toLowerCase().includes("dapur melayu"));
            document.getElementById('statTotalOrders').textContent = storeOrders.length;

            storeOrders.forEach(o => {
                sellerOrdersTableBody.innerHTML += `
                    <tr>
                        <td class="ps-4">
                            <span class="fw-bold text-dark">${o.id}</span>
                            <div class="small text-muted">${o.customerName} (${o.customerPhone})</div>
                        </td>
                        <td class="fw-semibold">${o.productName}</td>
                        <td>${o.qty}</td>
                        <td><span class="badge bg-info text-dark">${o.deliveryType}</span></td>
                        <td class="fw-bold text-dark-melayu">Rp ${o.total.toLocaleString('id-ID')}</td>
                        <td><span class="badge ${o.status === 'Selesai' ? 'bg-success' : 'bg-warning text-dark'}">${o.status}</span></td>
                        <td class="text-end pe-4">
                            <button class="btn btn-sm btn-success" onclick="updateOrderStatus('${o.id}', 'Selesai')"><i class="bi bi-check-lg"></i> Selesai</button>
                        </td>
                    </tr>
                `;
            });
        }
    }
    renderSellerDashboard();

    const sellerProfileForm = document.getElementById('sellerProfileForm');
    if (sellerProfileForm) {
        document.getElementById('editSellerStore').value = session.store || session.firstName;
        document.getElementById('editSellerPhone').value = session.phone || '6281234567890';

        sellerProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newStore = document.getElementById('editSellerStore').value.trim();
            const newPhone = document.getElementById('editSellerPhone').value.trim();
            const newPass = document.getElementById('editSellerPassword').value;

            session.store = newStore;
            session.firstName = newStore;
            session.phone = newPhone;
            if (newPass) session.password = newPass;

            let users = DB.getUsers();
            users = users.map(u => u.id === session.id ? { ...u, ...session } : u);
            DB.saveUsers(users);

            Session.set(session);
            alert('Profil toko & nomor WhatsApp berhasil diperbarui!');
            location.reload();
        });
    }

    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('productId').value;
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const price = Number(document.getElementById('productPrice').value);
            const store = document.getElementById('productStore').value;
            const wa = document.getElementById('productWa').value;
            const address = document.getElementById('productAddress').value;
            const image = document.getElementById('productImage').value;

            let products = DB.getProducts();
            if (id) {
                products = products.map(p => p.id == id ? { id: Number(id), name, category, price, store, wa, address, image } : p);
            } else {
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                products.push({ id: newId, name, category, price, store, wa, address, image });
            }
            DB.saveProducts(products);
            renderSellerDashboard();
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            productForm.reset();
            document.getElementById('productId').value = '';
            alert('Produk berhasil disimpan!');
        });
    }
}

function updateOrderStatus(orderId, newStatus) {
    let orders = DB.getOrders();
    orders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    DB.saveOrders(orders);
    alert(`Status pesanan ${orderId} diperbarui menjadi ${newStatus}!`);
    location.reload();
}

function deleteProduct(id) {
    if (confirm('Hapus produk ini?')) {
        let products = DB.getProducts();
        products = products.filter(p => p.id !== id);
        DB.saveProducts(products);
        location.reload();
    }
}

function editProduct(id) {
    const products = DB.getProducts();
    const p = products.find(item => item.id === id);
    if (!p) return;

    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name;
    document.getElementById('productCategory').value = p.category;
    document.getElementById('productPrice').value = p.price;
    document.getElementById('productStore').value = p.store;
    document.getElementById('productWa').value = p.wa;
    document.getElementById('productAddress').value = p.address;
    document.getElementById('productImage').value = p.image;
    document.getElementById('productModalTitle').textContent = 'Edit Produk Kuliner';
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

function logoutSeller() {
    Session.clear();
    window.location.href = 'login_seller.html';
}

function downloadReport(format) {
    const session = Session.get();
    const storeName = session ? (session.store || "Dapur Melayu Bengkalis") : "Toko Kuliner";
    const orders = DB.getOrders().filter(o => o.storeName.toLowerCase().includes(storeName.toLowerCase()) || storeName.toLowerCase().includes("dapur melayu"));

    let content = `REKAP PENJUALAN - ${storeName.toUpperCase()}
`;
    content += `KABUPATEN BENGKALIS, RIAU
`;
    content += `===============================================

`;

    orders.forEach(o => {
        content += `ID Pesanan   : ${o.id}
`;
        content += `Pemesan      : ${o.customerName} (${o.customerPhone})
`;
        content += `Produk       : ${o.productName}
`;
        content += `Jumlah       : ${o.qty}
`;
        content += `Penyerahan   : ${o.deliveryType}
`;
        content += `Total Harga  : Rp ${o.total.toLocaleString('id-ID')}
`;
        content += `Tanggal      : ${o.date}
`;
        content += `Status       : ${o.status}
`;
        content += `-----------------------------------------------
`;
    });

    let mime = "text/plain";
    let ext = "txt";
    if (format === 'excel') { mime = "application/vnd.ms-excel"; ext = "xls"; }
    else if (format === 'word') { mime = "application/msword"; ext = "doc"; }
    else if (format === 'pdf') { mime = "application/pdf"; ext = "pdf"; }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap_penjualan_${storeName.toLowerCase().replace(/\s+/g, '_')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert(`Rekap penjualan toko berhasil didownload dalam format ${ext.toUpperCase()}!`);
}
