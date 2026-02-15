"use client";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import LoadingComp from "../loadingComp";
import { TUserContext, UserContext } from "../UserContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useContext<TUserContext>(UserContext as any);
  return loading ? (
    <LoadingComp className="flex items-center justify-center h-screen" />
  ) : (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <form
        className="bg-white rounded-md flex flex-col gap-4 min-[401px]:w-[400px] w-screen max-[400px]:mx-12 px-10 py-10"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          axios
            .post("/api/login", {
              identifier,
              password,
            })
            .then((res) => {
              alert("Signed In");
              setCookie("token", res.data.token);
              setCookie("BACToken", res.data.BACToken);
              setUser(res.data.user);
              router.push("/home");
            })
            .catch((err) => {
              setError(err.response.data);
            })
            .finally(() => setLoading(false));
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="text-[2rem] bg-(--brandColor) text-white w-fit h-fit font-bold p-2 px-6 rounded-lg">
            <h1>T</h1>
          </div>
          <div className="text-center">
            <h1 className="text-[1.2rem] font-medium">
              Welcome To TransParent
            </h1>
            <p className="text-(--secondaryText)">
              Sign in to your teacher account
            </p>
          </div>
        </div>
        {error && (
          <h1 className="text-[1.2rem] text-red-500 font-medium">{error}</h1>
        )}
        <div className="flex flex-col w-full">
          <label
            htmlFor="sis-identifier"
            className="text-[1.1rem] font-medium text-(--secondaryText)"
          >
            SIS Identifier
          </label>
          <input
            type="text"
            id="sis-identifier"
            placeholder="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value as string)}
            className="border border-(--borderColor) px-4 py-1 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="sis-password"
            className="text-[1.1rem] font-medium text-(--secondaryText)"
          >
            SIS Password
          </label>
          <input
            type="password"
            id="sis-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value as string)}
            className="border border-(--borderColor) px-4 py-1 rounded-md"
          />
        </div>
        <button className="button">LogIn</button>
      </form>
    </div>
  );
}
