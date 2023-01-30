//firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import {
    getDatabase,
    set, update,
    ref, get,
    child, remove,
    push,
    onValue
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from
    "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

//my modules imports
import { firebaseConfig } from './firebase.js';
import { createRegisterLoginForm, createLogOutIcon } from './register_form.js';
import { createCategoryForm } from './createCategoryForm.js';

// Initialize Firebase, database, authentication
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

//user register functionality

const registerNewUser = (e) => {
    e.preventDefault();

    const user_email = document.getElementById('user_email').value;
    const user_paswd = document.getElementById('user_paswd').value;

    createUserWithEmailAndPassword(auth, user_email, user_paswd)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;

            const loginTime = new Date()
            set(ref(database, 'users/' + user.uid), {
                email: user_email,
                role: "simple_user",
                timestamp: `${loginTime}`
            });
            console.log('New User created!');
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}


//Login existing User
const loginUser = (e) => {
    e.preventDefault();

    const user_email = document.getElementById('user_email').value;
    const user_paswd = document.getElementById('user_paswd').value;

    signInWithEmailAndPassword(auth, user_email, user_paswd)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const loginTime = new Date()
            update(ref(database, 'users/' + user.uid), {
                timestamp: loginTime

            });
            console.log("Login successful!");
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}


//user status functionality
const user = auth.currentUser;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid)
        //jei prisijunges, uzkraunas atsijungimo mygtuka
        createLogOutIcon();
        document.getElementById('signOut').addEventListener('click', logOut);
        //kokia userio role
        get(ref(database, 'users/' + user.uid))
            .then((snapshot) => {
                const userData = snapshot.val();
                //jei user yra admin
                if (userData.role === 'admin') {
                    console.log(userData.role);
                    //rodyk kategorijos ivedimo forma
                    createCategoryForm();
                    const addCategory = (e) => {
                        e.preventDefault();
                        const category_name = document.getElementById('category_name').value;
                        console.log(category_name)

                        set(ref(database, "categories/" + category_name), {
                            name: category_name
                        })

                            .then(console.log(`saved ${category_name}`))
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                    document.getElementById('category').addEventListener('click', addCategory);

                    //rodyk kategoriju lentele
 
                    onValue(ref(database, "categories/"), (snapshot) => {
                        let categories = snapshot.val()
                       
                        let cat_table = document.getElementById('table');                     
                        cat_table.innerHTML = "";

                        for (let c in categories) {
                            let cat_tr = document.createElement("tr");
                            let cat_td = document.createElement("td")
                            cat_td.innerText = c

                            let category_td = document.createElement("td")
                            let cat_del = document.createElement("button")
                            cat_del.classList = "m-1 btn btn-danger btn-sm admin-button"
                            cat_del.textContent = "DELETE"
                            category_td.appendChild(cat_del)

                            // delete category
                            function deleteCategory() {
                                remove(ref(database, "categories/" + c))
                                console.log("Category deleted successfully");
                            }

                            cat_del.parentNode.addEventListener("click", deleteCategory)
                            cat_tr.appendChild(cat_td)
                            cat_tr.appendChild(category_td)                            
                            cat_table.appendChild(cat_tr)
                        }
                    })
                } else {
                    console.log("paprastas useris");

                }
            })
            .catch((error) => {
                console.log(error);
            });



    } else {
        //jei atsijunges, rodome prisijungimo forma
        createRegisterLoginForm();
        document.getElementById('user_register').addEventListener('click', registerNewUser);
        document.getElementById('user_login').addEventListener('click', loginUser);
    }
});

//sign-out
const logOut = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log('Sign-out successful!')
    }).catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}
