import { useState, useRef } from "react";
import { motion } from "motion/react";
import { User, Mail, Camera, Save, BookOpen, Star, Clock, Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { UserAvatar } from "../components/UserAvatar";

const MAX_PHOTO_SIZE_MB = 2;

export function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(
    user?.bio || "Passionate about learning and AI technologies.",
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem("profile_skills");
    return saved
      ? JSON.parse(saved)
      : ["Machine Learning", "React", "Python", "UX Design", "Data Science"];
  });
  const [newSkill, setNewSkill] = useState("");
  const [isAddingNewSkill, setIsAddingNewSkill] = useState(false);

  const handleSave = () => {
    updateUser({ name, email, bio, avatarUrl: avatarUrl || undefined });
    setIsEditing(false);
    localStorage.setItem("profile_skills", JSON.stringify(skills));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (JPG, PNG, or GIF).");
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setPhotoError(`Image must be smaller than ${MAX_PHOTO_SIZE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      updateUser({ avatarUrl: dataUrl });
    };
    reader.onerror = () => setPhotoError("Could not read the image. Try another file.");
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      localStorage.setItem("profile_skills", JSON.stringify(updated));
      setNewSkill("");
    }
    setIsAddingNewSkill(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    localStorage.setItem("profile_skills", JSON.stringify(updated));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full space-y-8"
    >
      <header className="flex items-center gap-4 py-4">
        <div className="p-3 bg-indigo-900/40 text-indigo-400 rounded-2xl">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Your Profile
          </h1>
          <p className="text-slate-400 mt-1 uppercase tracking-wider text-xs font-semibold">
            {user?.role} Account
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32 h-32 mx-auto mt-4 mb-6 group cursor-pointer block"
              title="Change profile photo"
            >
              <div className="w-full h-full rounded-full border-4 border-slate-800 shadow-xl overflow-hidden relative z-10">
                <UserAvatar
                  name={name}
                  avatarUrl={avatarUrl}
                  className="w-full h-full"
                  textClassName="text-4xl"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
                <span className="text-[10px] text-white mt-1 font-medium">
                  Change photo
                </span>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handlePhotoSelect}
            />

            {photoError && (
              <p className="text-xs text-rose-400 mb-4 -mt-2">{photoError}</p>
            )}

            <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
            <p className="text-slate-400 text-sm mb-6">{bio}</p>

            <div className="space-y-4 text-left border-t border-slate-700 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <BookOpen size={16} /> Enrolled
                </span>
                <span className="text-white font-bold">12 Courses</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Star size={16} /> Certifications
                </span>
                <span className="text-white font-bold">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-2">
                  <Clock size={16} /> Learning Time
                </span>
                <span className="text-white font-bold">142 Hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">
                Personal Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-slate-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-slate-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-slate-200 disabled:opacity-50 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-white mb-4">
              Interests & Skills
            </h3>
            <div className="flex flex-wrap gap-2.5 items-center">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-900/30 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-medium"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-indigo-400 hover:text-rose-400 focus:outline-none transition-colors"
                      title={`Remove ${skill}`}
                    >
                      <X size={13} />
                    </button>
                  )}
                </span>
              ))}

              {isEditing && (
                <>
                  {isAddingNewSkill ? (
                    <div className="flex items-center gap-2 bg-slate-900 border border-indigo-500/50 rounded-full px-3 py-1 text-sm">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddSkill();
                          if (e.key === "Escape") setIsAddingNewSkill(false);
                        }}
                        placeholder="Type skill & enter..."
                        className="bg-transparent focus:outline-none text-slate-200 w-32 text-xs"
                        autoFocus
                      />
                      <button
                        onClick={handleAddSkill}
                        className="text-emerald-400 hover:text-emerald-300 focus:outline-none"
                        title="Add"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => setIsAddingNewSkill(false)}
                        className="text-slate-500 hover:text-slate-400 focus:outline-none"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingNewSkill(true)}
                      className="inline-flex items-center gap-1 px-3.5 py-1 bg-slate-700 text-slate-350 border border-slate-600 border-dashed rounded-full text-sm font-medium hover:bg-slate-600 hover:text-white transition-colors"
                    >
                      <Plus size={14} /> Add Skill
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
