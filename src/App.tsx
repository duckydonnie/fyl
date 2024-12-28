import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import BioPageMaker from "./components/BioPageMaker"; // Adjust the path if needed

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main>
      <h1>Welcome to fuckyour.life</h1>
      {user ? (
        <div>
          <p>Signed in as: {user.username}</p>
          <button onClick={signOut}>Sign out</button>
          {/* Display the BioPageMaker for signed-in users */}
          <BioPageMaker />
        </div>
      ) : (
        <div>
          <h2>Please sign in or create an account</h2>
          <p>Sign in to create and customize your unique bio link, like "fuckyour.life/yourname".</p>
          {/* Add a sign-in or sign-up component if needed */}
        </div>
      )}
    </main>
  );
}

export default App;
