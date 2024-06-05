import "./globals.css";
import Header from "@/components/Header";
import { GetDataFromToken } from "@/helpers/GetDataFromToken";
import Chat from "@/components/Chat";

const layout = async ({ children }) => {
  const user = await GetDataFromToken();

  return (
    <html>
      <body>
        <div className="flex flex-col h-screen justify-center items-center bg-slate-300 space-y-6">
          <Header />
          <div className="bg-slate-300 items-center justify-center grow">
            {children}
            {user?.email && <Chat username={user.email} />}
          </div>
        </div>
      </body>
    </html>
  );
};

export default layout;
