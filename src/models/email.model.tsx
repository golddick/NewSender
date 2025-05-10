
 

// models/email.model.ts
import mongoose, { Schema } from "mongoose";

interface IEmail {
  title: string;
  content: string;
  status: "SENT" | "SAVED" ; 
  newsLetterOwnerId: string;
  category?: mongoose.Types.ObjectId;
  campaign?: mongoose.Types.ObjectId;
  openCount: number;
  clickCount: number;
  clickedLinks: Array<{
    url: string;
    timestamp: Date;
  }>;
  lastOpened?: Date;
  lastClicked?: Date;
}

const emailSchema = new Schema<IEmail>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ["SENT", "SAVED"],
    default: "SENT",
  },
  newsLetterOwnerId: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "NewsLetterCategory" },
  campaign: { type: Schema.Types.ObjectId, ref: "Campaign" },
  openCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  clickedLinks: [{
    url: String,
    timestamp: { type: Date, default: Date.now }
  }],
  lastOpened: Date,
  lastClicked: Date
}, { timestamps: true });

const Email = mongoose.models.Email || mongoose.model<IEmail>("Email", emailSchema);

export default Email;