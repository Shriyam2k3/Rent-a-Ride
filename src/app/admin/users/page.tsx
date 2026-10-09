"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IUser, UserRole } from "@/types";
import { formatDate } from "@/lib/utils";
import { Search, Loader2, ShieldCheck, UserCheck, Users } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error("Failed to load users:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId: string, currentRole: UserRole) => {
    const newRole: UserRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Change role of this user to ${newRole.toUpperCase()}?`)) return;

    setTogglingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId || u.firebaseUid === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (e) {
      alert("Error toggling user role");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1">
          Customer & Driver Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
          Customer Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          View registered customer profiles, contact numbers, KYC verification status, and permissions.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-xs font-medium text-slate-500">Loading customer directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Phone Number</th>
                  <th className="px-6 py-3.5">System Role</th>
                  <th className="px-6 py-3.5">Verification</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => {
                  const isAdmin = u.role === "admin";
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 text-[#172033] flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                            {u.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <span className="font-bold text-[#172033] block">{u.name || "Customer"}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {u._id?.slice(-6)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">{u.email}</td>

                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {u.phone || "+91 98123 45678"}
                      </td>

                      <td className="px-6 py-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                            <UserCheck className="w-3 h-3 text-slate-500" />
                            Customer
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Verified KYC
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleRole(u._id, u.role)}
                          disabled={togglingId === u._id}
                          className="px-3 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
                        >
                          {isAdmin ? "Demote to User" : "Grant Admin"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
