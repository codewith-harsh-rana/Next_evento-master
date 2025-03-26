"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
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
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

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

      // Extract unique countries
      const uniqueCountries = [...new Set(data.map((addr) => addr.country))];
      setCountries(uniqueCountries);
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

  const handleCountryChange = (event) => {
    const selected = event.target.value;
    setSelectedCountry(selected);
    if (selected) {
      setFilteredAddresses(addresses.filter((addr) => addr.country === selected));
    } else {
      setFilteredAddresses(addresses);
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        Your Addresses
      </Typography>

      {/* Country Filter Dropdown */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Country</InputLabel>
        <Select value={selectedCountry} onChange={handleCountryChange}>
          <MenuItem value="">All Countries</MenuItem>
          {countries.map((country, index) => (
            <MenuItem key={index} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filteredAddresses.length === 0 ? (
        <Typography color="textSecondary" align="center">
          No addresses found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredAddresses.map((address) => (
            <Grid item xs={12} sm={6} md={4} key={address.id}>
              <AddressCard
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {editingAddress && (
        <EditModal
          address={editingAddress}
          onClose={() => setEditingAddress(null)}
          onSave={handleUpdate}
        />
      )}
    </Box>
  );
}

function AddressCard({ address, onEdit, onDelete }) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: "10px",
        position: "relative",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {address.street}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {address.city}, {address.state}, {address.country}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Zip Code: {address.zipCode}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton color="primary" onClick={() => onEdit(address)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => onDelete(address.id)}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
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
