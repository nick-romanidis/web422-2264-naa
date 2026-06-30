# Lab: Build &amp; Validate a Registration Form (React Hook Form)

In the notes we saw how to build forms in React using **Controlled Components** and
then how the **React Hook Form** library simplifies the same work and adds powerful
**validation**. In this lab you will put both chapters to work by building a single
**registration form** in a **Next.js** app:

- **Part 1** builds the form with React Hook Form (`useForm`, `register`, `handleSubmit`).
- **Part 2** adds validation (rules, error messages, field highlighting, disabling submit).

The whole activity should take about **one hour**.

## Getting Started

To begin, we will use the **"registration-form-missing"** example from the sample code
as a starting point.

Once you have the source code:

- Open the **"registration-form-missing"** folder in your code editor (ie: "Visual Studio Code")
- Open the **"my-app"** folder in the integrated terminal
- Run the command **"npm install"** (alternatively: **"npm i"**) to install the dependencies
- Build / Run the site with the usual command: **"npm run dev"**
- Browse the site at <http://localhost:3000>

The site runs as-is, but the form is not wired up yet: every field renders, but the
**"Create Account"** button only logs `TODO: wire up React Hook Form` to the console and
nothing is validated.

## File Structure

The project is a standard Next.js (Pages Router) app. The only file you will edit is
**"pages/index.js"** (plus a quick peek at the CSS):

- **pages/index.js**: The registration form. This is where **all** of your work happens.
  It currently contains plain HTML form controls and a list of `TODO (Part 1)` /
  `TODO (Part 2)` comments showing where code needs to be added.

- **styles/globals.css**: Basic site styles. It already includes the `.inputError` and
  `.errorMsg` classes that you will use in Part 2.

- **components/Layout.js**: A simple shared layout (the page heading). You will not need
  to change this.

- **pages/_app.js**: The Next.js boilerplate, with `<Layout>...</Layout>` already wrapping
  the app.

---

## Part 1 &mdash; Building the form with React Hook Form

Before we begin, we must install React Hook Form using the command:

```
npm i react-hook-form
```

### Importing "useForm"

At the very top of **"pages/index.js"**, import the `useForm` hook and add `useEffect` to
the existing React import:

```js
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
```

### Calling the "useForm" hook

Inside the `RegisterPage` component, replace the placeholder `useState` line with a call to
`useForm`. We pass `defaultValues` for every field so each control starts as a "controlled"
field with a known value:

```js
const {
  register,
  handleSubmit,
  setValue,
  watch,
  formState: { errors },
} = useForm({
  defaultValues: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: 16,
    country: "",
    plan: "",
    bio: "",
    newsletter: false,
    terms: false,
  },
});

const [submitted, setSubmitted] = useState(null);
```

We will use `register`, `handleSubmit`, `setValue`, `watch` and `errors` over the course of
this lab. The `submitted` state simply lets us show the result on the page after submitting.

### Registering the form controls

The key idea in React Hook Form is **"registering"** each control. Instead of writing
`value` / `onChange` for every field (as we did with Controlled Components), we spread the
result of `register("fieldName")` onto the control.

Update the `<form>` so it submits through `handleSubmit`, then register every control. Notice
there is **no special syntax** for different control types &mdash; `<input>`, `<select>`,
radio buttons, `<textarea>` and checkboxes are all registered the same way:

```jsx
<form onSubmit={handleSubmit(submitForm)}>
  Username:
  <br />
  <input {...register("username")} />
  <br />
  <br />
  Email:
  <br />
  <input type="email" {...register("email")} />
  <br />
  <br />
  Password:
  <br />
  <input type="password" {...register("password")} />
  <br />
  <br />
  Confirm Password:
  <br />
  <input type="password" {...register("confirmPassword")} />
  <br />
  <br />
  Age:
  <br />
  <input type="number" {...register("age")} />
  <br />
  <br />
  Country:
  <br />
  <select {...register("country")}>
    <option value="">-- choose --</option>
    <option value="ca">Canada</option>
    <option value="us">United States</option>
    <option value="other">Other</option>
  </select>
  <br />
  <br />
  Plan:
  <br />
  <input type="radio" value="free" {...register("plan")} /> Free
  <br />
  <input type="radio" value="pro" {...register("plan")} /> Pro
  <br />
  <br />
  Bio:
  <br />
  <textarea {...register("bio")} />
  <br />
  <br />
  <input type="checkbox" {...register("newsletter")} /> Subscribe to newsletter
  <br />
  <input type="checkbox" {...register("terms")} /> I accept the terms
  <br />
  <br />
  <button type="submit">Create Account</button>
</form>
```

> Note that both radio buttons register the **same** field name (`"plan"`), which is how
> React Hook Form knows they belong to one group.

### Handling submission

Replace the placeholder `submitForm` function. With React Hook Form, the function passed to
`handleSubmit` automatically receives the collected form **data** (not the event). We log it
and store it so it shows up on the page:

```js
function submitForm(data) {
  console.log(data);
  setSubmitted(data);
}
```

Finally, add the "result" block below the form (if it is not already there), so the submitted
data is visible:

```jsx
{submitted && (
  <>
    <hr />
    <h3>Submitted data</h3>
    <pre>{JSON.stringify(submitted, null, 2)}</pre>
  </>
)}
```

If we refresh the site now, we can fill in the form, click **"Create Account"**, and see the
data appear both in the console and on the page.

### Pre-filling the form with "setValue"

In a real app the initial values usually come from a Web API and are not available until
after the component first renders. The chapter's pattern is to set the values inside a
`useEffect` using `setValue`. Add this just below the `submitted` state:

```js
useEffect(() => {
  const data = {
    username: "homer",
    email: "homer@example.com",
    age: 39,
    country: "ca",
  };

  // set the value of each form field to match "data"
  for (const prop in data) {
    setValue(prop, data[prop]);
  }
}, []);
```

Because the registered field names match the property names in `data`, this `for...in` loop
fills in the matching controls. Refresh the page &mdash; the username, email, age and country
should now be pre-filled.

### "Watching" the password (for Part 2)

We will need the current value of the `password` field in Part 2 (to confirm it matches).
React Hook Form lets us **"watch"** a field. Add this line after the `useForm` call:

```js
const password = watch("password");
```

This gives us a `password` variable that always holds the live value of the password field.

---

## Part 2 &mdash; Adding validation

Right now the form accepts anything. React Hook Form adds validation through a **second
argument** to `register`, where we list the rules for that field.

### Adding validation rules

Update each `register(...)` call to include its rules. The rules below combine the
"native" validation rules (`required`, `minLength`, `maxLength`, `pattern`, `min`, `max`) with
two **custom** rules using `validate`:

```jsx
<input {...register("username", { required: true, minLength: 3, maxLength: 20 })} />

<input type="email" {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })} />

<input
  type="password"
  {...register("password", {
    required: true,
    minLength: 8,
    validate: { hasNumber: (v) => /[0-9]/.test(v) },
  })}
/>

<input
  type="password"
  {...register("confirmPassword", { validate: { matches: (v) => v === password } })}
/>

<input type="number" {...register("age", { required: true, min: 16, max: 120 })} />

<select {...register("country", { required: true })}> ... </select>

<input type="radio" value="free" {...register("plan", { required: true })} /> Free
<input type="radio" value="pro" {...register("plan", { required: true })} /> Pro

<textarea {...register("bio", { maxLength: 200 })} />

<input type="checkbox" {...register("terms", { required: true })} /> I accept the terms
```

Notice the two custom rules:

- **`hasNumber`** ensures the password contains at least one digit.
- **`matches`** ensures `confirmPassword` equals the `password` value we are **watching**
  from Part 1.

If you try to submit with an invalid field now, the first offending field is **focused** and
the `submitForm` function does **not** run &mdash; but the user is not told *why*. Let's fix that.

### Showing error messages

To display errors we use the `errors` object we already pulled from `formState`. Each field
that breaks a rule appears as a property on `errors`, and the specific rule that failed is in
its `type`. Add error `<span>`s after the relevant controls. For example, for `username`:

```jsx
<input {...register("username", { required: true, minLength: 3, maxLength: 20 })} />
{errors.username?.type === "required" && <span className="errorMsg">Username is required</span>}
{errors.username?.type === "minLength" && <span className="errorMsg">At least 3 characters</span>}
{errors.username?.type === "maxLength" && <span className="errorMsg">At most 20 characters</span>}
```

> The optional chaining operator (`?.`) is important here &mdash; without it you would get a
> `TypeError` when the field has no errors.

Add matching messages for the other fields, for example:

```jsx
{errors.email?.type === "required" && <span className="errorMsg">Email is required</span>}
{errors.email?.type === "pattern" && <span className="errorMsg">Enter a valid email</span>}

{errors.password?.type === "minLength" && <span className="errorMsg">At least 8 characters</span>}
{errors.password?.type === "hasNumber" && <span className="errorMsg">Must contain a number</span>}

{errors.confirmPassword?.type === "matches" && <span className="errorMsg">Passwords must match</span>}

{errors.age?.type === "min" && <span className="errorMsg">Must be 16 or older</span>}
{errors.age?.type === "max" && <span className="errorMsg">Enter a valid age</span>}

{errors.country?.type === "required" && <span className="errorMsg">Please choose a country</span>}
{errors.plan?.type === "required" && <span className="errorMsg">Please select a plan</span>}
{errors.bio?.type === "maxLength" && <span className="errorMsg">200 characters max</span>}
{errors.terms?.type === "required" && <span className="errorMsg"> (required)</span>}
```

Try submitting an empty form. The error messages show up after the first submit, then update
live as you correct each field.

### Highlighting fields in error

The `.inputError` class is already defined in `styles/globals.css`. Because `errors` contains
a property for every field in error, we can conditionally add the class:

```jsx
<input
  className={errors.username && "inputError"}
  {...register("username", { required: true, minLength: 3, maxLength: 20 })}
/>
```

Add `className={errors.fieldName && "inputError"}` to the other controls (`email`, `password`,
`confirmPassword`, `age`, `country`). Invalid fields now show a red border.

### Disabling the submit button

Finally, we can prevent submission entirely while the form is in error by counting the
properties on `errors` with `Object.keys()`:

```jsx
<button type="submit" disabled={Object.keys(errors).length > 0}>
  Create Account
</button>
```

The button is now disabled whenever one or more fields are invalid.

---

## Wrap up

You have built and validated a complete registration form using React Hook Form. Here is where
each concept came from:

| Concept | Chapter | Where it appears |
| --- | --- | --- |
| `useForm`, `register`, `handleSubmit` | React Forms | Part 1 |
| `defaultValues` &amp; `setValue` in `useEffect` | React Forms | Part 1 |
| `watch` | React Forms | Part 1 (used by Part 2) |
| Native rules (`required`, `min/max`, `minLength/maxLength`, `pattern`) | Validation | Part 2 |
| Custom `validate` rules (`hasNumber`, `matches`) | Validation | Part 2 |
| `formState.errors` &amp; `errors.field?.type` messages | Validation | Part 2 |
| `inputError` highlight class | Validation | Part 2 |
| Disabling submit with `Object.keys(errors).length` | Validation | Part 2 |

A finished reference is available in the **"registration-form-complete"** folder.
