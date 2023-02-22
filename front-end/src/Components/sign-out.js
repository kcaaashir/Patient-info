function SignOut() {
    localStorage.removeItem("token");
    window.location.href = "/";
  
}

export default SignOut;