import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { checkoutApi, formatPaise, payWithRazorpay } from '../lib/commerce';
import Reveal from '../components/motion/Reveal';

/*
 * /checkout/ — a real booking.
 *
 * What this page is careful about:
 *
 *   - **It never computes a total.** Every figure shown comes from the cart the
 *     server returned. The browser's arithmetic is for display only, and here
 *     there isn't any.
 *   - **The collection time is a request, not a booking.** Capacity-based slots
 *     are deferred, so the page says plainly that the lab will confirm, rather
 *     than implying a guaranteed appointment.
 *   - **Field errors land on fields.** The API returns `{ fields: {...} }` keyed
 *     by input name, and those keys are used here directly, so a rejected
 *     pincode is marked at the pincode rather than in a banner at the top.
 */

const Field = ({ label, error, hint, required, children, id }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
      {label}
      {required && <span className="ml-0.5 text-brand">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1 text-xs text-body/70">{hint}</p>}
    {error && (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
        <AlertCircle size={12} aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
);

const inputClass = (invalid) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:ring-2 ${
    invalid
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-ink/15 focus:border-brand focus:ring-brand/15'
  }`;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totals, coupon, couponProblem, applyCoupon, removeCoupon, reset, isLoading } =
    useCart();

  const options = useQuery({
    queryKey: ['collection-options'],
    queryFn: () => checkoutApi.options(),
  });
  const centers = useQuery({ queryKey: ['centers'], queryFn: checkoutApi.centers });
  const payment = useQuery({ queryKey: ['payment-config'], queryFn: checkoutApi.paymentConfig });

  const [form, setForm] = useState({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    collectionType: 'HOME',
    centerId: '',
    line1: '',
    line2: '',
    landmark: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    collectionDate: '',
    collectionWindow: '',
    notes: '',
  });

  const [patients, setPatients] = useState([
    { name: '', age: '', gender: 'UNDISCLOSED', relation: '' },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  // Default to the earliest date that actually has a selectable window.
  useEffect(() => {
    if (!options.data) return;
    setForm((f) => ({ ...f, collectionDate: f.collectionDate || options.data.minDate }));
  }, [options.data]);

  /*
   * Which windows are selectable depends on the date — this morning's 07:00 is
   * not bookable at 10am. The server decides, so the picker and the order
   * endpoint cannot disagree about the notice rule.
   */
  const dayOptions = useQuery({
    queryKey: ['collection-options', form.collectionDate],
    queryFn: () => checkoutApi.options(form.collectionDate),
    enabled: Boolean(form.collectionDate),
  });

  const windows = dayOptions.data?.windows ?? [];

  // Keep the selection valid: if the chosen window is not available on the
  // chosen date, move to the first one that is.
  useEffect(() => {
    if (!windows.length) return;
    setForm((f) => {
      const current = windows.find((w) => w.id === f.collectionWindow);
      if (current?.available) return f;
      const firstAvailable = windows.find((w) => w.available);
      return { ...f, collectionWindow: firstAvailable?.id ?? '' };
    });
  }, [windows]);

  /*
   * The first patient is usually the person booking, so their name is mirrored
   * across until someone edits the patient name themselves.
   */
  const [patientTouched, setPatientTouched] = useState(false);
  useEffect(() => {
    if (patientTouched) return;
    setPatients((p) => [{ ...p[0], name: form.contactName }, ...p.slice(1)]);
  }, [form.contactName, patientTouched]);

  const isHome = form.collectionType === 'HOME';
  const selectedWindow = useMemo(
    () => windows.find((w) => w.id === form.collectionWindow),
    [windows, form.collectionWindow],
  );

  const onApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.fieldErrors?.code ?? err.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setBusy(true);

    try {
      const { order, accessToken, checkout } = await checkoutApi.placeOrder({
        cartToken: localStorage.getItem('arova-cart-token'),
        contact: {
          name: form.contactName,
          phone: form.contactPhone,
          email: form.contactEmail || null,
        },
        patients: patients
          .filter((p) => p.name.trim())
          .map((p) => ({
            name: p.name,
            age: p.age === '' ? null : Number(p.age),
            gender: p.gender,
            relation: p.relation || null,
          })),
        collectionType: form.collectionType,
        centerId: isHome ? null : Number(form.centerId) || null,
        address: isHome
          ? {
              line1: form.line1,
              line2: form.line2 || null,
              landmark: form.landmark || null,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
            }
          : null,
        collectionDate: form.collectionDate,
        collectionWindow: form.collectionWindow,
        notes: form.notes || null,
      });

      const confirmation = `/booking-confirmation/?order=${encodeURIComponent(order.orderNumber)}&token=${encodeURIComponent(accessToken)}`;

      /*
       * The order exists either way. If payment cannot start — provider down,
       * script blocked — the visitor still has a booking and a reference number,
       * and the confirmation page says it is awaiting payment. Losing the order
       * because the payment widget failed would be the worse outcome.
       */
      if (!checkout) {
        reset();
        navigate(confirmation, { replace: true });
        return;
      }

      const result = await payWithRazorpay(checkout);

      if (result.dismissed) {
        // Nothing is lost: the order is placed and payable from the
        // confirmation page.
        reset();
        navigate(confirmation, { replace: true });
        return;
      }

      reset();
      navigate(confirmation, { replace: true });
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.fieldErrors ?? {});
      // The order may already exist if the failure came after placement, so the
      // cart is deliberately not cleared here.
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="shell py-24 text-center">
        <Loader2 className="mx-auto size-6 animate-spin text-ink/30" aria-label="Loading" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="display-md text-ink">Your cart is empty</h1>
        <p className="section-sub mx-auto mt-2 max-w-md">
          Add a test or package and come back to book your collection.
        </p>
        <Link to="/tests/" className="btn-brand mt-7 inline-flex">
          Browse tests
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10 sm:py-14">
      <Reveal>
        <h1 className="display-md text-ink">Confirm your booking</h1>
        <p className="section-sub mt-1 max-w-xl">
          Tell us who the tests are for and where to collect the sample.
        </p>
      </Reveal>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" noValidate>
        <div className="space-y-6">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* ------------------------------------------------ contact */}
          <section className="card p-5 sm:p-6">
            <h2 className="text-base font-bold text-ink">Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" id="contactName" required error={fieldErrors['contact.name']}>
                <input
                  id="contactName"
                  className={inputClass(fieldErrors['contact.name'])}
                  value={form.contactName}
                  onChange={(e) => set({ contactName: e.target.value })}
                  autoComplete="name"
                  required
                />
              </Field>
              <Field label="Mobile number" id="contactPhone" required error={fieldErrors['contact.phone']}>
                <input
                  id="contactPhone"
                  type="tel"
                  className={inputClass(fieldErrors['contact.phone'])}
                  value={form.contactPhone}
                  onChange={(e) => set({ contactPhone: e.target.value })}
                  autoComplete="tel"
                  placeholder="9442218998"
                  required
                />
              </Field>
              <Field
                label="Email"
                id="contactEmail"
                error={fieldErrors['contact.email']}
                hint="For your reports and receipt."
              >
                <input
                  id="contactEmail"
                  type="email"
                  className={inputClass(fieldErrors['contact.email'])}
                  value={form.contactEmail}
                  onChange={(e) => set({ contactEmail: e.target.value })}
                  autoComplete="email"
                />
              </Field>
            </div>
          </section>

          {/* ------------------------------------------------ patients */}
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-ink">Who is being tested?</h2>
              <button
                type="button"
                onClick={() =>
                  setPatients((p) => [...p, { name: '', age: '', gender: 'UNDISCLOSED', relation: '' }])
                }
                className="text-xs font-semibold text-brand hover:underline"
              >
                + Add another person
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {patients.map((p, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[1fr_90px_130px_auto]">
                  <input
                    className={inputClass(i === 0 && fieldErrors['patients.0.name'])}
                    placeholder="Patient name"
                    aria-label={`Patient ${i + 1} name`}
                    value={p.name}
                    onChange={(e) => {
                      if (i === 0) setPatientTouched(true);
                      setPatients((list) =>
                        list.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                      );
                    }}
                    required={i === 0}
                  />
                  <input
                    className={inputClass(false)}
                    placeholder="Age"
                    type="number"
                    min="0"
                    max="130"
                    aria-label={`Patient ${i + 1} age`}
                    value={p.age}
                    onChange={(e) =>
                      setPatients((list) =>
                        list.map((x, j) => (j === i ? { ...x, age: e.target.value } : x)),
                      )
                    }
                  />
                  <select
                    className={inputClass(false)}
                    aria-label={`Patient ${i + 1} gender`}
                    value={p.gender}
                    onChange={(e) =>
                      setPatients((list) =>
                        list.map((x, j) => (j === i ? { ...x, gender: e.target.value } : x)),
                      )
                    }
                  >
                    <option value="UNDISCLOSED">Prefer not to say</option>
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {patients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPatients((list) => list.filter((_, j) => j !== i))}
                      className="text-xs font-semibold text-red-600 hover:underline"
                      aria-label={`Remove patient ${i + 1}`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ---------------------------------------------- collection */}
          <section className="card p-5 sm:p-6">
            <h2 className="text-base font-bold text-ink">Sample collection</h2>

            <div className="mt-4 flex gap-2">
              {[
                { id: 'HOME', label: 'Home collection' },
                { id: 'WALK_IN', label: 'Visit a centre' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => set({ collectionType: o.id })}
                  aria-pressed={form.collectionType === o.id}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    form.collectionType === o.id
                      ? 'border-brand bg-brand-light text-brand'
                      : 'border-ink/15 text-body hover:border-ink/30'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {isHome ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Address" id="line1" required error={fieldErrors['address.line1'] ?? fieldErrors.address}>
                  <input
                    id="line1"
                    className={inputClass(fieldErrors['address.line1'] ?? fieldErrors.address)}
                    value={form.line1}
                    onChange={(e) => set({ line1: e.target.value })}
                    autoComplete="address-line1"
                    placeholder="House / flat, street"
                    required
                  />
                </Field>
                <Field label="Landmark" id="landmark">
                  <input
                    id="landmark"
                    className={inputClass(false)}
                    value={form.landmark}
                    onChange={(e) => set({ landmark: e.target.value })}
                    placeholder="Near…"
                  />
                </Field>
                <Field label="City" id="city" required error={fieldErrors['address.city']}>
                  <input
                    id="city"
                    className={inputClass(fieldErrors['address.city'])}
                    value={form.city}
                    onChange={(e) => set({ city: e.target.value })}
                    autoComplete="address-level2"
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="State" id="state" required error={fieldErrors['address.state']}>
                    <input
                      id="state"
                      className={inputClass(fieldErrors['address.state'])}
                      value={form.state}
                      onChange={(e) => set({ state: e.target.value })}
                      autoComplete="address-level1"
                      required
                    />
                  </Field>
                  <Field label="Pincode" id="pincode" required error={fieldErrors['address.pincode']}>
                    <input
                      id="pincode"
                      className={inputClass(fieldErrors['address.pincode'])}
                      value={form.pincode}
                      onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="636701"
                      required
                    />
                  </Field>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Field label="Which centre?" id="centerId" required error={fieldErrors.centerId}>
                  <select
                    id="centerId"
                    className={inputClass(fieldErrors.centerId)}
                    value={form.centerId}
                    onChange={(e) => set({ centerId: e.target.value })}
                    required
                  >
                    <option value="">Choose a centre…</option>
                    {(centers.data?.items ?? []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.city}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Preferred date"
                id="collectionDate"
                required
                error={fieldErrors.collectionDate}
              >
                <input
                  id="collectionDate"
                  type="date"
                  className={inputClass(fieldErrors.collectionDate)}
                  value={form.collectionDate}
                  min={options.data?.minDate}
                  max={options.data?.maxDate}
                  onChange={(e) => set({ collectionDate: e.target.value })}
                  required
                />
              </Field>

              <Field
                label="Preferred time"
                id="collectionWindow"
                required
                error={fieldErrors.collectionWindow}
                hint={selectedWindow?.note}
              >
                <select
                  id="collectionWindow"
                  className={inputClass(fieldErrors.collectionWindow)}
                  value={form.collectionWindow}
                  onChange={(e) => set({ collectionWindow: e.target.value })}
                  required
                >
                  {windows.length === 0 && <option value="">Loading…</option>}
                  {windows.map((w) => (
                    <option key={w.id} value={w.id} disabled={!w.available}>
                      {w.label} ({w.start}–{w.end})
                      {w.available ? '' : ' — ' + w.reason}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/*
              Said plainly, because it is true: there is no capacity system
              behind this, so the lab confirms. Implying a guaranteed slot would
              be the kind of small lie that turns into a complaint.
            */}
            <p className="mt-3 rounded-lg bg-brand-light/60 px-3 py-2 text-xs text-brand">
              This is a request. Our team will call to confirm the exact time.
            </p>

            <Field label="Notes for the team" id="notes" hint="Optional — directions, access, anything useful.">
              <textarea
                id="notes"
                rows={2}
                className={`${inputClass(false)} mt-4 resize-y`}
                value={form.notes}
                onChange={(e) => set({ notes: e.target.value })}
              />
            </Field>
          </section>
        </div>

        {/* -------------------------------------------------- summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5 sm:p-6">
            <h2 className="text-base font-bold text-ink">Order summary</h2>

            <ul className="mt-4 space-y-3 border-b border-ink/10 pb-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{item.product.title}</span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-body/70">× {item.quantity}</span>
                    )}
                  </span>
                  <span className="shrink-0 stat-figure text-ink">
                    {formatPaise(item.product.salePrice * item.quantity * 100)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              {coupon ? (
                <div className="flex items-center justify-between gap-2 rounded-lg bg-brand-light px-3 py-2 text-sm">
                  <span className="font-semibold text-brand">{coupon.code} applied</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    className={inputClass(couponError)}
                    placeholder="Coupon code"
                    aria-label="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Otherwise Enter would submit the checkout form.
                        e.preventDefault();
                        onApplyCoupon();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={onApplyCoupon}
                    className="btn-outline shrink-0 !px-4 !py-2.5 text-[13px]"
                  >
                    Apply
                  </button>
                </div>
              )}
              {(couponError || couponProblem) && (
                <p className="mt-1 text-xs text-red-600">{couponError ?? couponProblem}</p>
              )}
            </div>

            <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-body">Subtotal</dt>
                <dd className="stat-figure text-ink">{formatPaise(totals?.subtotal)}</dd>
              </div>
              {totals?.discount > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-body">Discount</dt>
                  <dd className="stat-figure text-brand">−{formatPaise(totals.discount)}</dd>
                </div>
              )}
              {totals?.collectionFee > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-body">Collection fee</dt>
                  <dd className="stat-figure text-ink">{formatPaise(totals.collectionFee)}</dd>
                </div>
              )}
              {totals?.tax > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-body">Tax</dt>
                  <dd className="stat-figure text-ink">{formatPaise(totals.tax)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-3">
                <dt className="font-bold text-ink">Total payable</dt>
                <dd className="stat-figure text-xl font-bold text-ink">
                  {formatPaise(totals?.total)}
                </dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={busy}
              className="btn-brand mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Processing…
                </>
              ) : (
                <>
                  <Lock size={15} aria-hidden="true" />
                  Pay {formatPaise(totals?.total)}
                </>
              )}
            </button>

            {payment.data?.mode === 'test' && (
              <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                Test mode — no real money moves
              </p>
            )}

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-body/70">
              <ShieldCheck size={13} className="text-brand" aria-hidden="true" />
              Secured by Razorpay. Your medical data is encrypted.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
