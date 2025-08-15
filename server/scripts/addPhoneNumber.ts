import "dotenv/config";
import mongoose from "mongoose";
import PhoneNumber from "../models/PhoneNumber";
import User from "../models/User";

const MONGODB_URI = "mongodb+srv://Hammad:Soomro@connectlify.tdwqdvi.mongodb.net/?retryWrites=true&w=majority&appName=Connectlify";

async function addPhoneNumberToUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find user by email (assuming you know the user's email)
    // Replace with actual user identification method
    const user = await User.findOne({ email: "jaxon.cooper@example.com" });
    
    if (!user) {
      // If user not found by email, get the first user in the system
      const firstUser = await User.findOne({});
      if (!firstUser) {
        console.error("❌ No users found in the system");
        return;
      }
      console.log(`📱 Adding number to user: ${firstUser.firstName} ${firstUser.lastName} (${firstUser.email})`);
      
      // Add the phone number
      const phoneNumber = new PhoneNumber({
        userId: firstUser._id,
        number: "+12494440933",
        label: "Main Business Line",
        city: "Houston",
        state: "TX",
        country: "US",
        monthlyPrice: 5.0,
        capabilities: ["SMS", "Voice"],
        isActive: true,
        purchaseDate: new Date(),
        assignedTo: null
      });

      await phoneNumber.save();
      console.log("✅ Phone number +12494440933 added successfully!");
      console.log("📋 Number details:", {
        number: phoneNumber.number,
        label: phoneNumber.label,
        city: phoneNumber.city,
        state: phoneNumber.state,
        userId: phoneNumber.userId
      });
    } else {
      console.log(`📱 Adding number to user: ${user.firstName} ${user.lastName} (${user.email})`);
      
      // Check if number already exists
      const existingNumber = await PhoneNumber.findOne({ number: "+12494440933" });
      if (existingNumber) {
        console.log("⚠️ Phone number already exists in the system");
        console.log("📋 Current owner:", existingNumber.userId);
        return;
      }

      // Add the phone number
      const phoneNumber = new PhoneNumber({
        userId: user._id,
        number: "+12494440933",
        label: "Main Business Line",
        city: "Houston",
        state: "TX",
        country: "US",
        monthlyPrice: 5.0,
        capabilities: ["SMS", "Voice"],
        isActive: true,
        purchaseDate: new Date(),
        assignedTo: null
      });

      await phoneNumber.save();
      console.log("✅ Phone number +12494440933 added successfully!");
      console.log("📋 Number details:", {
        number: phoneNumber.number,
        label: phoneNumber.label,
        city: phoneNumber.city,
        state: phoneNumber.state,
        userId: phoneNumber.userId
      });
    }

  } catch (error) {
    console.error("❌ Error adding phone number:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
addPhoneNumberToUser();
