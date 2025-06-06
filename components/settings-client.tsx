"use client"

import { useState } from "react"
import { ArrowLeft, User, Bell, Shield, Trash2, Download, Settings } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
}

interface SettingsClientProps {
  userProfile: UserProfile
}

export function SettingsClient({ userProfile }: SettingsClientProps) {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"

  const [activeTab, setActiveTab] = useState("profile")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Demo settings state
  const [settings, setSettings] = useState({
    fullName: userProfile?.full_name || "Demo User",
    email: userProfile?.email || "demo@tailtrails.com",
    bio: "Dog lover exploring Parramatta's best parks with my furry friend!",
    location: "Parramatta, NSW",
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    weatherAlerts: true,
    profileVisibility: "public",
    locationSharing: true,
    activityDisplay: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    if (isDemo) {
      // In demo mode, save to localStorage
      localStorage.setItem("demoSettings", JSON.stringify({ ...settings, [key]: value }))
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "account", label: "Account", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={isDemo ? "/dashboard?demo=true" : "/dashboard"}
              className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                      <p className="text-gray-600">Manage your personal information and preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <Input
                          value={settings.fullName}
                          onChange={(e) => handleSettingChange("fullName", e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <Input
                          value={settings.email}
                          onChange={(e) => handleSettingChange("email", e.target.value)}
                          placeholder="Enter your email"
                          type="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <Textarea
                        value={settings.bio}
                        onChange={(e) => handleSettingChange("bio", e.target.value)}
                        placeholder="Tell us about you and your dog..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input
                        value={settings.location}
                        onChange={(e) => handleSettingChange("location", e.target.value)}
                        placeholder="Your location"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Profile Photo</p>
                          <p className="text-sm text-gray-600">Upload a photo of you and your dog</p>
                        </div>
                      </div>
                      <Button variant="outline">Upload Photo</Button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                      <p className="text-gray-600">Choose how you want to be notified about updates.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-600">Receive updates via email</p>
                        </div>
                        <Switch
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Push Notifications</h3>
                          <p className="text-sm text-gray-600">Get notified on your device</p>
                        </div>
                        <Switch
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                          <p className="text-sm text-gray-600">Weekly summary of park activities</p>
                        </div>
                        <Switch
                          checked={settings.weeklyDigest}
                          onCheckedChange={(checked) => handleSettingChange("weeklyDigest", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Weather Alerts</h3>
                          <p className="text-sm text-gray-600">Get notified about weather conditions</p>
                        </div>
                        <Switch
                          checked={settings.weatherAlerts}
                          onCheckedChange={(checked) => handleSettingChange("weatherAlerts", checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Settings</h2>
                      <p className="text-gray-600">Control your privacy and data sharing preferences.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Who can see your profile information</p>
                        <Select
                          value={settings.profileVisibility}
                          onValueChange={(value) => handleSettingChange("profileVisibility", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Location Sharing</h3>
                          <p className="text-sm text-gray-600">Share your location with other users</p>
                        </div>
                        <Switch
                          checked={settings.locationSharing}
                          onCheckedChange={(checked) => handleSettingChange("locationSharing", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Activity Display</h3>
                          <p className="text-sm text-gray-600">Show your park visits and activities</p>
                        </div>
                        <Switch
                          checked={settings.activityDisplay}
                          onCheckedChange={(checked) => handleSettingChange("activityDisplay", checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Management</h2>
                      <p className="text-gray-600">Manage your account settings and data.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Export Data</h3>
                            <p className="text-sm text-gray-600">Download all your data and activity</p>
                          </div>
                          <Button variant="outline" className="flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Deactivate Account</h3>
                            <p className="text-sm text-gray-600">Temporarily disable your account</p>
                          </div>
                          <Button variant="outline">Deactivate</Button>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-red-900">Delete Account</h3>
                            <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                          </div>
                          <Button variant="destructive" className="flex items-center">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>

                    {isDemo && (
                      <div className="mt-8 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-900 mb-2">Demo Mode</h3>
                        <p className="text-sm text-blue-700">
                          You're currently in demo mode. Settings are saved locally and won't affect a real account.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
