import { Outlet } from "react-router-dom";
import { Navbar } from "./components";
import { ReferralTracker } from "./utils/referralTracker";

function App() {
  return (
    <>
      <ReferralTracker />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default App;
