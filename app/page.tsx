"use client";

import { FormEvent, useMemo, useState } from "react";

type FormValues = {
  fullName: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  goal: string;
  cadence: string;
  agree: boolean;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  fullName: "",
  email: "",
  company: "",
  role: "",
  teamSize: "",
  goal: "",
  cadence: "",
  agree: false,
};

const steps = ["Profile", "Workspace", "Preferences", "Review"];

export default function Home() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});

  const completion = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function updateValue<Field extends keyof FormValues>(
    field: Field,
    value: FormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateStep(currentStep: number) {
    const nextErrors: FieldErrors = {};

    if (currentStep === 0) {
      if (!values.fullName.trim()) nextErrors.fullName = "Enter your full name.";
      if (!values.email.trim()) {
        nextErrors.email = "Enter your work email.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (currentStep === 1) {
      if (!values.company.trim()) nextErrors.company = "Enter your company name.";
      if (!values.role) nextErrors.role = "Choose your role.";
      if (!values.teamSize) nextErrors.teamSize = "Choose a team size.";
    }

    if (currentStep === 2) {
      if (!values.goal.trim()) nextErrors.goal = "Describe what you want to accomplish.";
      if (!values.cadence) nextErrors.cadence = "Choose an update cadence.";
      if (!values.agree) nextErrors.agree = "Confirm that the setup details are accurate.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="page">
        <section className="success" aria-labelledby="success-title">
          <div className="success-mark" aria-hidden="true">
            ✓
          </div>
          <p className="eyebrow">Setup complete</p>
          <h1 id="success-title">Welcome aboard, {values.fullName.split(" ")[0]}.</h1>
          <p className="summary">
            Your onboarding workspace for {values.company} is ready. The first
            {" "}
            {values.cadence.toLowerCase()} check-in will focus on {values.goal}
          </p>
          <button className="primary-action" onClick={() => setSubmitted(false)}>
            Review setup
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <form className="onboarding" onSubmit={submitForm} noValidate>
        <aside className="progress-panel" aria-label="Onboarding progress">
          <p className="eyebrow">Account onboarding</p>
          <h1>Set up your workspace</h1>
          <p className="summary">
            Complete the essentials so your team starts with the right context.
          </p>

          <div className="meter" aria-hidden="true">
            <span style={{ width: `${completion}%` }} />
          </div>

          <ol className="step-list">
            {steps.map((label, index) => (
              <li
                className={index === step ? "active" : index < step ? "done" : ""}
                key={label}
              >
                <span>{index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
        </aside>

        <section className="form-panel" aria-live="polite">
          <div className="step-heading">
            <p>Step {step + 1} of {steps.length}</p>
            <h2>{steps[step]}</h2>
          </div>

          {step === 0 && (
            <div className="field-grid">
              <TextField
                error={errors.fullName}
                label="Full name"
                name="fullName"
                onChange={(value) => updateValue("fullName", value)}
                placeholder="Jordan Lee"
                value={values.fullName}
              />
              <TextField
                error={errors.email}
                label="Work email"
                name="email"
                onChange={(value) => updateValue("email", value)}
                placeholder="jordan@company.com"
                type="email"
                value={values.email}
              />
            </div>
          )}

          {step === 1 && (
            <div className="field-grid">
              <TextField
                error={errors.company}
                label="Company"
                name="company"
                onChange={(value) => updateValue("company", value)}
                placeholder="Northstar Labs"
                value={values.company}
              />
              <SelectField
                error={errors.role}
                label="Role"
                name="role"
                onChange={(value) => updateValue("role", value)}
                options={["Founder", "Operations", "Product", "Engineering", "Sales"]}
                value={values.role}
              />
              <SelectField
                error={errors.teamSize}
                label="Team size"
                name="teamSize"
                onChange={(value) => updateValue("teamSize", value)}
                options={["1-10", "11-50", "51-200", "201+"]}
                value={values.teamSize}
              />
            </div>
          )}

          {step === 2 && (
            <div className="field-grid">
              <label className="field wide" htmlFor="goal">
                <span>Primary goal</span>
                <textarea
                  aria-describedby={errors.goal ? "goal-error" : undefined}
                  aria-invalid={Boolean(errors.goal)}
                  id="goal"
                  name="goal"
                  onChange={(event) => updateValue("goal", event.target.value)}
                  placeholder="Improve launch planning across product and operations."
                  value={values.goal}
                />
                {errors.goal && (
                  <strong className="error" id="goal-error">
                    {errors.goal}
                  </strong>
                )}
              </label>
              <SelectField
                error={errors.cadence}
                label="Check-in cadence"
                name="cadence"
                onChange={(value) => updateValue("cadence", value)}
                options={["Weekly", "Biweekly", "Monthly"]}
                value={values.cadence}
              />
              <label className="checkbox-field wide">
                <input
                  checked={values.agree}
                  onChange={(event) => updateValue("agree", event.target.checked)}
                  type="checkbox"
                />
                <span>These onboarding details are accurate.</span>
              </label>
              {errors.agree && <strong className="error">{errors.agree}</strong>}
            </div>
          )}

          {step === 3 && (
            <div className="review-grid">
              <ReviewItem label="Name" value={values.fullName} />
              <ReviewItem label="Email" value={values.email} />
              <ReviewItem label="Company" value={values.company} />
              <ReviewItem label="Role" value={values.role} />
              <ReviewItem label="Team size" value={values.teamSize} />
              <ReviewItem label="Cadence" value={values.cadence} />
              <ReviewItem label="Goal" value={values.goal} wide />
            </div>
          )}

          <div className="actions">
            <button disabled={step === 0} onClick={goBack} type="button">
              Back
            </button>
            {step < steps.length - 1 ? (
              <button
                className="primary-action"
                key="continue"
                onClick={(event) => {
                  event.preventDefault();
                  goNext();
                }}
                type="button"
              >
                Continue
              </button>
            ) : (
              <button className="primary-action" key="finish" type="submit">
                Finish setup
              </button>
            )}
          </div>
        </section>
      </form>
    </main>
  );
}

function TextField({
  error,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  error?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      <input
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={Boolean(error)}
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error && (
        <strong className="error" id={`${name}-error`}>
          {error}
        </strong>
      )}
    </label>
  );
}

function SelectField({
  error,
  label,
  name,
  onChange,
  options,
  value,
}: {
  error?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      <select
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={Boolean(error)}
        id={name}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">Choose one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <strong className="error" id={`${name}-error`}>
          {error}
        </strong>
      )}
    </label>
  );
}

function ReviewItem({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "review-item wide" : "review-item"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
