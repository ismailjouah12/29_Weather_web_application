export default function Login (){

    return (<>
    <form  className="">
        <h3 className="">Login</h3>
        <div className="">
            <label>Username</label>
            <input
                type="text"
                className=""
                placeholder="Enter username"
            />
        </div>
        <div className="">
            <label>Password</label>
            <input
                type="password"
                className=""
                placeholder="Enter password"
            />
        </div>
        <div className="">
            <button type="submit" className="">
                Login
            </button>
        </div>              


    </form>
    
    </>)
}