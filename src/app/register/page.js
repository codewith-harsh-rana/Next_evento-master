"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", image: null });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] }); // Store file object
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    if (form.image) formData.append("image", form.image); // Attach file

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      Swal.fire("Success!", "User registered successfully.", "success").then(() => {
        router.push("/login");
      });
    } else {
      Swal.fire("Error", data.error, "error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
          <input type="file" name="image" accept="image/*" onChange={handleChange} style={styles.fileInput} />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f4f4" },
  card: { backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", textAlign: "center", width: "400px" },
  title: { fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "10px" },
  input: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  fileInput: { marginBottom: "15px" },
  button: { backgroundColor: "#007bff", color: "white", padding: "10px", borderRadius: "5px", border: "none", fontWeight: "bold", cursor: "pointer", width: "100%" },
};
