const createRegisterLoginForm = () => {

    document.getElementById('root').innerHTML = `
    <form>
            <div class="mb-3">
                <label for="user_email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="user_email" aria-describedby="emailHelp">               
            </div>
            <div class="mb-3">
                <label for="user_passwd" class="form-label">Password</label>
                <input type="password" class="form-control" id="user_paswd">
            </div>
            <button type="submit" class="btn btn-outline-secondary" id="user_register">Register</button>
            <button type="submit" class="btn btn-outline-info btn-lg" id="user_login">Login</button>
        </form>
    `
    
}

const createLogOutIcon = () => {
    document.getElementById('root').innerHTML = `
            <div class="row">           
                <div class=" offset-11 col-1">
                    <i class="bi bi-door-open" id="signOut"></i>
                </div>           
             </div>
    `
   
}
export { createRegisterLoginForm, createLogOutIcon }