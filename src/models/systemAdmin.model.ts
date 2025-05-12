import mongoose, { Schema, Document } from "mongoose";

export interface ISystemAdmin extends Document {
  OrgName: string;
  logo: string; 
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  supportContactInfo: {
    email: string;
    phone: string;
  };
  about?: string; // A brief description about the system or platform
  isActive: boolean; // Whether the admin or the system is active
  createdAt: Date;
  updatedAt: Date;
}

const systemAdminSchema = new Schema<ISystemAdmin>(
  {
    OrgName: {
      type: String,
      required: true,
    },
    logo: {
      type: String, // Store either a URL or base64 string of the logo
      required: true,
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      website: {
        type: String,
        required: false,
      },
    },
    address: {
      street: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      postalCode: {
        type: String,
        required: false,
      },
    },
    socialLinks: {
      facebook: {
        type: String,
        required: false,
      },
      twitter: {
        type: String,
        required: false,
      },
      linkedin: {
        type: String,
        required: false,
      },
      instagram: {
        type: String,
        required: false,
      },
    },
    supportContactInfo: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    about: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true, // Assuming the system is active by default
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Prevent overwriting during dev/watch mode
const SystemAdmin =
  mongoose.models.SystemAdmin || mongoose.model<ISystemAdmin>("SystemAdmin", systemAdminSchema);

export default SystemAdmin;
