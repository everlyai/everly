"use client"

import { useState } from "react"
import { Check, ArrowRight, ArrowLeft, Phone, Calendar, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ElderData, CaregiverData } from "@/app/page"

interface RegistrationFlowProps {
  onComplete: (elder: ElderData, caregiver: CaregiverData) => void
}

const steps = [
  { id: 1, name: "Your account" },
  { id: 2, name: "Add elder" },
  { id: 3, name: "Confirm link" },
  { id: 4, name: "Done" },
]

export function RegistrationFlow({ onComplete }: RegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  
  // Caregiver data
  const [caregiverFirstName, setCaregiverFirstName] = useState("")
  const [caregiverLastName, setCaregiverLastName] = useState("")
  const [caregiverEmail, setCaregiverEmail] = useState("")
  const [caregiverPhone, setCaregiverPhone] = useState("")
  const [caregiverPassword, setCaregiverPassword] = useState("")
  const [caregiverConsent, setCaregiverConsent] = useState(false)
  
  // Elder data
  const [elderFirstName, setElderFirstName] = useState("")
  const [elderLastName, setElderLastName] = useState("")
  const [elderPhone, setElderPhone] = useState("")
  const [elderDOB, setElderDOB] = useState("")
  const [relationship, setRelationship] = useState("")
  const [thingsTheyLove, setThingsTheyLove] = useState("")
  const [elderConsent, setElderConsent] = useState(false)
  
  // SMS alerts toggle
  const [smsAlerts, setSmsAlerts] = useState(true)

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete(
      {
        firstName: elderFirstName,
        lastName: elderLastName,
        phone: elderPhone,
        dateOfBirth: elderDOB,
        relationship,
        thingsTheyLove,
      },
      {
        firstName: caregiverFirstName,
        lastName: caregiverLastName,
        email: caregiverEmail,
        phone: caregiverPhone,
      }
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-[var(--amber)] flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-foreground">Gentle Assistance</span>
        </div>
        <p className="text-muted-foreground text-sm">A living memoir. A safer home.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step.id < currentStep
                    ? "bg-[var(--amber)] text-white"
                    : step.id === currentStep
                    ? "bg-[var(--amber)] text-white"
                    : "bg-white border-2 border-[var(--border)] text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  step.id === currentStep
                    ? "text-[var(--amber-dark)] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 mt-[-18px] ${
                  step.id < currentStep ? "bg-[var(--amber)]" : "bg-[var(--border)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[var(--border)] shadow-sm p-8">
        {currentStep === 1 && (
          <Step1Caregiver
            firstName={caregiverFirstName}
            setFirstName={setCaregiverFirstName}
            lastName={caregiverLastName}
            setLastName={setCaregiverLastName}
            email={caregiverEmail}
            setEmail={setCaregiverEmail}
            phone={caregiverPhone}
            setPhone={setCaregiverPhone}
            password={caregiverPassword}
            setPassword={setCaregiverPassword}
            consent={caregiverConsent}
            setConsent={setCaregiverConsent}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2Elder
            firstName={elderFirstName}
            setFirstName={setElderFirstName}
            lastName={elderLastName}
            setLastName={setElderLastName}
            phone={elderPhone}
            setPhone={setElderPhone}
            dob={elderDOB}
            setDOB={setElderDOB}
            relationship={relationship}
            setRelationship={setRelationship}
            thingsTheyLove={thingsTheyLove}
            setThingsTheyLove={setThingsTheyLove}
            consent={elderConsent}
            setConsent={setElderConsent}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <Step3Confirm
            caregiverName={`${caregiverFirstName} ${caregiverLastName}`}
            elderName={`${elderFirstName} ${elderLastName}`}
            elderPhone={elderPhone}
            smsAlerts={smsAlerts}
            setSmsAlerts={setSmsAlerts}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <Step4Done
            elderName={`${elderFirstName} ${elderLastName}`}
            onGoToDashboard={handleComplete}
          />
        )}
      </div>
    </div>
  )
}

// Step 1: Caregiver Account
function Step1Caregiver({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  consent,
  setConsent,
  onNext,
}: {
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  password: string
  setPassword: (v: string) => void
  consent: boolean
  setConsent: (v: boolean) => void
  onNext: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Create your caregiver account</h2>
        <p className="text-muted-foreground text-sm">
          You&apos;ll use this to access call summaries, stories, and mood alerts.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">First name</label>
          <Input
            placeholder="Sarah"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white border-[var(--border)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Last name</label>
          <Input
            placeholder="Whitfield"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-white border-[var(--border)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Email address</label>
        <Input
          type="email"
          placeholder="sarah@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border-[var(--border)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Phone number (for SMS alerts)</label>
        <Input
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-white border-[var(--border)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Password</label>
        <Input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white border-[var(--border)]"
        />
      </div>

      <div className="h-px bg-[var(--border)]" />

      <div className="bg-[var(--consent-bg)] rounded-lg p-4 flex items-start gap-3">
        <Checkbox
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked as boolean)}
          className="mt-0.5 data-[state=checked]:bg-[var(--amber)] data-[state=checked]:border-[var(--amber)]"
        />
        <label className="text-sm text-foreground leading-relaxed">
          I confirm that I have permission to enroll an elder family member and will obtain their verbal consent before their first call.
        </label>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="bg-foreground text-white hover:bg-foreground/90"
        >
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

// Step 2: Add Elder
function Step2Elder({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  dob,
  setDOB,
  relationship,
  setRelationship,
  thingsTheyLove,
  setThingsTheyLove,
  consent,
  setConsent,
  onNext,
  onBack,
}: {
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  dob: string
  setDOB: (v: string) => void
  relationship: string
  setRelationship: (v: string) => void
  thingsTheyLove: string
  setThingsTheyLove: (v: string) => void
  consent: boolean
  setConsent: (v: boolean) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Add your elder&apos;s details</h2>
        <p className="text-muted-foreground text-sm">
          Gentle Assistance will call them at this number. No app or smartphone needed — just a regular phone call.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">First name</label>
          <Input
            placeholder="Dorothy"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-white border-[var(--border)]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Last name</label>
          <Input
            placeholder="Whitfield"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-white border-[var(--border)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Their phone number (landline or cell)</label>
        <Input
          type="tel"
          placeholder="+1 (416) 555-0199"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-white border-[var(--border)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Date of birth</label>
        <Input
          type="date"
          value={dob}
          onChange={(e) => setDOB(e.target.value)}
          className="bg-white border-[var(--border)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Your relationship to them</label>
        <Select value={relationship} onValueChange={setRelationship}>
          <SelectTrigger className="w-full bg-white border-[var(--border)]">
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grandchild">Grandchild</SelectItem>
            <SelectItem value="child">Son/Daughter</SelectItem>
            <SelectItem value="niece-nephew">Niece/Nephew</SelectItem>
            <SelectItem value="spouse">Spouse</SelectItem>
            <SelectItem value="sibling">Sibling</SelectItem>
            <SelectItem value="friend">Close Friend</SelectItem>
            <SelectItem value="caregiver">Professional Caregiver</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">A few things they love (optional)</label>
        <Input
          placeholder="e.g. gardening, knitting, old movies..."
          value={thingsTheyLove}
          onChange={(e) => setThingsTheyLove(e.target.value)}
          className="bg-white border-[var(--border)]"
        />
      </div>

      <div className="h-px bg-[var(--border)]" />

      <div className="bg-[var(--consent-bg)] rounded-lg p-4 flex items-start gap-3">
        <Checkbox
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked as boolean)}
          className="mt-0.5 data-[state=checked]:bg-[var(--amber)] data-[state=checked]:border-[var(--amber)]"
        />
        <label className="text-sm text-foreground leading-relaxed">
          I confirm that {firstName || "they"} {firstName ? "has" : "have"} verbally consented to receiving AI-assisted phone calls through Gentle Assistance and having call summaries shared with me.
        </label>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-[var(--border)]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-foreground text-white hover:bg-foreground/90"
        >
          Confirm & link <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

// Step 3: Confirm Link
function Step3Confirm({
  caregiverName,
  elderName,
  elderPhone,
  smsAlerts,
  setSmsAlerts,
  onNext,
  onBack,
}: {
  caregiverName: string
  elderName: string
  elderPhone: string
  smsAlerts: boolean
  setSmsAlerts: (v: boolean) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Confirm your connection</h2>
        <p className="text-muted-foreground text-sm">
          Review the details below. Here&apos;s exactly what will happen next.
        </p>
      </div>

      {/* Connection Visualization */}
      <div className="bg-[var(--cream)] rounded-xl p-6">
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[var(--amber-light)] flex items-center justify-center text-2xl font-semibold text-[var(--amber-dark)]">
              {caregiverName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <span className="mt-2 text-sm font-medium text-foreground">{caregiverName}</span>
            <span className="text-xs text-muted-foreground">Caregiver</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-[var(--amber)]" />
              <Heart className="w-5 h-5 text-[var(--amber)]" />
              <div className="w-8 h-0.5 bg-[var(--amber)]" />
            </div>
            <span className="text-xs text-muted-foreground mt-1">Connected</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[var(--amber-light)] flex items-center justify-center text-2xl font-semibold text-[var(--amber-dark)]">
              {elderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <span className="mt-2 text-sm font-medium text-foreground">{elderName}</span>
            <span className="text-xs text-muted-foreground">Elder</span>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">What happens next:</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--sage-light)] flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-[var(--sage)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">First call in 10 minutes</p>
              <p className="text-xs text-muted-foreground">
                Gentle Assistance will call {elderName.split(" ")[0]} at {elderPhone || "their number"} for a friendly introduction.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--amber-light)] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-[var(--amber-dark)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Weekly story PDFs</p>
              <p className="text-xs text-muted-foreground">
                Every Sunday, you&apos;ll receive a beautifully formatted excerpt of stories captured that week.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--coral-light)] flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-[var(--coral)]" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">SMS mood alerts</p>
                <p className="text-xs text-muted-foreground">
                  Get notified if we detect concerning mood changes.
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    smsAlerts ? "bg-[var(--sage)]" : "bg-[var(--border)]"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      smsAlerts ? "left-5" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--border)]" />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-[var(--border)]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-[var(--sage)] text-white hover:bg-[var(--sage)]/90"
        >
          Confirm & start <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

// Step 4: Done
function Step4Done({
  elderName,
  onGoToDashboard,
}: {
  elderName: string
  onGoToDashboard: () => void
}) {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="w-20 h-20 rounded-full bg-[var(--sage-light)] flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-[var(--sage)]" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">You&apos;re all set!</h2>
        <p className="text-muted-foreground">
          {elderName}&apos;s first call will happen in about 10 minutes. We&apos;ll introduce ourselves gently and start getting to know them.
        </p>
      </div>

      <div className="bg-[var(--cream)] rounded-xl p-4 text-left space-y-3">
        <p className="text-sm text-foreground font-medium">What to expect:</p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[var(--sage)]">•</span>
            A friendly AI will call {elderName.split(" ")[0]} and have a warm conversation
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--sage)]">•</span>
            After each call, you&apos;ll see a summary on your dashboard
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--sage)]">•</span>
            Stories and memories will be captured and formatted for you weekly
          </li>
        </ul>
      </div>

      <Button
        onClick={onGoToDashboard}
        className="bg-foreground text-white hover:bg-foreground/90 w-full"
        size="lg"
      >
        Go to {elderName.split(" ")[0]}&apos;s dashboard <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
