"use client";

import { useEffect, useState } from "react";
import Logo from "../../../components/Logo";
import { useRouter } from "next/navigation";
const API_URL = "https://streetpaws-4.onrender.com";
const LOCAL_API_URL = "http://localhost:3001";

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

interface ArchiveEntry {
  id: number;
  animalId: number;
  animalName: string;
  animalType: string;
  status: "Adopted" | "Fostered";
  date: string;
  previousStatus: string;
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [stats, setStats] = useState({
    totalAnimals: 0,
    adopted: 0,
    fostered: 0,
    available: 0,
    pendingRequests: 0
  });
const [loading, setLoading] = useState(false);
const [requestsLoading, setRequestsLoading] = useState(false);
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);
  const [showArchive, setShowArchive] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: "success" | "error"; timestamp: string }>
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

// Adoption Form
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

// ✏️ Edit states
  const [updateLoading, setUpdateLoading] = useState<Record<number, boolean>>({});
  const [deleteLoading, setDeleteLoading] = useState<Record<number, boolean>>({});
  const [requestLoading, setRequestLoading] = useState<Record<number, boolean>>({});
  const [showRequests, setShowRequests] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  
  // 🖼️ Edit image states
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<string>("");

  // 🖼️ Image upload states
  const [showModal, setShowModal] = useState(false);
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    type: "",
    breed: "",
    age_months: "",
    sex: "",
    description: "",
    status: "Available",
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // 🔐 Auth
  useEffect(() => {
    const savedUser = localStorage.getItem("streetpaws_user");
    const token = localStorage.getItem("token");
    if (!savedUser || !token) {
      router.push("/register");
      return;
    }
    setUser(JSON.parse(savedUser));
    
    const savedArchive = localStorage.getItem("streetpaws_archive");
    if (savedArchive) {
      setArchive(JSON.parse(savedArchive));
    }
  }, [router]);

  // 📡 Load data
  useEffect(() => {
    if (user) {
      loadAnimals();
      loadRequests(); // 🆕 NEW
    }
  }, [user]);

  // Save archive to localStorage
  useEffect(() => {
    if (archive.length > 0) {
      localStorage.setItem("streetpaws_archive", JSON.stringify(archive));
    }
  }, [archive]);

  
  const loadAnimals = async () => {
    try {
      const token = localStorage.getItem("token")!;

      const res = await fetch(`${API_URL}/animals?ts=${Date.now()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

let animalsList: Animal[] = [];

      if (res.ok) {
        const data = await res.json();
        console.log("🔥 API DATA:", data);
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

// ✅ Added image_url mapping - support both local and remote images
      const normalized: Animal[] = animalsList.map((a) => {
        let imageUrl: string | undefined = undefined;
        if (a.photo) {
          // Check if it's a local upload (/uploads/) or remote
          if (a.photo.startsWith('/uploads/')) {
            // Use relative path - works on all devices since Next.js serves public/uploads/
            imageUrl = a.photo;
          } else if (a.photo.startsWith('http')) {
            imageUrl = a.photo;
          } else {
            // Remote server path
            imageUrl = `${API_URL}${a.photo}`;
          }
        }
console.log("🖼️ Animal:", a.name, "photo:", a.photo, "-> image_url:", imageUrl);
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
    }
  };

const loadRequests = async () => {
  try {
    const token = localStorage.getItem("token")!;
    const res = await fetch(`${API_URL}/adoption/requests`, {  // 🆕 Fixed endpoint
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    }
  } catch (error) {
    console.error("Load requests error:", error);
  }
};

const calculateStats = (animalsList: Animal[]) => {
  const total = animalsList.length;
  const adopted = animalsList.filter((a) => a.status === "Adopted").length;
  const fostered = animalsList.filter((a) => a.status === "Fostered").length;
  const available = animalsList.filter((a) => a.status === "Available").length;
  
  setStats({
    totalAnimals: total, 
    adopted, 
    fostered, 
    available,
    pendingRequests: requests.filter((r: UserRequest) => r.status === "pending").length  // 🆕 lowercase "pending"
  });
};

  // 🖼️ Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image
      if (!file.type.startsWith('image/')) {
        setSaveError("Please select an image file (JPG, PNG, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setSaveError("Image must be less than 5MB");
        return;
      }

      setNewAnimal(prev => ({ ...prev, image: file }));
      
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setSaveError("");
    }
  };

  // 🖼️ Remove image
  const removeImage = () => {
    setNewAnimal(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

const handleAddAnimal = async () => {

  if (!newAnimal.name.trim() || !newAnimal.type.trim()) {
    setSaveError("Name and Type required");
    return;
  }

  setLoading(true);
  setSaveError("");

  try {

    const token = localStorage.getItem("token")!;

    let photoPath = "";

// 🖼️ STEP 1 — Upload Image to Local Storage First
    let uploadedFilename = "";
    if (newAnimal.image) {

      setImageUploading(true);

      const formData = new FormData();
      formData.append("image", newAnimal.image);

      // Upload to local Next.js server storage
      const uploadRes = await fetch(
        `${LOCAL_API_URL}/api/upload`,
        {
          method: "POST",
          body: formData
        }
      );

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error("Image upload failed");
      }

      uploadedFilename = uploadData.filename;
      photoPath = uploadData.photo;

      console.log("🖼️ Uploaded to local storage:", photoPath);
    }

    // 🐾 STEP 2 — Create Animal
    const payload = {
      name: newAnimal.name,
      type: newAnimal.type,
      breed: newAnimal.breed || "",
      age_months: parseInt(newAnimal.age_months) || 0,
      sex: newAnimal.sex || "",
      description: newAnimal.description || "",
      photo: photoPath   // ✅ IMPORTANT
    };

    const response = await fetch(
      `${API_URL}/animals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {

const errorText = await response.text();
      console.log("❌ Create error:", errorText);

      throw new Error("Animal creation failed");
    }

    console.log("✅ Animal created");

    // Reset
    setNewAnimal({
      name: "",
      type: "",
      breed: "",
      age_months: "",
      sex: "",
      description: "",
      status: "Available",
      image: null
    });

    setImagePreview(null);
    setShowModal(false);

    loadAnimals();

    alert("✅ Animal added successfully! 🐾");

  } catch (error: any) {

    console.error("❌ Final error:", error);
    setSaveError(error.message);

  } finally {

    setLoading(false);
    setImageUploading(false);

  }
};


const handleUpdateStatus = async (animalId: number, newStatus: string) => {
  if (!newStatus) return;

  const animal = animals.find(a => a.animal_id === animalId);
  if (!animal) return;

  const previousStatus = animal.status;

  if (!confirm(`Update "${animal.name}" from "${previousStatus}" to "${newStatus}"?`)) 
    return;

  setUpdateLoading(prev => ({ ...prev, [animalId]: true }));

  try {
    const token = localStorage.getItem("token")!;

    const response = await fetch(`${API_URL}/animals/${animalId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await response.json();
    console.log("UPDATE RESPONSE:", data);

    // ❗ IMPORTANT FIX
    if (!response.ok || data.error) {
      throw new Error(data.error || "Update failed");
    }

    // ✅ ONLY update UI if backend success
    const updatedAnimals = animals.map(a => {
      if (a.animal_id === animalId) {
        return { ...a, status: data.animal.status }; // use backend value
      }
      return a;
    });

    setAnimals(updatedAnimals);
    calculateStats(updatedAnimals);

    alert(`✅ ${animal.name} updated to ${data.animal.status}`);

  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    alert(error.message);
  } finally {
    setUpdateLoading(prev => ({ ...prev, [animalId]: false }));
  }
};

const handleDeleteAnimal = async (animalId: number) => {
    const animal = animals.find(a => a.animal_id === animalId);
    if (!animal) return;

    if (!confirm(`Move "${animal.name}" to Archive?`)) return;

    setDeleteLoading(prev => ({ ...prev, [animalId]: true }));

    try {
      const token = localStorage.getItem("token")!;
      
      const deleteResponse = await fetch(`${API_URL}/animals/${animalId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!deleteResponse.ok) {
        throw new Error(`Delete failed: ${deleteResponse.status}`);
      }

      // 🗑️ Clean up local image file if it exists
      const imageUrl = animal.image_url || animal.photo;
      if (imageUrl && imageUrl.includes('/uploads/')) {
        const filename = imageUrl.split('/uploads/')[1];
        if (filename) {
          try {
            await fetch(`${LOCAL_API_URL}/api/upload?filename=${encodeURIComponent(filename)}`, {
              method: "DELETE"
            });
            console.log("🗑️ Image deleted from local storage:", filename);
          } catch (deleteError) {
            console.warn("⚠️ Could not delete local image:", deleteError);
          }
        }
      }

      const newArchiveEntry: ArchiveEntry = {
        id: Date.now(),
        animalId: animalId,
        animalName: animal.name,
        animalType: animal.type,
        status: animal.status as "Adopted" | "Fostered",
        date: new Date().toISOString(),
        previousStatus: animal.status
      };
      
      setArchive(prev => [newArchiveEntry, ...prev]);
      const updatedAnimals = animals.filter(a => a.animal_id !== animalId);
      setAnimals(updatedAnimals);
      calculateStats(updatedAnimals);

      alert(`✅ "${animal.name}" archived!`);
    } catch (error: any) {
      alert(`❌ Delete error: ${error.message}`);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [animalId]: false }));
    }
  };

// ✏️ Edit animal
  const handleEditClick = (animal: any) => {
    const id = animal.animal_id;
    const fullAnimal = animals.find(a => a.animal_id === id);
    setEditingAnimal({
      id,
      name: fullAnimal?.name || "",
      type: fullAnimal?.type || "",
      breed: fullAnimal?.breed || "",
      age_months: fullAnimal?.age_months || "",
      sex: fullAnimal?.sex || "",
      description: fullAnimal?.description || "",
      status: fullAnimal?.status || "Available"
    });
    // 🖼️ Set current photo and preview
    setCurrentPhoto(fullAnimal?.photo || "");
    setEditImagePreview(fullAnimal?.image_url || null);
    setEditImage(null);
    setShowEditModal(true);
  };
  
  // 🖼️ Handle image change for edit
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveError("Please select an image file (JPG, PNG, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSaveError("Image must be less than 5MB");
        return;
      }
      setEditImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setEditImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setSaveError("");
    }
  };
  
  // 🖼️ Remove edit image
  const removeEditImage = () => {
    setEditImage(null);
    setEditImagePreview(null);
    setEditImage(null);
  };

const handleSaveEdit = async () => {
    if (!editingAnimal || !editingAnimal.name.trim()) {
      setSaveError("Name is required");
      return;
    }

    setEditLoading(true);
    setSaveError("");

    try {
      const token = localStorage.getItem("token")!;
      
      let newPhoto = currentPhoto;
      let oldFilename = "";

      // 🖼️ Upload new image if changed
      if (editImage) {
        setEditImageUploading(true);
        
        // Delete old image if it was a local upload
        if (currentPhoto && currentPhoto.includes('/uploads/')) {
          oldFilename = currentPhoto.split('/uploads/')[1];
        }
        
        const formData = new FormData();
        formData.append("image", editImage);

        const uploadRes = await fetch(
          `${LOCAL_API_URL}/api/upload`,
          {
            method: "POST",
            body: formData
          }
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error("Image upload failed");
        }

        newPhoto = uploadData.photo;
        console.log("🖼️ New image uploaded:", newPhoto);
      }

      const payload = {
        name: editingAnimal.name,
        type: editingAnimal.type,
        breed: editingAnimal.breed || "",
        age_months: parseInt(editingAnimal.age_months) || 0,
        sex: editingAnimal.sex || "",
        description: editingAnimal.description || "",
        status: editingAnimal.status,
        photo: newPhoto
      };

      const response = await fetch(`${API_URL}/animals/${editingAnimal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Update failed");
      }

      // 🗑️ Delete old image if replaced
      if (oldFilename) {
        try {
          await fetch(`${LOCAL_API_URL}/api/upload?filename=${encodeURIComponent(oldFilename)}`, {
            method: "DELETE"
          });
          console.log("🗑️ Old image deleted:", oldFilename);
        } catch (deleteError) {
          console.warn("⚠️ Could not delete old image:", deleteError);
        }
      }

// Update local state
      const updatedAnimals = animals.map(a => {
        if (a.animal_id === editingAnimal.id) {
          return { 
            ...a, 
            ...payload,
            image_url: newPhoto ? `http://localhost:3001${newPhoto}` : undefined
          };
        }
        return a;
      });

      setAnimals(updatedAnimals);
      calculateStats(updatedAnimals);
      setShowEditModal(false);
      setEditingAnimal(null);
      
      // Reset edit image states
      setEditImage(null);
      setEditImagePreview(null);
      setEditImageUploading(false);
      setCurrentPhoto("");

      alert(`✅ ${editingAnimal.name} updated successfully!`);

    } catch (error: any) {
      console.error("Edit error:", error);
      setSaveError(error.message);
    } finally {
      setEditLoading(false);
      setEditImageUploading(false);
    }
  };

  const handleRequestAction = async (requestId: number, action: "approve" | "reject") => {
  const request = requests.find(r => r.id === requestId);
  if (!request) return;

  if (!confirm(`Are you sure you want to ${action} ${request.full_name}'s request for ${request.animal_name}?`)) {
    return;
  }

  setRequestLoading(prev => ({ ...prev, [requestId]: true }));

  try {
    const token = localStorage.getItem("token")!;
    
    // 🆕 FIXED: Match your controller endpoints exactly
    const endpoint = action === "approve" ? "approved" : "rejected";
    const response = await fetch(`${API_URL}/adoption/${requestId}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", response.status, errorText);
      throw new Error(`Failed to ${action}: ${errorText}`);
    }

    // 🆕 Update status to match your backend
    const newStatus = action === "approve" ? "approved" : "rejected";
   setRequests(prev => prev.filter(r => r.id !== requestId));

    // 🆕 Reload data
    loadRequests();
    loadAnimals();

    alert(`✅ ${request.full_name}'s request has been ${action}d! 🐾`);

  } catch (error: any) {
    console.error("Request action failed:", error);
    alert(`❌ ${error.message}`);
  } finally {
    setRequestLoading(prev => ({ ...prev, [requestId]: false }));
  }
};

const clearArchive = () => {
  if (confirm("Clear all archive history?")) {
    setArchive([]);
    localStorage.removeItem("streetpaws_archive");
  }
};

const handleLogout = () => {
  localStorage.clear();
  router.push("/register");
};

  const archiveAdoptedCount = archive.filter(a => a.status === "Adopted").length;
  const archiveFosteredCount = archive.filter(a => a.status === "Fostered").length;
  const pendingRequestsCount = requests.filter(r => r.status === "pending").length;

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
{/* Header */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg mb-8 flex justify-between items-center">
        <Logo showText={true} size="md" />
<div className="flex-1 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Street Paws Admin Dashboard
          </h1>
          <p className="text-gray-700">
            Welcome <strong>{user.username}</strong> ({user.role})
          </p>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-3">
    <button
      onClick={() => setShowRequests(true)}
      className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
        pendingRequestsCount > 0
          ? "bg-orange-500 text-white hover:bg-orange-600 animate-pulse"
          : "bg-orange-400 text-white hover:bg-orange-500"
      }`}
    >
      📋 Requests ({pendingRequestsCount})
    </button>

    <button
      onClick={() => setShowArchive(true)}
      className="bg-purple-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-600 transition-all"
    >
      📜 Archive ({archive.length})
    </button>

    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold"
    >
      Logout
    </button>
  </div>
</div>

{/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
  <StatCard title="Total" value={stats.totalAnimals} icon="📊" />
  <StatCard title="Available" value={stats.available} icon="🔍" />
  <StatCard title="Adopted" value={stats.adopted} icon="🏠" subtext={archiveAdoptedCount > 0 ? `${archiveAdoptedCount} total` : undefined} />
  <StatCard title="Fostered" value={stats.fostered} icon="❤️" subtext={archiveFosteredCount > 0 ? `${archiveFosteredCount} total` : undefined} />
  <StatCard title="Pending Requests" value={stats.pendingRequests} icon="📋" color="orange" />
</div>

      {/* 🖼️ Animals Table with Images */}
      <div className="bg-white/70 backdrop-blur p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Animals ({animals.length})</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl"
          >
            ➕ Add New Animal 🖼️
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="bg-emerald-50">
                <th className="p-4 font-bold text-center w-[8%]">ID</th>
                <th className="p-4 font-bold text-center w-[12%]">🖼️ Photo</th>
                <th className="p-4 font-bold text-center w-[18%]">Name</th>
                <th className="p-4 font-bold text-center w-[15%]">Type</th>
                <th className="p-4 font-bold text-center w-[12%]">Age</th>
                <th className="p-4 font-bold text-center w-[13%]">Status</th>
                <th className="p-4 font-bold text-center w-[22%]">Actions</th>
              </tr>
            </thead>
            <tbody>
{animals.map((animal) => {
                const id = animal.animal_id;
                return (
                  <tr key={id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono font-bold text-center">{id}</td>
                    {/* 🖼️ Image Display */}
                    <td className="p-4 text-center">
                      {animal.image_url ? (
                        <img 
                          src={animal.image_url} 
                          alt={animal.name}
                          className="w-14 h-14 object-cover rounded-xl shadow-md mx-auto hover:scale-110 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).outerHTML = '<div class="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center mx-auto text-xs">🐾</div>';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center mx-auto text-xs font-bold">
                          No Photo
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-center">{animal.name}</td>
                    <td className="p-4 text-center">{animal.type}</td>
                    <td className="p-4 text-center">{animal.age_months || '?'} mo</td>
                    <td className="p-4 text-center">
                      <StatusBadge status={animal.status} />
                    </td>
<td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(animal)}
                          className="bg-blue-500 text-white px-3 py-1 rounded font-bold text-sm hover:bg-blue-600"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <select 
                          onChange={(e) => handleUpdateStatus(id, e.target.value)}
                          disabled={updateLoading[id]}
                          value={animal.status || "Available"}
                          className="px-3 py-1 border border-gray-300 rounded font-bold text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 disabled:opacity-50"
                        >
                          <option value="">Update</option>
                          <option value="Available">Available</option>
                          <option value="Fostered">Fostered</option>
                          <option value="Adopted">Adopted</option>
                        </select>
                        <button
                          onClick={() => handleDeleteAnimal(id)}
                          disabled={deleteLoading[id]}
                          className="bg-red-500 text-white px-3 py-1 rounded font-bold text-sm hover:bg-red-600 disabled:opacity-50"
                        >
                          {deleteLoading[id] ? "⏳" : "🗑️"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {animals.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">
                    No animals yet. <br/>➕ Add your first one with a photo! 🐕
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Archive Modal */}
      {showArchive && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700">📜 Adoption & Foster History</h2>
              <button 
                onClick={() => setShowArchive(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Archive Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-green-600">{archiveAdoptedCount}</p>
                <p className="text-sm text-green-700">Total Adoptions</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-blue-600">{archiveFosteredCount}</p>
                <p className="text-sm text-blue-700">Total Fosters</p>
              </div>
            </div>

            {/* Archive List */}
            {archive.length > 0 ? (
              <div className="space-y-3">
                {archive.map((entry) => (
                  <div 
                    key={entry.id} 
                    className={`p-4 rounded-xl border-l-4 ${
                      entry.status === "Adopted" 
                        ? "bg-green-50 border-green-500" 
                        : "bg-blue-50 border-blue-500"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">
                          {entry.animalName} ({entry.animalType})
                        </p>
                        <p className="text-sm text-gray-600">
                          {entry.previousStatus} → <strong>{entry.status}</strong>
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={entry.status} />
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-3">📭</p>
                <p>No adoption or foster history yet.</p>
                <p className="text-sm">When animals are adopted or fostered, they'll appear here.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-6 pt-6 border-t">
              {archive.length > 0 && (
                <button
                  onClick={clearArchive}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear History
                </button>
              )}
              <button
                onClick={() => setShowArchive(false)}
                className="ml-auto bg-purple-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{/* ✏️ Edit Modal */}
{showEditModal && editingAnimal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">✏️ Edit Animal</h2>
      
      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-red-700">
          {saveError}
        </div>
      )}

      <div className="space-y-4">
        <Input 
          label="Name *" 
          value={editingAnimal.name} 
          onChange={(value: string) => 
            setEditingAnimal({ ...editingAnimal, name: value })
          } 
        />
        
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
<select
    value={editingAnimal?.type || ""}
    onChange={(e) => setEditingAnimal({...editingAnimal, type: e.target.value})}
    className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
    disabled={editLoading}
    required
  >
    <option value="">Select animal type...</option>
    <option value="Dog">Dog</option>
    <option value="Cat">Cat</option>
    <option value="Other">Other</option>
  </select>
</div>

        <Input label="Breed" value={editingAnimal.breed} onChange={(v: any) => setEditingAnimal({...editingAnimal, breed: v})} />
        <Input label="Age (months)" type="number" value={editingAnimal.age_months} onChange={(v: any) => setEditingAnimal({...editingAnimal, age_months: v})} />
<div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
          <select
            value={editingAnimal.sex}
            onChange={(e) => setEditingAnimal({...editingAnimal, sex: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="">Select sex...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <Textarea label="Description" value={editingAnimal.description} onChange={(v: any) => setEditingAnimal({...editingAnimal, description: v})} />

<div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={editingAnimal.status}
            onChange={(e) => setEditingAnimal({...editingAnimal, status: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            disabled={editLoading}
          >
            <option value="Available">Available</option>
            <option value="Fostered">Fostered</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>
        
        {/* 🖼️ Edit Image Upload Section */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
              disabled={editLoading || editImageUploading}
              className="hidden"
              id="edit-animal-image"
            />
            <label 
              htmlFor="edit-animal-image"
              className="flex items-center justify-center cursor-pointer"
            >
              {editImagePreview ? (
                <div className="relative">
                  <img 
                    src={editImagePreview} 
                    alt="Animal preview" 
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeEditImage(); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-4xl block mb-2">📷</span>
                  <span className="text-sm text-gray-600">Click to change photo</span>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={() => { setShowEditModal(false); setEditingAnimal(null); }}
          className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          disabled={editLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveEdit}
          disabled={editLoading || !editingAnimal.name.trim()}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {editLoading ? (
            <>
              <div className="w-5 h-5 border border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "💾 Save Changes"
          )}
        </button>
      </div>
    </div>
  </div>
)}

{/* 🆕 NEW: Requests Modal */}
{showRequests && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-700">📋 Adoption Requests</h2>
        <button onClick={() => setShowRequests(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="p-6 rounded-2xl border shadow-lg hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-xl text-gray-800">{request.animal_name}</h4>
                  <p className="text-blue-600 font-semibold">{request.full_name}</p>
                  <p className="text-sm text-gray-600">{request.email}</p>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{request.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-sm">{new Date(request.request_date).toLocaleDateString()}</p>
                </div>
              </div>

              {request.reason && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">Reason:</p>
                  <p className="text-gray-700 italic">"{request.reason}"</p>
                </div>
              )}

              {request.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleRequestAction(request.id, "approve")}
                    disabled={requestLoading[request.id]}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {requestLoading[request.id] ? "⏳" : "✅"} Approve
                  </button>
                  <button
                    onClick={() => handleRequestAction(request.id, "reject")}
                    disabled={requestLoading[request.id]}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl font-bold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {requestLoading[request.id] ? "⏳" : "❌"} Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No adoption requests yet.</p>
        </div>
      )}

      <div className="flex gap-4 mt-6 pt-6 border-t">
        <button
          onClick={() => setShowRequests(false)}
          className="ml-auto bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* Create Modal */}
    {showModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-emerald-700">➕ Add New Animal</h2>
      
      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-red-700">
          {saveError}
        </div>
      )}

      <div className="space-y-4">
        {/* ✅ Name - unchanged */}
        <Input 
  label="Name *" 
  value={newAnimal.name} 
  onChange={(value: string) => 
    setNewAnimal({ ...newAnimal, name: value })
  } 
/>
        
{/* ✅ FIXED: Type Dropdown - prevents validation errors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
<select
            value={newAnimal.type}
            onChange={(e) => setNewAnimal({...newAnimal, type: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            disabled={loading}
            required
          >
            <option value="">Select animal type...</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input label="Breed" value={newAnimal.breed} onChange={(v: any) => setNewAnimal({...newAnimal, breed: v})} />
        <Input label="Age (months)" type="number" value={newAnimal.age_months} onChange={(v: any) => setNewAnimal({...newAnimal, age_months: v})} />
<div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
          <select
            value={newAnimal.sex}
            onChange={(e) => setNewAnimal({...newAnimal, sex: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
          >
            <option value="">Select sex...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <Textarea label="Description" value={newAnimal.description} onChange={(v: any) => setNewAnimal({...newAnimal, description: v})} />
      </div>
{/* 🖼️ Enhanced Animal Image Upload Section */}
<div className="mt-6 p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-3xl border-2 border-dashed border-emerald-200 hover:border-emerald-300 transition-all">
  <div className="text-center mb-6">
    <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg">
      <span className="text-2xl">🖼️</span>
    </div>
<h3 className="font-bold text-lg text-gray-800 mb-1">Animal Photo</h3>
    <p className="text-sm text-gray-600 max-w-sm mx-auto">
      Upload a clear photo of your animal (JPG, PNG • Max 5MB)
    </p>
  </div>

  {/* File Input - Styled Upload Area */}
  <div className="relative">
    <input
      id="animal-image"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      disabled={loading || imageUploading}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-2xl"
    />
    
    {imagePreview ? (
      /* ✅ Preview State */
      <div className="group relative bg-white rounded-3xl p-2 shadow-xl border-4 border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-2xl">
        {/* Gradient Frame */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl -m-2 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Image */}
        <img
          src={imagePreview}
          alt="Animal preview"
          className="w-48 h-48 object-cover rounded-2xl shadow-2xl mx-auto block"
        />
        
        {/* Paw Print Overlay */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border-2 border-emerald-200">
          <span className="text-2xl">🐾</span>
        </div>
        
        {/* Remove Button */}
        <button
          type="button"
          onClick={removeImage}
          className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-110 flex items-center justify-center text-lg font-bold transition-all duration-200 hover:from-red-600 hover:to-red-700"
          title="Remove photo"
        >
          ✕
        </button>
        
        {/* Status Badge */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl shadow-lg border border-emerald-200">
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            ✅ Ready to upload
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          </span>
        </div>
      </div>
    ) : (
      /* ✅ Upload Placeholder */
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 border-4 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer group hover:shadow-lg">
        {/* Animated Paw Prints */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500">
          <span className="text-xl">🐾</span>
        </div>
        <div className="absolute bottom-8 right-8 w-6 h-6 bg-teal-400/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 animate-pulse">
          <span className="text-lg">🐾</span>
        </div>
        
        {/* Main Icon */}
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-all duration-300">
          <span className="text-3xl">📸</span>
        </div>
        
        <p className="font-semibold text-gray-700 mb-1 px-4">
          Click to add photo
        </p>
        <p className="text-xs text-gray-500">or drag & drop</p>
        
        {/* Progress if uploading */}
        {imageUploading && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full animate-pulse w-3/4" />
          </div>
        )}
      </div>
    )}
  </div>

  {/* File Info */}
  {newAnimal.image && !imagePreview && (
    <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
      <p className="text-xs text-blue-800 font-medium flex items-center gap-2">
        <span className="w-3 h-3 bg-blue-500 rounded-full" />
        {newAnimal.image.name}
        <span className="text-blue-600">({(newAnimal.image.size / 1024 / 1024).toFixed(1)} MB)</span>
      </p>
    </div>
  )}
</div>
      <div className="flex gap-4 mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          disabled={loading}
        >
          Cancel
        </button>
<button
          type="button"
          onClick={handleAddAnimal}
          disabled={!newAnimal.name.trim() || !newAnimal.type.trim()}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "🐾 Create Animal"
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

// Components
const StatCard = ({ title, value, icon, subtext, color = "emerald" }: any) => (
  <div className={`p-6 rounded-2xl shadow-lg border bg-white hover:shadow-xl transition-all border-${color}-100`}>
    <div className="text-3xl mb-3">{icon}</div>
    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
    <div className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</div>
    {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
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

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
      placeholder={`Enter ${label.toLowerCase().replace(' *', '')}`}
    />
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      rows={3}
      className="w-full p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-vertical"
      placeholder="Description..."
    />
  </div>
  
);
const RequestStatusBadge = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
    status === 'pending' ? 'bg-orange-100 text-orange-800' :
    status === 'approved' ? 'bg-green-100 text-green-800' :
    status === 'rejected' ? 'bg-red-100 text-red-800' :
    'bg-gray-100 text-gray-800'
  }`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);


