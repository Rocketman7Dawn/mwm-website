import Header from "../../../components/Header";
import SignInForm from "./SignInForm";

const BG_SRC = "/Client%20Login.png"; // "Client Login.png" in /public

// This is now a SERVER component that receives searchParams
export default function SignInPage({ searchParams }) {
  const callbackUrl = searchParams?.callbackUrl || "/";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${BG_SRC})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
      }}
    >
      {/* top nav, same as rest of site */}
      <Header active="login" />

      <main className="login-wrap">
        <div className="login-positioner">
          {/* Title */}
          <div className="login-title--grid">
            <h1 className="login-title">Client Login</h1>
          </div>

          {/* Client form gets callbackUrl as a prop */}
          <SignInForm callbackUrl={callbackUrl} />
        </div>
      </main>
    </div>
  );
}
