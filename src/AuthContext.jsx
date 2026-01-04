import { createContext, useContext, useState, useEffect } from "react";

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
    if(respObj.success && respObj.token) {
      setToken(respObj.token);
      setLocation("TABLET");
    } else {
      throw Error("Did not receive a successful response from signup API");
    }
  }

  const authenticate = async () => {
    if(token) {
      // do stuff
      const resp = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const respObj = await resp.json();
      console.log("auth respObj: ", respObj);
      if(respObj.success) {
        setLocation("TUNNEL");
      } else {
        throw Error("Authentication GET request failed!");
      }
    } else {
      throw Error("No token in state!");
    }
  }

  //useEffect(authenticate, [token]);
  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
