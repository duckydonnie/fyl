import React, { useState } from "react";
import { Auth, Storage, API } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

const BioPageMaker = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userUID, setUserUID] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ [key: string]: string }>({});
  const [accentColor, setAccentColor] = useState("#000000");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sign-up handler
  const handleSignUp = async () => {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: { email },
      });
      alert("Sign-up successful! Check your email for a verification link.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Sign-in handler
  const handleSignIn = async () => {
    try {
      const user = await Auth.signIn(username, password);
      setIsAuthenticated(true);
      setUserUID(user.attributes.sub); // Fetch unique user ID
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // File upload handler
  const handleFileUpload = async (file: File, path: string) => {
    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage("File size exceeds 3MB.");
      return null;
    }

    try {
      const result = await Storage.put(path, file, {
        contentType: file.type,
        level: "protected",
      });
      return result.key;
    } catch (error) {
      setErrorMessage("Error uploading file.");
      throw error;
    }
  };

  // Profile submission handler
  const handleSubmit = async () => {
    try {
      let profilePictureKey = "";
      let backgroundImageKey = "";

      // Handle profile picture upload
      if (profilePicture) {
        profilePictureKey = await handleFileUpload(profilePicture, `profile-pictures/${uuidv4()}`);
      }

      // Handle background image upload
      if (backgroundImage) {
        backgroundImageKey = await handleFileUpload(backgroundImage, `background-images/${uuidv4()}`);
      }

      // User data object
      const userData = {
        uid: userUID,
        username,
        displayName,
        bio,
        accentColor,
        profilePicture: profilePictureKey,
        backgroundImage: backgroundImageKey,
        socialLinks,
      };

      // Update user data via API
      await API.post("yourAPIName", "/users", { body: userData });
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setErrorMessage("Error updating profile. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Sign In or Create an Account</h2>
        <form>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleSignUp}>
            Sign Up
          </button>
          <button type="button" onClick={handleSignIn}>
            Sign In
          </button>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Customize Your Bio Page</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form>
        <div>
          <label>Display Name (Change once a day):</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
          />
        </div>

        <div>
          <label>Bio (100 characters max):</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter a short bio"
            maxLength={100}
          />
        </div>

        <div>
          <label>Profile Picture (max 3MB):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label>Background Image (max 3MB):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBackgroundImage(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label>Accent Color:</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
          />
        </div>

        <div>
          <label>Social Links:</label>
          {["Discord", "YouTube", "Twitter", "Website"].map((platform) => (
            <div key={platform}>
              <input
                type="text"
                placeholder={`Enter ${platform} link`}
                value={socialLinks[platform] || ""}
                onChange={(e) =>
                  setSocialLinks({
                    ...socialLinks,
                    [platform]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>

        <button type="button" onClick={handleSubmit}>
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default BioPageMaker;
