import React from 'react'
import { useAuth } from '../context/AuthContext';

export default function Personal() {
    const {user} = useAuth();
  return (
    <div>
      {user ? (
        <>
          <h1>{user.fullName}</h1>
          <p>Email: {user.email}</p>
          <p>Total score: {user.score}</p> 
          {/* now make changes in problem schema. should contain author id */}
          <hr style={{ margin: "2rem 0" }} />
          {/* {user.role === "admin" && <AddProblemForm />} */}
        </>
      ) : 
        <h2>Please log in to view your submissions and personal information.</h2>
      }
    </div>
  )
}
