import "./App.css";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { storage ,db} from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore methods

function App() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const imageRef = ref(storage, `images/${image.name}`);
    
    try {
      // Upload image to Firebase Storage
      await uploadBytes(imageRef, image);

      // Get image download URL
      const imageUrl = await getDownloadURL(imageRef);
      setUrl(imageUrl);

      // Add image details to Firestore
      const docRef = await addDoc(collection(db, "images"), {
        imageUrl,
        description,
        username,
      });

      console.log("Image uploaded with ID: ", docRef.id);

      // Reset form fields
      setImage(null);
      setDescription("");
      setUsername("");
    } catch (error) {
      console.error("Error uploading image: ", error.message);
    }
  };

  return (
    <div className="App">
      <Avatar src={url} sx={{ width: 150, height: 150 }} />
      <input type="file" onChange={handleImageChange} />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
