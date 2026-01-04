import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  const signup = async (formData) => {
    const username = formData.get("name");
    console.log("username: ", username);
    const resp = await fetch(API + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: "666"
      })
    });
    const respObj = await resp.json();
    console.log("resp Obj: ", respObj);
    if(respObj.success && respObj.token) {
      setToken(respObj.token);
      console.log("i set the token");
    } else {
      throw Error("Did not receive a successful response from signup API");
    }
  }

  // TODO: authenticate

  const value = { location, signup };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
