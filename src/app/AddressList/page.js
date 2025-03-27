"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function AddressList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAddress, setEditingAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    fetchAddresses();
  }, [session, status]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/address");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data);
      setFilteredAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete address");
      setAddresses((prev) => prev.filter((address) => address.id !== id));
      setFilteredAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (address) => setEditingAddress(address);

  const handleUpdate = async (updatedAddress) => {
    try {
      const res = await fetch("/api/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAddress),
      });
      if (!res.ok) throw new Error("Failed to update address");
      const data = await res.json();
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === data.id ? data : addr))
      );
      setFilteredAddresses((prev) =>
        prev.map((addr) => (addr.id === data.id ? data : addr))
      );
      setEditingAddress(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAddresses(
      addresses.filter(
        (addr) =>
          addr.street.toLowerCase().includes(query) ||
          addr.city.toLowerCase().includes(query) ||
          addr.state.toLowerCase().includes(query) ||
          addr.country.toLowerCase().includes(query) ||
          addr.zipCode.toLowerCase().includes(query)
      )
    );
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper sx={{ maxWidth: "1200px", mx: "auto", p: 4, fontWeight: "bold" }}>
      <TextField
        fullWidth
        label="Search By Country or City"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 4 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Street</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Country</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Zip Code</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAddresses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ fontWeight: "bold" }}>
                  No addresses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAddresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell>{address.street}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.country}</TableCell>
                  <TableCell>{address.zipCode}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(address)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(address.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {editingAddress && (
        <EditModal
          address={editingAddress}
          onClose={() => setEditingAddress(null)}
          onSave={handleUpdate}
        />
      )}
    </Paper>
  );
}

function EditModal({ address, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...address });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Address</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            margin="dense"
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            margin="dense"
          />
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            margin="dense"
          />
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            margin="dense"
          />
          <TextField
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            margin="dense"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
