import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./ProfilePage.css";

function ProfilePage() {
  const { currentUser, changePassword } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load profile from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setName(data.name || currentUser.displayName || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPincode(data.pincode || "");
        } else {
          setName(currentUser.displayName || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        name,
        email: currentUser.email,
        phone,
        address,
        city,
        state,
        pincode,
      });

      alert("✅ Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Something went wrong.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await changePassword(newPassword);

      alert("✅ Password changed successfully!");

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);

      alert(
        "For security reasons, please log out and log in again before changing your password."
      );
    }
  };

  // Redirect after all hooks have been called
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="profile-page">
      <h1>👤 My Profile</h1>

      <form onSubmit={handleSave}>
        <div>
          <label>Full Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            value={currentUser.email || ""}
            readOnly
            className="readonly-input"
          />
        </div>

        <div>
          <label>Phone</label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label>Address</label>

          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label>City</label>

          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
          />
        </div>

        <div>
          <label>State</label>

          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Enter your state"
          />
        </div>

        <div>
          <label>Pincode</label>

          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter your pincode"
          />
        </div>

        <button type="submit" className="save-profile-btn">
          Save Profile
        </button>
      </form>

      <hr />

      <div className="password-section">
        <h2>🔐 Change Password</h2>

        <div>
          <label>New Password</label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label>Confirm Password</label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="button"
          onClick={handlePasswordChange}
          className="change-password-btn"
        >
          Change Password
        </button>
      </div>
    </section>
  );
}

export default ProfilePage;