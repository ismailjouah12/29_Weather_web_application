export default function SignUp() {
  return (
    <div  className="">
        <form>
            <h3 className="">Sign Up</h3>
            <div className="">
                <label>Username</label>
                <input
                    type="text"
                    className=""
                    placeholder="Enter username"
                />
            </div>
            <div className="">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                />
            </div>
            <div className="">
                <label>Phone</label>
                <input
                    type="number"
                    className=""
                    placeholder="Enter Phone number"
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
                <button type="submit" className="btn btn-primary">
                    Sign Up
                </button>
            </div>
        </form> 
    </div>
  );
}
