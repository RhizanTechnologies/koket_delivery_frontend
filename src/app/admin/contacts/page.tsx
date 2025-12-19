"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeroSection from "../components/HeroSection";
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingState from "@/components/LoadingState";
import {
  getAllContacts,
  deleteContact,
  type Contact,
} from "@/app/services/admin/contactService";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage } from "@/app/utils/errorHandler";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllContacts();
      setContacts(data);
    } catch (err: any) {
      console.error("Error fetching contacts:", err);
      const errorMsg = getErrorMessage(err, "Failed to fetch contacts");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await deleteContact(id);
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
      setSelectedContact(null);
      toast.success(getSuccessMessage("delete", "Contact message"));
    } catch (err: any) {
      console.error("Error deleting contact:", err);
      const errorMsg = getErrorMessage(err, "Failed to delete contact");
      toast.error(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteConfirm = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const cancelDelete = () => {
    setSelectedContact(null);
  };

  const confirmDelete = () => {
    if (selectedContact) {
      handleDelete(selectedContact._id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      <HeroSection
        title="Contact Messages"
        subtitle="View and manage customer inquiries and messages"
        Icon={MessageSquare}
      />

      {/* Main content */}
      <div className="min-h-screen flex justify-center items-start py-6 w-full px-4 bg-background-2">
        <div className="w-full max-w-6xl mx-auto">
          <Card className="bg-white rounded-xl p-4 sm:p-6 w-full shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Contact Messages
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mt-1">
                  {contacts.length} message{contacts.length !== 1 ? "s" : ""}{" "}
                  received
                </p>
              </div>
              <Button
                onClick={fetchContacts}
                disabled={loading}
                className="text-sm px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <p>{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    fetchContacts();
                  }}
                  className="text-sm underline mt-1"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <LoadingState
                message="Loading contact messages..."
                fullScreen={false}
              />
            ) : contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card
                    key={contact._id}
                    className="p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      {/* Contact Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              {contact.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                              {contact.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  <span className="truncate">
                                    {contact.email}
                                  </span>
                                </div>
                              )}
                              {contact.phone_number && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  <span>{contact.phone_number}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                            {contact.message}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Received {formatDate(contact.created_at)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2">
                        <Button
                          onClick={() => openDeleteConfirm(contact)}
                          variant="outline"
                          className="text-red-600 border-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 px-4 py-2 text-sm w-full sm:w-auto"
                        >
                          <Trash2 className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No contact messages</p>
                <p className="text-sm">
                  Customer messages will appear here when they contact you
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedContact && (
        <ConfirmationModal
          isOpen={!!selectedContact}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Contact Message"
          message={`Are you sure you want to delete the message from "${selectedContact.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
