import React from "react";
import Link from "next/link";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import { LogoutAction } from "@/app/profile/LogoutAction";

const Header = () => {
  const user = GetDataFromToken();

  return (
    <div className="flex align-middle px-6 py-3 justify-between w-full bg-slate-800 text-white">
      <p>
        <Link href="/">Bidoo</Link>
      </p>
      <nav>
        <ul className="flex space-x-3">
          {user ? (
            <>
              <li>
                <Link href="/profile">{user.email}</Link>
              </li>
              <li>
                <Link href="/listitem">Add Item</Link>
              </li>
              <li>
                <form action={LogoutAction}>
                  <button type="submit">Logout</button>
                </form>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
