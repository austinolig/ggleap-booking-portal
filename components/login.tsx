import React from "react";

interface User {
  Email: string;
  FirstName: string;
  LastName: string;
  Username: string;
  Uuid: string;
  // GroupUuid:  "998e51c1-577e-4845-b469-473c60f63bff" (player group?)
}

interface UserResponse {
  User: User;
}

async function login(
  username: string,
  password: string
): Promise<UserResponse | null> {
  const centerUuid = "50dd0be4-13eb-4db3-94b3-09e3062fa2d9";

  try {
    const response = await fetch(
      "https://api.ggleap.com/production/authorization/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gg-client": "DynamicCenterPagesWeb 0.1",
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
          CenterUuid: centerUuid,
        }),
      }
    );
    const data = (await response.json()) as UserResponse;
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Login() {
  const data = await login("username", "password");

  if (!data?.User) {
    return <p className="text-red-500">Not logged in.</p>;
  }

  return (
    <div className="p-4 border-1">
      <p className="font-bold">User Details</p>
      <p>
        {data.User.Username} ({data.User.Uuid})
      </p>
      <p>
        {data.User.FirstName} {data.User.LastName}
      </p>
      <p>{data.User.Email}</p>
    </div>
  );
}
