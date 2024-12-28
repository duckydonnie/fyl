import { useAuthenticator } from "@aws-amplify/ui-react";
import BioPageMaker from './components/BioPageMaker';

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main>
      <h1>Welcome to fuckyour.life</h1>
      {user ? (
        <div>
          <p>Signed in as: {user.username}</p>
          <button onClick={signOut}>Sign out</button>
          <BioPageMaker />
        </div>
      ) : (
        <div>
          <h2>Please sign in or create an account</h2>
          <p>Sign in to create and customize your unique bio link, like "fuckyour.life/yourname".</p>
        </div>
      )}
    </main>
  );
}

export default App;
