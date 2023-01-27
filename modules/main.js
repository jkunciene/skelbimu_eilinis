//firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import {
    getDatabase,
    set, update,
    ref, get,
    child, remove,
    push
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
                        push(ref(database, 'categories'), {
                            name: category_name,
                        })
                            .then(console.log(`saved ${category_name}`))
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                    document.getElementById('category').addEventListener('click', addCategory);
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
