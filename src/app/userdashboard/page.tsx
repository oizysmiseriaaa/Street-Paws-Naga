"use client";

import { useEffect, useState, useCallback } from "react";
import Logo from "../../../components/Logo";
import { useRouter } from "next/navigation";
const API_URL = "https://streetpaws-4.onrender.com";

interface User {
  username: string;
  role: string;
  user_id: number;
}

interface Animal {
  animal_id: number;
  name: string;
  type: string;
  status: string;
  breed?: string;
  age_months: number;
  sex: string;
  description?: string;
  photo?: string;
  image_url?: string;
}

interface UserRequest {
  id: number;
  animal_id: number;
  animal_name: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  reason?: string;
  experience?: string;
  request_date: string;
  status: "pending" | "approved" | "rejected" | "Pending" | "Approved" | "Rejected";
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [requests, setRequests] = useState<UserRequest[]>([]); // 🆕 User's adoption requests
  const [stats, setStats] = useState({
    totalAnimals: 0,
    adopted: 0,
    fostered: 0,
    available: 0,
    pendingRequests: 0 // 🆕
  });
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // 🆕 Notification states
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: "success" | "error"; timestamp: string }>
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

// Adoption Form (unchanged)
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [adoptionForm, setAdoptionForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    reason: "",
    experience: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // 🆕 Clear form function
  const handleClearForm = () => {
    setAdoptionForm({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      reason: "",
      experience: ""
    });
    setSubmitError("");
  };

  // Auth
  useEffect(() => {
    const savedUser = localStorage.getItem("streetpaws_user");
    const token = localStorage.getItem("token");
    if (!savedUser || !token) {
      router.push("/register");
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [router]);

  // Load data when user is ready
useEffect(() => {
  if (!user) return;

  loadAnimals();
  loadUserRequests(); // ✅ load once only

}, [user]);

  // 🆕 Polling for real-time updates (every 10 seconds)
  const startPolling = useCallback(() => {
    const interval = setInterval(() => {
      loadUserRequests();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  // 🆕 Load user's adoption requests
const loadUserRequests = async () => {
  try {
    setRequestsLoading(true);
    const token = localStorage.getItem("token")!;

    const res = await fetch(`${API_URL}/adoption/requests`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    console.log("🔥 ALL REQUESTS:", data);

    if (res.ok) {
      // ✅ TEMP: remove filter to test
      setRequests(data);

      // ✅ update stats
      setStats(prev => ({
        ...prev,
        pendingRequests: data.filter(
          (r: UserRequest) => r.status.toLowerCase() === "pending"
        ).length
      }));
    }
  } catch (error) {
    console.error("Load requests error:", error);
  } finally {
    setRequestsLoading(false);
  }
};

  // 🆕 Check for status changes and show notifications
  const checkForStatusUpdates = (currentRequests: UserRequest[]) => {
    const seenRequestIds = new Set();
    
    currentRequests.forEach(request => {
      if (seenRequestIds.has(request.id.toString())) return;
      
      if (request.status === "approved" || request.status === "Approved") {
        addNotification(
          `${request.animal_name} adoption ${request.status}! 🎉`,
          "success"
        );
      } else if (request.status === "rejected" || request.status === "Rejected") {
        addNotification(
          `Sorry, ${request.animal_name} adoption was ${request.status}. 😔`,
          "error"
        );
      }
    });
  };

  // 🆕 Add notification
  const addNotification = (message: string, type: "success" | "error") => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification = {
      id,
      message,
      type,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep last 5
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Load animals (unchanged)
  const loadAnimals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token")!;

      const res = await fetch(`${API_URL}/animals`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      let animalsList: any[] = [];

      if (res.ok) {
        const data = await res.json();
        animalsList = Array.isArray(data) ? data : [data];
      } else {
        const fallbackRes = await fetch(`${API_URL}/animals/available`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          animalsList = data.animals || [];
        }
      }

const normalized = animalsList.map((a: any) => {
        let imageUrl: string | undefined = undefined;
        if (a.photo) {
          // Support both local and remote images
          if (a.photo.startsWith('/uploads/')) {
            // Use relative path - works on all devices since Next.js serves public/uploads/
            imageUrl = a.photo;
          } else if (a.photo.startsWith('http')) {
            imageUrl = a.photo;
          } else {
            imageUrl = `${API_URL}${a.photo}`;
          }
        }
        return {
          animal_id: a.animal_id,
          name: a.name,
          type: a.type,
          status: a.status,
          breed: a.breed,
          age_months: a.age_months,
          sex: a.sex,
          description: a.description,
          photo: a.photo,
          image_url: imageUrl
        };
      });

      setAnimals(normalized);
      calculateStats(normalized);
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (animalsList: any[]) => {
    const total = animalsList.length;
    const adopted = animalsList.filter((a: any) => a.status === "Adopted").length;
    const fostered = animalsList.filter((a: any) => a.status === "Fostered").length;
    const available = animalsList.filter((a: any) => a.status === "Available").length;
    
 setStats({ 
  totalAnimals: total, 
  adopted, 
  fostered, 
  available,
  pendingRequests: stats.pendingRequests // keep existing
});
  };

  // Adoption form handlers (unchanged)
  const handleAdoptClick = (animal: any) => {
    if (animal.status !== "Available") {
      alert(`${animal.name} is not available for adoption right now.`);
      return;
    }
    setSelectedAnimal(animal);
    setAdoptionForm({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      reason: "",
      experience: ""
    });
    setShowAdoptionModal(true);
  };

const handleSubmitAdoption = async () => {
    if (!selectedAnimal) {
      setSubmitError("No animal selected");
      return;
    }
    
    if (!adoptionForm.fullName.trim() || !adoptionForm.email.trim() || !adoptionForm.phone.trim()) {
      setSubmitError("Name, email, and phone are required");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token")!;
      
      const formData = {
animal_id: selectedAnimal.animal_id,
        full_name: adoptionForm.fullName,
        email: adoptionForm.email,
        phone: adoptionForm.phone,
        address: adoptionForm.address,
        reason: adoptionForm.reason,
        experience: adoptionForm.experience
      };

      const response = await fetch(`${API_URL}/adoption`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        addNotification("Adoption request submitted successfully!", "success");
        setShowAdoptionModal(false);
        setSelectedAnimal(null);
        await loadAnimals();
       setStats(prev => ({
  ...prev,
  pendingRequests: prev.pendingRequests + 1
}));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Adoption error:", error);
      setSubmitError(error.message || "Failed to submit adoption request");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/register");
  };
  // 🆕 Clear History Function
const handleClearHistory = async () => {
  if (!confirm('Are you sure you want to clear all your adoption request history? This action cannot be undone.')) {
    return;
  }

  try {
    setRequestsLoading(true);
    const token = localStorage.getItem("token")!;

    // Clear requests on backend
    const response = await fetch(`${API_URL}/adoption/requests/clear`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      // Clear local state
      setRequests([]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingRequests: 0
      }));
      
      addNotification("🗑️ Adoption request history cleared!", "success");
    } else {
      throw new Error('Failed to clear history');
    }
  } catch (error) {
    console.error("Clear history error:", error);
    addNotification("Failed to clear history. Please try again.", "error");
  } finally {
    setRequestsLoading(false);
  }
};

  if (!user) return <div className="p-8 text-center">Loading...</div>;
  if (loading) return <div className="p-8 text-center">Loading animals...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6 relative">
      {/* 🆕 Notifications Toast */}
      {notifications.length > 0 && (
  <div className="fixed top-20 left-1/2 transform -translate-x-1/2 space-y-2 z-50">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-2xl shadow-xl border max-w-sm animate-slide-in-right ${
                notification.type === "success"
                  ? "bg-green-500 text-white border-green-400"
                  : "bg-red-500 text-white border-red-400"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">
                  {notification.type === "success" ? "🎉" : "📢"}
                </span>
                <div className="flex-1">
                  <p className="font-bold">{notification.message}</p>
                  <p className="text-xs opacity-90 mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

{/* Header */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg mb-8 flex justify-between items-center">
        <Logo showText={true} size="md" />
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Street Paws  User Dashboard
          </h1>
          <p className="text-gray-700">
            Welcome <strong>{user.username}</strong> ({user.role})
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* 🆕 Notifications Badge */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-3 rounded-2xl font-bold transition-all ${
              stats.pendingRequests > 0
                ? "bg-orange-500 text-white hover:bg-orange-600 animate-pulse"
                : "bg-orange-400 text-white hover:bg-orange-500"
            }`}
          >
            📋 Requests ({stats.pendingRequests})
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🆕 My Requests Section */}
{showNotifications && (
  <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl mb-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 className="text-2xl font-bold text-orange-700">📋 My Adoption Requests</h2>
      <div className="flex gap-3">
        {/* 🆕 Clear History Button */}
        <button 
          onClick={handleClearHistory}
          disabled={requestsLoading || requests.length === 0}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          🗑️ Clear History
        </button>
        <button 
          onClick={() => setShowNotifications(false)}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          disabled={requestsLoading}
        >
          ✕
        </button>
      </div>
    </div>
    
    {requestsLoading ? (
      <div className="text-center py-12 text-gray-500">Loading requests...</div>
    ) : requests.length === 0 ? (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-3">📭</p>
        <p>No adoption requests yet.</p>
        <p className="text-sm">Submit a request to see your applications here!</p>
      </div>
    ) : (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    )}
  </div>
)}
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total" value={stats.totalAnimals} icon="📊" />
        <StatCard title="Available" value={stats.available} icon="🔍" />
        <StatCard title="Adopted" value={stats.adopted} icon="🏠" />
        <StatCard title="Fostered" value={stats.fostered} icon="❤️" />
        <StatCard title="My Requests" value={stats.pendingRequests} icon="📋" color="orange" />
      </div>

      {/* Rest of your existing code remains the same... */}
      {/* Animals Grid */}
      <div className="bg-white/70 backdrop-blur p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Available Animals ({animals.length})
        </h2>

        {animals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">🐾</p>
            <p>No animals available right now.</p>
            <p className="text-sm">Check back soon for new furry friends!</p>
          </div>
        ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-5xl mx-auto">
{animals.map((animal) => {
              const animalId = animal.animal_id;
              return (
                <AnimalCard 
                  key={animalId}
                  animal={animal}
                  onAdopt={() => handleAdoptClick(animal)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Adoption Modal - UPDATED WITH CLEAR BUTTON */}
      {showAdoptionModal && selectedAnimal && (
        <AdoptionModal
          animal={selectedAnimal}
          formData={adoptionForm}
          onChange={setAdoptionForm}
          onSubmit={handleSubmitAdoption}
          onClear={handleClearForm} // 🆕 Pass clear function
          onClose={() => {
            setShowAdoptionModal(false);
            setSelectedAnimal(null);
          }}
          loading={submitLoading}
          error={submitError}
        />
      )}
    </div>
  );
}

// 🆕 Updated AdoptionModal Component with Clear Button
const AdoptionModal = ({
  animal,
  formData,
  onChange,
  onSubmit,
  onClear, // 🆕 New prop
  onClose,
  loading,
  error
}: {
  animal: any;
  formData: any;
  onChange: any;
  onSubmit: any;
  onClear: any; // 🆕 New prop
  onClose: any;
  loading: boolean;
  error: string;
}) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-700">
          ❤️ Adopt {animal.name}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
          ✕
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="text-center p-4 bg-emerald-50 rounded-xl">
          <p className="font-bold text-lg mb-1">{animal.name}</p>
          <StatusBadge status={animal.status} />
          <p className="text-sm text-gray-600 mt-1">{animal.type} • {animal.age_months} months</p>
        </div>

        <Input 
          label="Full Name *" 
          value={formData.fullName} 
          onChange={(v: string) => onChange({...formData, fullName: v})}
          required
        />
        <Input 
          label="Email *" 
          type="email"
          value={formData.email} 
          onChange={(v: string) => onChange({...formData, email: v})}
          required
        />
        <Input 
          label="Phone *" 
          type="tel"
          value={formData.phone} 
          onChange={(v: string) => onChange({...formData, phone: v})}
          required
        />
        <Input 
          label="Address" 
          value={formData.address} 
          onChange={(v: string) => onChange({...formData, address: v})}
        />
        <Textarea 
          label="Why do you want to adopt?" 
          value={formData.reason} 
          onChange={(v: string) => onChange({...formData, reason: v})}
          placeholder="Tell us why you'd be a great home for this pet..."
        />
        <Textarea 
          label="Pet experience" 
          value={formData.experience} 
          onChange={(v: string) => onChange({...formData, experience: v})}
          placeholder="Any experience with pets? Other animals at home?"
        />
      </div>

      {/* 🆕 Updated buttons with Clear button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onClear}
          disabled={loading}
          className="flex-1 py-3 px-6 border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl font-semibold text-gray-700 hover:text-gray-900 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          🗑️ Clear Form
        </button>
        <div className="flex flex-1 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// 🆕 New RequestCard Component (unchanged)
const RequestCard = ({ request }: { request: UserRequest }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-white to-emerald-50/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-xl text-gray-800 mb-1">{request.animal_name}</h4>
          <p className="text-blue-600 font-semibold">{request.full_name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(request.status)}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Date</p>
          <p className="font-semibold">{new Date(request.request_date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Status</p>
          <p className="font-semibold">{request.status}</p>
        </div>
      </div>

      {request.reason && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-sm text-gray-700 italic">"{request.reason}"</p>
        </div>
      )}
    </div>
  );
};

// Rest of the components remain unchanged...
const AnimalCard = ({ animal, onAdopt }: { animal: any; onAdopt: () => void }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-emerald-100 hover:border-emerald-200">
<div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-2xl p-2">
  {animal.image_url ? (
    <img
      src={animal.image_url}
      alt={animal.name}
      className="max-w-full max-h-full object-contain rounded-xl"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
        (e.target as HTMLImageElement).outerHTML = '<div class="flex items-center justify-center w-full h-full text-5xl">🐾</div>';
      }}
    />
  ) : (
    <span className="text-5xl">🐾</span>
  )}
</div>
    
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{animal.name}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-semibold">{animal.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Breed:</span>
          <span className="font-semibold">{animal.breed || "Mixed"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Age:</span>
          <span className="font-semibold">{animal.age_months} months</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sex:</span>
          <span className="font-semibold">{animal.sex}</span>
        </div>
      </div>

      <StatusBadge status={animal.status} />
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {animal.description || "No description available."}
        </p>
        
        <button
          onClick={onAdopt}
          disabled={animal.status !== "Available"}
          className={`w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all ${
            animal.status === "Available"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {animal.status === "Available" ? "❤️ I Want to Adopt!" : "Not Available"}
        </button>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon }: any) => (
  <div className="p-6 rounded-2xl shadow-lg border border-emerald-100 bg-white hover:shadow-xl transition-all">
    <div className="text-3xl mb-3">{icon}</div>
    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
    <div className="text-3xl font-bold text-emerald-600 mt-2">{value}</div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
    status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
    status === 'Adopted' ? 'bg-green-100 text-green-800' :
    status === 'Fostered' ? 'bg-blue-100 text-blue-800' :
    'bg-gray-100 text-gray-800'
  }`}>
    {status}
  </span>
);

const Input = ({ label, value, onChange, type = "text", required = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
      placeholder={`Enter ${label.toLowerCase().replace(' *', '')}...`}
      disabled={false}
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      rows={3}
      className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-vertical"
      placeholder={placeholder}
    />
  </div>
);

