import { removeToken } from "@/lib/authenticate";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  function logout() {
    removeToken();
    router.push("/login");
  }

  return (
    <>
      <h2>Vehicle UI</h2>
      <p>A front end for our secured Vehicles API.</p>
      <p>
        <Link href="/login">Log in</Link> to continue.
      </p>
      <p>
        <button onClick={logout}>Logout</button>
      </p>
      <p>
        <Link href="/vehicles">View the vehicles.</Link>
      </p>
    </>
  );
}
