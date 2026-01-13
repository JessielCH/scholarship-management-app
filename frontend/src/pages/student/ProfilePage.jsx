import { useState } from "react";
import { User, CreditCard, Save, MapPin, School } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const ProfilePage = () => {
  const [loading, setLoading] = useState(false);

  // Simulating Data from Database
  const [formData, setFormData] = useState({
    fullName: "Jessiel JD",
    email: "jessiel@uce.edu.ec",
    dni: "1723456789",
    faculty: "Engineering Faculty",
    address: "Av. Universitaria, Quito",
    phone: "0991234567",
    bankName: "Banco Pichincha",
    accountNumber: "2200123123",
    accountType: "Savings",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(
        "✅ Data Updated! This information will be used for your Contract."
      );
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-uce-blue rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          JD
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
          <p className="text-gray-500">
            Manage your personal information for contract generation.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* SECTION 1: ACADEMIC INFO (Read Only) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <School className="text-uce-blue" size={20} /> Academic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Usamos disabled para simular que esto viene de la U y no se toca */}
            <div className="opacity-70 pointer-events-none">
              <Input
                label="Full Name (Official)"
                value={formData.fullName}
                disabled
              />
            </div>
            <div className="opacity-70 pointer-events-none">
              <Input
                label="Institutional Email"
                value={formData.email}
                disabled
              />
            </div>
            <div className="opacity-70 pointer-events-none">
              <Input
                label="Faculty / Career"
                value={formData.faculty}
                disabled
              />
            </div>
            <Input
              label="National ID (DNI)"
              value={formData.dni}
              onChange={(e) =>
                setFormData({ ...formData, dni: e.target.value })
              }
            />
          </div>
        </div>

        {/* SECTION 2: CONTACT INFO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-uce-blue" size={20} /> Contact Details
          </h3>
          <div className="space-y-4">
            <Input
              label="Current Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* SECTION 3: BANK INFO (Crucial for Payments) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-uce-gold" size={20} /> Bank Information
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-white">
                <option>Banco Pichincha</option>
                <option>Banco del Pacífico</option>
                <option>Produbanco</option>
              </select>
            </div>
            <Input
              label="Account Number"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-white">
                <option>Savings (Ahorros)</option>
                <option>Checking (Corriente)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="md:col-span-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-auto px-8"
          >
            <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};
