document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

function loadProducts() {
    fetch("https://fake-api-vq1l.onrender.com/posts", {
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3LCJlbWFpbCI6ImsubW90dGExQHV0cC5lZHUuY28iLCJpYXQiOjE3MjY1Mzk1MzksImV4cCI6MTc0MzgxOTUzOX0.BbInZYzsYAxBdO078C3Q-dIh5zPWtq6eUw6KMYE1-Rc"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const list = document.getElementById("list");
        list.innerHTML = '';

        data.forEach(product => {
            const images = JSON.parse(product.images) || [];

            const myhtml = `
                <div class="card" style="width: 18rem; margin: 10px;">
                    <img src="${images[0] || 'default-image.jpg'}" class="card-img-top" alt="..." >
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">Valor: ${product.value}</p>
                        <a href="#" class="btn btn-warning edit-btn" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#editModal">Editar</a>
                        <a href="#" class="btn btn-danger delete-btn" data-id="${product.id}">Eliminar</a>
                    </div>
                </div
            `;

            const il = document.createElement("li");
            il.innerHTML = myhtml;
            list.appendChild(il);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEditClick);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteClick);
        });
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
    });
}


function handleEditClick(event) {
    event.preventDefault();
    const id = event.target.getAttribute('data-id');
    
    fetch(`https://fake-api-vq1l.onrender.com/posts/${id}`, {
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3LCJlbWFpbCI6ImsubW90dGExQHV0cC5lZHUuY28iLCJpYXQiOjE3MjY1Mzk1MzksImV4cCI6MTc0MzgxOTUzOX0.BbInZYzsYAxBdO078C3Q-dIh5zPWtq6eUw6KMYE1-Rc"
        }
    })
    .then(response => response.json())
    .then(product => {
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductTitle').value = product.title;
        document.getElementById('editProductDescription').value = product.description;
        document.getElementById('editProductValue').value = product.value;
        document.getElementById('editProductImage').value = JSON.parse(product.images)[0] || '';
    })
    .catch(error => {
        console.error('Error al cargar los datos del producto:', error);
    });
}

document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const id = document.getElementById('editProductId').value;
    const title = document.getElementById('editProductTitle').value;
    const description = document.getElementById('editProductDescription').value;
    const value = parseFloat(document.getElementById('editProductValue').value);
    const image = document.getElementById('editProductImage').value;

    const body = JSON.stringify({
        title: title,
        description: description,
        value: value,
        images: [image]
    });

    console.log("Datos enviados para actualizar:", body);

    fetch(`https://fake-api-vq1l.onrender.com/posts/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3LCJlbWFpbCI6ImsubW90dGExQHV0cC5lZHUuY28iLCJpYXQiOjE3MjY1Mzk1MzksImV4cCI6MTc0MzgxOTUzOX0.BbInZYzsYAxBdO078C3Q-dIh5zPWtq6eUw6KMYE1-Rc"
        },
        body: body
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (data) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
            loadProducts();  // Recargar los productos después de actualizar
        } else {
            alert('Error al guardar cambios');
        }
    })
    .catch(error => {
        console.error('Error al actualizar el producto:', error);
    });
});

function handleDeleteClick(event) {
    event.preventDefault();
    const id = event.target.getAttribute('data-id');

    console.log('ID del producto a eliminar:', id);

    fetch(`https://fake-api-vq1l.onrender.com/posts/${id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3LCJlbWFpbCI6ImsubW90dGExQHV0cC5lZHUuY28iLCJpYXQiOjE3MjY1Mzk1MzksImV4cCI6MTc0MzgxOTUzOX0.BbInZYzsYAxBdO078C3Q-dIh5zPWtq6eUw6KMYE1-Rc"
        }
    })
    .then(response => {
        if (response.ok) {
            // Eliminar el producto del DOM
            event.target.closest('.card').parentElement.remove();
        } else {
            alert('Error al eliminar el producto');
        }
    })
    .catch(error => {
        console.error('Error al eliminar el producto:', error);
    });
}

// Agregar la funcionalidad para crear productos
document.getElementById('createProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('productTitle').value;
    const description = document.getElementById('productDescription').value;
    const value = parseFloat(document.getElementById('productValue').value);
    const image = document.getElementById('productImage').value;

    const body = JSON.stringify({
        title: title,
        description: description,
        value: value,
        images: [image]
    });

    console.log("Datos enviados para crear:", body);

    fetch('https://fake-api-vq1l.onrender.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3LCJlbWFpbCI6ImsubW90dGExQHV0cC5lZHUuY28iLCJpYXQiOjE3MjY1Mzk1MzksImV4cCI6MTc0MzgxOTUzOX0.BbInZYzsYAxBdO078C3Q-dIh5zPWtq6eUw6KMYE1-Rc"
        },
        body: body
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (data) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('createProductModal'));
            modal.hide();
            loadProducts();  // Recargar los productos después de crear
        } else {
            alert('Error al crear el producto');
        }
    })
    .catch(error => {
        console.error('Error al crear el producto:', error);
    });
});

