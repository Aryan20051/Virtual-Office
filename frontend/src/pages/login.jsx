import axios from "axios";

export default function Login() {
  const googleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const emailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await axios.post("http://localhost:5000/auth/login", {
      email, password
    });

    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={googleLogin}>Login with Google</button>

      <form onSubmit={emailLogin}>
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button>Login</button>
      </form>
    </div>
  );
}