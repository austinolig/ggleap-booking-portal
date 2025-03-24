"use client";

import { useState } from "react";

export default function AuthForm() {
  const [showForm, setShowForm] = useState("");

  return (
    <div className="flex justify-center gap-4">
      <button onClick={() => setShowForm("login")}>Login</button>
      <button onClick={() => setShowForm("create account")}>
        Create Account
      </button>

      {showForm !== "" && (
        <div className="fixed flex flex-col gap-4 bg-background p-4 rounded-lg border-1">
          <div className="flex gap-4 border-1 p-2 rounded-md">
            <button onClick={() => setShowForm("login")}>Login</button>
            <button onClick={() => setShowForm("create account")}>
              Create Account
            </button>
          </div>
          {showForm === "login" && (
            <>
              <p className="font-bold">Login</p>
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Password" />
              <button>Login</button>
              <button onClick={() => setShowForm("")}>Back</button>
            </>
          )}
          {showForm === "create account" && (
            <>
              <p className="font-bold">Create Account</p>
              <input type="text" placeholder="Username" />
              <input type="password" placeholder="Password" />
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
              <input type="text" placeholder="Student Email" />
              <input type="text" placeholder="Student ID" />
              <input type="text" placeholder="Date of Birth" />
              <input type="text" placeholder="Discord ID" />
              <button>Create Account</button>
              <button onClick={() => setShowForm("")}>Back</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
