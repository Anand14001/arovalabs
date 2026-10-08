import { useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Check, Loader2 } from 'lucide-react';
import { contactPage } from '../../data/pages';
import { contact } from '../../data/site';
import { api, ApiError } from '../../lib/api';

/*
 * The enquiry form, rendered inside the hero beside the photograph.
 *
 * Connected directly to the backend POST /api/v1/contact endpoint.
 * Includes rate limit handling, field error mapping, and honeypot protection.
 */

const TOPICS = ['Tests', 'Packages', 'Home Collection', 'Reports', 'Other'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[\d\s+()-]{7,18}$/;

function validate(values) {
  const errors = {};

  if (!values.email.trim()) errors.email = 'Enter an email address so we can reply.';
  else if (!EMAIL.test(values.email.trim())) errors.email = 'That email address is not valid.';

  if (values.phone.trim() && !PHONE.test(values.phone.trim()))
    errors.phone = 'Enter a valid phone number, or leave this blank.';

  if (!values.message.trim()) errors.message = 'Tell us how we can help.';

  return errors;
}

const EMPTY = { name: '', phone: '', email: '', topic: TOPICS[0], message: '', website_hp: '' };

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | sent | error
  const formRef = useRef(null);

  const update = (name) => (event) => {
    const next = { ...values, [name]: event.target.value };
    setValues(next);
    if (status === 'sent' || status === 'error') {
      setStatus('idle');
      setServerError('');
    }

    // Re-validate only fields already carrying an error, so a message clears as
    // soon as it is fixed without new ones appearing mid-typing.
    if (errors[name]) {
      const re = validate(next);
      setErrors((prev) => ({ ...prev, [name]: re[name] }));
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setServerError('');

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="form_fields[${firstInvalid}]"]`)?.focus();
      return;
    }

    setStatus('submitting');

    try {
      await api.submitContact({
        name: values.name.trim() || undefined,
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        topic: values.topic,
        message: values.message.trim(),
        website_hp: values.website_hp || undefined,
        source: 'contact_page',
      });
      setStatus('sent');
      setValues(EMPTY);
      setErrors({});
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) {
        if (err.status === 422 && err.fields) {
          setErrors(err.fields);
          const firstField = Object.keys(err.fields)[0];
          if (firstField) {
            formRef.current?.querySelector(`[name="form_fields[${firstField}]"]`)?.focus();
          }
          return;
        }
        if (err.status === 429) {
          setServerError('Too many enquiries submitted recently. Please try again later or call us directly.');
          return;
        }
        setServerError(err.message || 'Something went wrong while sending your enquiry.');
      } else {
        setServerError('Network connection issue. Please check your internet and try again.');
      }
    }
  };

  const busy = status === 'submitting';

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={submit}
      className="card p-6 sm:p-8"
      aria-busy={busy}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="name"
          label={contactPage.form.fields[0].label}
          placeholder={contactPage.form.fields[0].placeholder}
          value={values.name}
          onChange={update('name')}
          error={errors.name}
          autoComplete="name"
        />

        <Field
          name="phone"
          type="tel"
          label="Phone"
          placeholder={contact.homeCollection.label}
          value={values.phone}
          onChange={update('phone')}
          error={errors.phone}
          autoComplete="tel"
        />

        <Field
          className="sm:col-span-2"
          name="email"
          type="email"
          required
          label={contactPage.form.fields[1].label}
          placeholder={contactPage.form.fields[1].placeholder}
          value={values.email}
          onChange={update('email')}
          error={errors.email}
          autoComplete="email"
        />

        <Field
          className="sm:col-span-2"
          name="topic"
          as="select"
          label="Enquiry type"
          value={values.topic}
          onChange={update('topic')}
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Field>

        <Field
          className="sm:col-span-2"
          name="message"
          as="textarea"
          required
          label={contactPage.form.fields[2].label}
          placeholder={contactPage.form.fields[2].placeholder}
          value={values.message}
          onChange={update('message')}
          error={errors.message}
        />
      </div>

      {/* Honeypot anti-spam field: hidden from real visitors */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website_hp"
          tabIndex="-1"
          autoComplete="off"
          value={values.website_hp}
          onChange={update('website_hp')}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="btn-brand group mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            {contactPage.form.button}
          </>
        ) : (
          <>
            {contactPage.form.button}
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      <p className="mt-4 text-center text-[12px] leading-snug text-ink/45">
        {contactPage.form.disclaimer}
      </p>

      {/*
        The outcome lives in a polite live region, so a screen reader hears the
        result without the region being announced on mount.
      */}
      <div aria-live="polite" className="empty:hidden">
        {status === 'sent' && (
          <p className="mt-5 flex items-start gap-3 rounded-xl bg-brand-light px-4 py-3.5 text-sm text-brand">
            <Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Thank you! Your enquiry has been received. Our diagnostics team will contact you shortly.
            </span>
          </p>
        )}
        {status === 'error' && serverError && (
          <p className="mt-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3.5 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{serverError}</span>
          </p>
        )}
      </div>
    </form>
  );
}

/*
 * One field. Input, select and textarea share a shell so their rings, focus
 * states and error treatment can never drift apart.
 */
function Field({
  name,
  label,
  as = 'input',
  type = 'text',
  required,
  error,
  className = '',
  children,
  ...rest
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;

  const shell = `w-full rounded-xl bg-white px-4 py-3 text-sm text-ink outline-none ring-1 ring-inset transition-shadow placeholder:text-ink/30 ${
    error ? 'ring-2 ring-accent focus:ring-accent' : 'ring-ink/15 focus:ring-2 focus:ring-brand'
  }`;

  const shared = {
    id,
    name: `form_fields[${name}]`,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: shell,
    ...rest,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-left text-[13px] font-semibold text-ink">
        {label}
        {required && (
          <span className="text-accent" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      {as === 'textarea' ? (
        <textarea rows={5} {...shared} />
      ) : as === 'select' ? (
        <select {...shared} className={`${shell} cursor-pointer`}>
          {children}
        </select>
      ) : (
        <input type={type} {...shared} />
      )}

      {error && (
        <p id={errorId} className="mt-2 flex items-center gap-1.5 text-[12px] text-accent-dark">
          <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
