const createCategoryForm = () => {

    //info for admin
    const infoForAdmin = document.createElement('div');
    infoForAdmin.innerText = "You are the ADMIN - the person who manages this page ...";
    infoForAdmin.classList.add("my-3", "navbar", "navbar-light", "bg-light");
    
    const place = document.getElementById('root');
    const formCategory = document.createElement('form');
    const categoryInput = document.createElement('input');
    categoryInput.classList.add("form-control", "my-3");
    categoryInput.placeholder = "Enter new Category..."
    categoryInput.type = 'text';
    categoryInput.id = 'category_name';
    const categoryBtn = document.createElement('button');
    categoryBtn.type = 'submit';
    categoryBtn.id ="category";
    categoryBtn.innerText= "Insert";
    categoryBtn.classList.add("btn", "btn-secondary");

    place.appendChild(infoForAdmin);
    formCategory.appendChild(categoryInput);
    formCategory.appendChild(categoryBtn);
    place.appendChild(formCategory);

    let category_table = document.createElement('table');
    category_table.id = 'table';
    place.appendChild(category_table);
}

export { createCategoryForm }