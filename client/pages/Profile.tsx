import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Save,
  Edit3,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  timezone: string;
  language: string;
  avatar: string;
  bio: string;
  website: string;
  joinedDate: string;
  plan: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
}

export default function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "1",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    timezone: "America/Los_Angeles",
    language: "English",
    avatar: "",
    bio: "",
    website: "",
    joinedDate: "2024-01-01",
    plan: user?.subscription?.plan || "Basic",
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    sessionTimeout: 60,
    ipWhitelist: [],
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  const handleSecurityUpdate = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved.",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <DashboardLayout title="Profile Settings">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          <Button onClick={handleProfileUpdate}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="w-64 space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-gray-100"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "security"
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-gray-100"
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Security & Privacy
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === "notifications"
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-gray-100"
              }`}
            >
              <Bell className="w-4 h-4 inline mr-2" />
              Notifications
            </button>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="text-lg">
                            {getInitials(profile.firstName, profile.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-gray-600">{profile.email}</p>
                        <Badge className="mt-1">{profile.plan} Plan</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={profile.timezone}
                          onValueChange={(value) =>
                            setProfile((prev) => ({ ...prev, timezone: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Los_Angeles">
                              Pacific Time (PT)
                            </SelectItem>
                            <SelectItem value="America/Denver">
                              Mountain Time (MT)
                            </SelectItem>
                            <SelectItem value="America/Chicago">
                              Central Time (CT)
                            </SelectItem>
                            <SelectItem value="America/New_York">
                              Eastern Time (ET)
                            </SelectItem>
                            <SelectItem value="Europe/London">GMT</SelectItem>
                            <SelectItem value="Europe/Paris">CET</SelectItem>
                            <SelectItem value="Asia/Tokyo">JST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={profile.language}
                          onValueChange={(value) =>
                            setProfile((prev) => ({ ...prev, language: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Chinese">Chinese</SelectItem>
                            <SelectItem value="Japanese">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={profile.address}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          value={profile.state}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              state: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="zipCode"
                          value={profile.zipCode}
                          onChange={(e) =>
                            setProfile((prev) => ({
                              ...prev,
                              zipCode: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={profile.country}
                          onValueChange={(value) =>
                            setProfile((prev) => ({ ...prev, country: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="Afghanistan">
                              Afghanistan
                            </SelectItem>
                            <SelectItem value="Albania">Albania</SelectItem>
                            <SelectItem value="Algeria">Algeria</SelectItem>
                            <SelectItem value="Andorra">Andorra</SelectItem>
                            <SelectItem value="Angola">Angola</SelectItem>
                            <SelectItem value="Antigua and Barbuda">
                              Antigua and Barbuda
                            </SelectItem>
                            <SelectItem value="Argentina">Argentina</SelectItem>
                            <SelectItem value="Armenia">Armenia</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Austria">Austria</SelectItem>
                            <SelectItem value="Azerbaijan">
                              Azerbaijan
                            </SelectItem>
                            <SelectItem value="Bahamas">Bahamas</SelectItem>
                            <SelectItem value="Bahrain">Bahrain</SelectItem>
                            <SelectItem value="Bangladesh">
                              Bangladesh
                            </SelectItem>
                            <SelectItem value="Barbados">Barbados</SelectItem>
                            <SelectItem value="Belarus">Belarus</SelectItem>
                            <SelectItem value="Belgium">Belgium</SelectItem>
                            <SelectItem value="Belize">Belize</SelectItem>
                            <SelectItem value="Benin">Benin</SelectItem>
                            <SelectItem value="Bhutan">Bhutan</SelectItem>
                            <SelectItem value="Bolivia">Bolivia</SelectItem>
                            <SelectItem value="Bosnia and Herzegovina">
                              Bosnia and Herzegovina
                            </SelectItem>
                            <SelectItem value="Botswana">Botswana</SelectItem>
                            <SelectItem value="Brazil">Brazil</SelectItem>
                            <SelectItem value="Brunei">Brunei</SelectItem>
                            <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                            <SelectItem value="Burkina Faso">
                              Burkina Faso
                            </SelectItem>
                            <SelectItem value="Burundi">Burundi</SelectItem>
                            <SelectItem value="Cabo Verde">
                              Cabo Verde
                            </SelectItem>
                            <SelectItem value="Cambodia">Cambodia</SelectItem>
                            <SelectItem value="Cameroon">Cameroon</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Central African Republic">
                              Central African Republic
                            </SelectItem>
                            <SelectItem value="Chad">Chad</SelectItem>
                            <SelectItem value="Chile">Chile</SelectItem>
                            <SelectItem value="China">China</SelectItem>
                            <SelectItem value="Colombia">Colombia</SelectItem>
                            <SelectItem value="Comoros">Comoros</SelectItem>
                            <SelectItem value="Congo (Congo-Brazzaville)">
                              Congo (Congo-Brazzaville)
                            </SelectItem>
                            <SelectItem value="Costa Rica">
                              Costa Rica
                            </SelectItem>
                            <SelectItem value="Croatia">Croatia</SelectItem>
                            <SelectItem value="Cuba">Cuba</SelectItem>
                            <SelectItem value="Cyprus">Cyprus</SelectItem>
                            <SelectItem value="Czechia (Czech Republic)">
                              Czechia (Czech Republic)
                            </SelectItem>
                            <SelectItem value="Democratic Republic of the Congo">
                              Democratic Republic of the Congo
                            </SelectItem>
                            <SelectItem value="Denmark">Denmark</SelectItem>
                            <SelectItem value="Djibouti">Djibouti</SelectItem>
                            <SelectItem value="Dominica">Dominica</SelectItem>
                            <SelectItem value="Dominican Republic">
                              Dominican Republic
                            </SelectItem>
                            <SelectItem value="Ecuador">Ecuador</SelectItem>
                            <SelectItem value="Egypt">Egypt</SelectItem>
                            <SelectItem value="El Salvador">
                              El Salvador
                            </SelectItem>
                            <SelectItem value="Equatorial Guinea">
                              Equatorial Guinea
                            </SelectItem>
                            <SelectItem value="Eritrea">Eritrea</SelectItem>
                            <SelectItem value="Estonia">Estonia</SelectItem>
                            <SelectItem value="Eswatini">Eswatini</SelectItem>
                            <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                            <SelectItem value="Fiji">Fiji</SelectItem>
                            <SelectItem value="Finland">Finland</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Gabon">Gabon</SelectItem>
                            <SelectItem value="Gambia">Gambia</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="Ghana">Ghana</SelectItem>
                            <SelectItem value="Greece">Greece</SelectItem>
                            <SelectItem value="Grenada">Grenada</SelectItem>
                            <SelectItem value="Guatemala">Guatemala</SelectItem>
                            <SelectItem value="Guinea">Guinea</SelectItem>
                            <SelectItem value="Guinea-Bissau">
                              Guinea-Bissau
                            </SelectItem>
                            <SelectItem value="Guyana">Guyana</SelectItem>
                            <SelectItem value="Haiti">Haiti</SelectItem>
                            <SelectItem value="Holy See">Holy See</SelectItem>
                            <SelectItem value="Honduras">Honduras</SelectItem>
                            <SelectItem value="Hungary">Hungary</SelectItem>
                            <SelectItem value="Iceland">Iceland</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="Indonesia">Indonesia</SelectItem>
                            <SelectItem value="Iran">Iran</SelectItem>
                            <SelectItem value="Iraq">Iraq</SelectItem>
                            <SelectItem value="Ireland">Ireland</SelectItem>
                            <SelectItem value="Israel">Israel</SelectItem>
                            <SelectItem value="Italy">Italy</SelectItem>
                            <SelectItem value="Jamaica">Jamaica</SelectItem>
                            <SelectItem value="Japan">Japan</SelectItem>
                            <SelectItem value="Jordan">Jordan</SelectItem>
                            <SelectItem value="Kazakhstan">
                              Kazakhstan
                            </SelectItem>
                            <SelectItem value="Kenya">Kenya</SelectItem>
                            <SelectItem value="Kiribati">Kiribati</SelectItem>
                            <SelectItem value="Kuwait">Kuwait</SelectItem>
                            <SelectItem value="Kyrgyzstan">
                              Kyrgyzstan
                            </SelectItem>
                            <SelectItem value="Laos">Laos</SelectItem>
                            <SelectItem value="Latvia">Latvia</SelectItem>
                            <SelectItem value="Lebanon">Lebanon</SelectItem>
                            <SelectItem value="Lesotho">Lesotho</SelectItem>
                            <SelectItem value="Liberia">Liberia</SelectItem>
                            <SelectItem value="Libya">Libya</SelectItem>
                            <SelectItem value="Liechtenstein">
                              Liechtenstein
                            </SelectItem>
                            <SelectItem value="Lithuania">Lithuania</SelectItem>
                            <SelectItem value="Luxembourg">
                              Luxembourg
                            </SelectItem>
                            <SelectItem value="Madagascar">
                              Madagascar
                            </SelectItem>
                            <SelectItem value="Malawi">Malawi</SelectItem>
                            <SelectItem value="Malaysia">Malaysia</SelectItem>
                            <SelectItem value="Maldives">Maldives</SelectItem>
                            <SelectItem value="Mali">Mali</SelectItem>
                            <SelectItem value="Malta">Malta</SelectItem>
                            <SelectItem value="Marshall Islands">
                              Marshall Islands
                            </SelectItem>
                            <SelectItem value="Mauritania">
                              Mauritania
                            </SelectItem>
                            <SelectItem value="Mauritius">Mauritius</SelectItem>
                            <SelectItem value="Mexico">Mexico</SelectItem>
                            <SelectItem value="Micronesia">
                              Micronesia
                            </SelectItem>
                            <SelectItem value="Moldova">Moldova</SelectItem>
                            <SelectItem value="Monaco">Monaco</SelectItem>
                            <SelectItem value="Mongolia">Mongolia</SelectItem>
                            <SelectItem value="Montenegro">
                              Montenegro
                            </SelectItem>
                            <SelectItem value="Morocco">Morocco</SelectItem>
                            <SelectItem value="Mozambique">
                              Mozambique
                            </SelectItem>
                            <SelectItem value="Myanmar (formerly Burma)">
                              Myanmar (formerly Burma)
                            </SelectItem>
                            <SelectItem value="Namibia">Namibia</SelectItem>
                            <SelectItem value="Nauru">Nauru</SelectItem>
                            <SelectItem value="Nepal">Nepal</SelectItem>
                            <SelectItem value="Netherlands">
                              Netherlands
                            </SelectItem>
                            <SelectItem value="New Zealand">
                              New Zealand
                            </SelectItem>
                            <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                            <SelectItem value="Niger">Niger</SelectItem>
                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                            <SelectItem value="North Korea">
                              North Korea
                            </SelectItem>
                            <SelectItem value="North Macedonia">
                              North Macedonia
                            </SelectItem>
                            <SelectItem value="Norway">Norway</SelectItem>
                            <SelectItem value="Oman">Oman</SelectItem>
                            <SelectItem value="Pakistan">Pakistan</SelectItem>
                            <SelectItem value="Palau">Palau</SelectItem>
                            <SelectItem value="Palestine State">
                              Palestine State
                            </SelectItem>
                            <SelectItem value="Panama">Panama</SelectItem>
                            <SelectItem value="Papua New Guinea">
                              Papua New Guinea
                            </SelectItem>
                            <SelectItem value="Paraguay">Paraguay</SelectItem>
                            <SelectItem value="Peru">Peru</SelectItem>
                            <SelectItem value="Philippines">
                              Philippines
                            </SelectItem>
                            <SelectItem value="Poland">Poland</SelectItem>
                            <SelectItem value="Portugal">Portugal</SelectItem>
                            <SelectItem value="Qatar">Qatar</SelectItem>
                            <SelectItem value="Romania">Romania</SelectItem>
                            <SelectItem value="Russia">Russia</SelectItem>
                            <SelectItem value="Rwanda">Rwanda</SelectItem>
                            <SelectItem value="Saint Kitts and Nevis">
                              Saint Kitts and Nevis
                            </SelectItem>
                            <SelectItem value="Saint Lucia">
                              Saint Lucia
                            </SelectItem>
                            <SelectItem value="Saint Vincent and the Grenadines">
                              Saint Vincent and the Grenadines
                            </SelectItem>
                            <SelectItem value="Samoa">Samoa</SelectItem>
                            <SelectItem value="San Marino">
                              San Marino
                            </SelectItem>
                            <SelectItem value="Sao Tome and Principe">
                              Sao Tome and Principe
                            </SelectItem>
                            <SelectItem value="Saudi Arabia">
                              Saudi Arabia
                            </SelectItem>
                            <SelectItem value="Senegal">Senegal</SelectItem>
                            <SelectItem value="Serbia">Serbia</SelectItem>
                            <SelectItem value="Seychelles">
                              Seychelles
                            </SelectItem>
                            <SelectItem value="Sierra Leone">
                              Sierra Leone
                            </SelectItem>
                            <SelectItem value="Singapore">Singapore</SelectItem>
                            <SelectItem value="Slovakia">Slovakia</SelectItem>
                            <SelectItem value="Slovenia">Slovenia</SelectItem>
                            <SelectItem value="Solomon Islands">
                              Solomon Islands
                            </SelectItem>
                            <SelectItem value="Somalia">Somalia</SelectItem>
                            <SelectItem value="South Africa">
                              South Africa
                            </SelectItem>
                            <SelectItem value="South Korea">
                              South Korea
                            </SelectItem>
                            <SelectItem value="South Sudan">
                              South Sudan
                            </SelectItem>
                            <SelectItem value="Spain">Spain</SelectItem>
                            <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                            <SelectItem value="Sudan">Sudan</SelectItem>
                            <SelectItem value="Suriname">Suriname</SelectItem>
                            <SelectItem value="Sweden">Sweden</SelectItem>
                            <SelectItem value="Switzerland">
                              Switzerland
                            </SelectItem>
                            <SelectItem value="Syria">Syria</SelectItem>
                            <SelectItem value="Tajikistan">
                              Tajikistan
                            </SelectItem>
                            <SelectItem value="Tanzania">Tanzania</SelectItem>
                            <SelectItem value="Thailand">Thailand</SelectItem>
                            <SelectItem value="Timor-Leste">
                              Timor-Leste
                            </SelectItem>
                            <SelectItem value="Togo">Togo</SelectItem>
                            <SelectItem value="Tonga">Tonga</SelectItem>
                            <SelectItem value="Trinidad and Tobago">
                              Trinidad and Tobago
                            </SelectItem>
                            <SelectItem value="Tunisia">Tunisia</SelectItem>
                            <SelectItem value="Turkey">Turkey</SelectItem>
                            <SelectItem value="Turkmenistan">
                              Turkmenistan
                            </SelectItem>
                            <SelectItem value="Tuvalu">Tuvalu</SelectItem>
                            <SelectItem value="Uganda">Uganda</SelectItem>
                            <SelectItem value="Ukraine">Ukraine</SelectItem>
                            <SelectItem value="United Arab Emirates">
                              United Arab Emirates
                            </SelectItem>
                            <SelectItem value="United Kingdom">
                              United Kingdom
                            </SelectItem>
                            <SelectItem value="United States">
                              United States
                            </SelectItem>
                            <SelectItem value="Uruguay">Uruguay</SelectItem>
                            <SelectItem value="Uzbekistan">
                              Uzbekistan
                            </SelectItem>
                            <SelectItem value="Vanuatu">Vanuatu</SelectItem>
                            <SelectItem value="Venezuela">Venezuela</SelectItem>
                            <SelectItem value="Vietnam">Vietnam</SelectItem>
                            <SelectItem value="Yemen">Yemen</SelectItem>
                            <SelectItem value="Zambia">Zambia</SelectItem>
                            <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button onClick={handlePasswordChange}>
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={security.twoFactorEnabled}
                        onCheckedChange={(checked) =>
                          setSecurity((prev) => ({
                            ...prev,
                            twoFactorEnabled: checked,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessionTimeout">
                        Session Timeout (minutes)
                      </Label>
                      <Select
                        value={security.sessionTimeout.toString()}
                        onValueChange={(value) =>
                          setSecurity((prev) => ({
                            ...prev,
                            sessionTimeout: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleSecurityUpdate}>
                      Save Security Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={security.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSecurity((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Receive alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={security.smsNotifications}
                      onCheckedChange={(checked) =>
                        setSecurity((prev) => ({
                          ...prev,
                          smsNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={security.pushNotifications}
                      onCheckedChange={(checked) =>
                        setSecurity((prev) => ({
                          ...prev,
                          pushNotifications: checked,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
